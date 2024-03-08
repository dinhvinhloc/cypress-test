describe('API025a - Subsciptions Management endpoints test', function () {
    it('Verify the endpoints that are being used for managing the Subscriptions', function () {
        
        // Test points:
        // 1. Create a store
        // 2. Create a product category
        // 3. Subscribe to the created product category
        // 4. Get all the subscribed product categories, assert the existence of the just subscribed one
        // 5. Subscribe to the Store
        // 6. Subscribe with city
        // 7. Get Master data
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1
        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));   
        
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productCategory.json').as('pcInfo')

        var pcInfo
        var createdCategory;
        
        cy.waitUntil(() => cy.get('@pcInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Subsciption Test ' + today;
            info.description = 'Description: Created date: ' + today;            
            pcInfo = info
        }));

        cy.waitUntil(()=> cy.createProductCategory(pcInfo).then((response)=>{
            expect(response).to.have.property('name', pcInfo.name);
            expect(response).to.have.property('description', pcInfo.description);
            createdCategory = response
            console.log(createdCategory);
        }));    

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        
        var subscription1
        cy.waitUntil(()=> cy.subscribeTopic(createdCategory.name, "INDUSTRY_OR_CATEGORY", "Toronto").then((response)=>{
            console.log(response)
            expect(response).to.have.property('city', 'Toronto');
            expect(response).to.have.property('subscriptionType', 'INDUSTRY_OR_CATEGORY');
            expect(response).to.have.property('topic', createdCategory.name);
            expect(response).to.have.property('topicDisplayName', createdCategory.name);
            subscription1 = response
        }));
        
        cy.waitUntil(()=> cy.unsubscribeTopic(store1.storeID.id,"STORE", null).then((response)=>{
            console.log(response)
            
        }));

        var subscription2
        cy.waitUntil(()=> cy.subscribeTopic(store1.storeID.id, "STORE", null).then((response)=>{
            console.log(response)
            expect(response).to.have.property('city', null);
            expect(response).to.have.property('subscriptionType', 'STORE');
            expect(response).to.have.property('topic', store1.storeID.id);
            expect(response).to.have.property('topicDisplayName', store1.storeID.name);
            subscription2 = response
        }));

        var subscription3
        cy.waitUntil(()=> cy.subscribeTopic(createdCategory.name, "INDUSTRY_OR_CATEGORY", "Markham").then((response)=>{
            console.log(response)
            expect(response).to.have.property('city', 'Markham');
            expect(response).to.have.property('subscriptionType', 'INDUSTRY_OR_CATEGORY');
            expect(response).to.have.property('topic', createdCategory.name);
            expect(response).to.have.property('topicDisplayName', createdCategory.name);
            subscription3 = response
        }));

        cy.waitUntil(()=> cy.getAllSubscriptions().then((response)=>{
            console.log(response)
            let topics = response.map(a => a.topic);
            let topicDisplayNames = response.map(a => a.topicDisplayName);
            let cities = response.map(a => a.city);
            expect(topics).to.have.contains(createdCategory.name);
            expect(topicDisplayNames).to.have.contains(createdCategory.name);
            expect(topicDisplayNames).to.have.contains(store1.storeID.name);
            expect(topics).to.have.contains(store1.storeID.id);
            expect(cities).to.have.contains("Markham");
            expect(cities).to.have.contains("Toronto");
        }));
        var mySubscribedTopic = null
        cy.waitUntil(()=> cy.getSubscriptionsMasterData().then((response)=>{
            console.log(response)
            expect(response.cities).to.be.an('array').that.is.empty;
            
            cy.wrap(response.subscriptions).each((subscription)=>{
                
                if (subscription.category == createdCategory.name){
                    mySubscribedTopic = subscription
                }
            })

        }));

        cy.wrap(mySubscribedTopic).then(()=>{
            expect(mySubscribedTopic).to.not.be.null
            expect(mySubscribedTopic).to.have.property('category', createdCategory.name);
            expect(mySubscribedTopic).to.have.property('isCategory', true);
            expect(mySubscribedTopic.subscribedCities).to.have.contains("Markham");
            expect(mySubscribedTopic.subscribedCities).to.have.contains("Toronto");
        })

        cy.waitUntil(()=> cy.getSubscriptionsMasterData("Ontario").then((response)=>{
            console.log(response)
            var cities = response.cities
            expect(cities).to.have.contains("Markham");
            expect(cities).to.have.contains("Toronto");
            mySubscribedTopic = null
            cy.wrap(response.subscriptions).each((subscription)=>{
                
                if (subscription.category == createdCategory.name){
                    mySubscribedTopic = subscription
                }
            })
        }));

        cy.wrap(mySubscribedTopic).then(()=>{
            expect(mySubscribedTopic).to.not.be.null
            expect(mySubscribedTopic).to.have.property('category', createdCategory.name);
            expect(mySubscribedTopic.subscribedCities).to.have.contains("Markham");
            expect(mySubscribedTopic.subscribedCities).to.have.contains("Toronto");
        })

        cy.waitUntil(()=> cy.unsubscribeTopic(createdCategory.name,"INDUSTRY_OR_CATEGORY", "Toronto").then((response)=>{
            console.log(response)
            
        }));

        cy.waitUntil(()=> cy.unsubscribeTopic(createdCategory.name,"INDUSTRY_OR_CATEGORY", "Markham").then((response)=>{
            console.log(response)
            
        }));

        cy.waitUntil(()=> cy.unsubscribeTopic(store1.storeID.id,"STORE", null).then((response)=>{
            console.log(response)
            
        }));

        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.deleteProductCategory(createdCategory.id).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
