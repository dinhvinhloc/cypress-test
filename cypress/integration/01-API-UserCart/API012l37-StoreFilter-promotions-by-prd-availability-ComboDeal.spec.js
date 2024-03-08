const { upperCase } = require("lodash");

describe('API012l37 - Promotion availability based on Products availability - Combo Deal', function () {
    it('GET store detail by storeId - filter Promotion based on availability - Combo Deal', function () {
        
        //BP-1638 [Backend] Update getting store details to filter list of products in promotions by available products
        //Combo/Bundle Deal: At-least 1 Product from each GroupIndex in RequiredProductList is necessary.

        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        
        var email
        var password        
        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        let deal
        let requiredProduct1
        let requiredProduct2
        let requiredProduct3

        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)
            requiredProduct1 = Object.assign({}, store1.PG1P1)
            requiredProduct2 = Object.assign({}, store1.PG2P1)
            requiredProduct3 = Object.assign({}, store1.PG3P1)

        })

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.contain(deal.id);

        }));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE all requiredProduct
        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",requiredProduct2.id));
        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",requiredProduct3.id));

        // ------ Adding requiredProduct1 to the cart and expect the cart is not suggested with the promotion
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,requiredProduct1.id,1,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));



        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",requiredProduct1.id));




        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        })); 

                
        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE all requiredProduct
        cy.waitUntil(() => cy.updateProductStatus("ACTIVE",requiredProduct1.id));
        cy.waitUntil(() => cy.updateProductStatus("ACTIVE",requiredProduct2.id));
        cy.waitUntil(() => cy.updateProductStatus("ACTIVE",requiredProduct3.id));

        // Set availableTime of requiredProducts to the past
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)
            requiredProduct1 = Object.assign({}, store1.PG1P1)
            requiredProduct2 = Object.assign({}, store1.PG2P1)
            requiredProduct3 = Object.assign({}, store1.PG3P1)

        })
        cy.wrap(requiredProduct1, requiredProduct2, requiredProduct3).then(()=>{
            let dayInWeek = Cypress.dayjs().format('dddd');
            let twoMinuteAgo = Cypress.dayjs().subtract(2, 'minutes').format('HH:mm');
            let aMinuteAgo = Cypress.dayjs().subtract(1, 'minutes').format('HH:mm');

            requiredProduct1.availableTime = requiredProduct2.availableTime = requiredProduct3.availableTime = [];
            requiredProduct1.availableTime = requiredProduct2.availableTime = requiredProduct3.availableTime = [
                {
                    "day": upperCase(dayInWeek),
                    "fromTime": twoMinuteAgo,
                    "toTime": aMinuteAgo
                }
            ];
            console.log(requiredProduct1)            
        })
        cy.waitUntil(() => cy.updateProduct(requiredProduct2,requiredProduct2.id));
        cy.waitUntil(() => cy.updateProduct(requiredProduct3,requiredProduct3.id));
        
        // ------ Adding requiredProduct1 to the cart and expect the cart is not suggested with the promotion
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,requiredProduct1.id,1,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));



        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        
        
        cy.waitUntil(() => cy.updateProduct(requiredProduct1,requiredProduct1.id));



        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));


        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // recover all involve products
        cy.waitUntil(() => cy.updateProduct(store1.PG1P1,store1.PG1P1.id));
        cy.waitUntil(() => cy.updateProduct(store1.PG2P1,store1.PG2P1.id));
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)
            requiredProduct1 = Object.assign({}, store1.PG1P1)
            requiredProduct2 = Object.assign({}, store1.PG2P1)
            requiredProduct3 = Object.assign({}, store1.PG3P1)

        })
        // Set hideUntil of requiredProducts to the tomorrow
        
        cy.wrap(requiredProduct1, requiredProduct2).then(()=>{
            let tomorrow = Cypress.dayjs().add(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
            requiredProduct1.hideUntil = tomorrow
            requiredProduct2.hideUntil = tomorrow
            requiredProduct3.hideUntil = tomorrow

        })
        
        cy.waitUntil(() => cy.updateProduct(requiredProduct2,requiredProduct2.id));
        cy.waitUntil(() => cy.updateProduct(requiredProduct3,requiredProduct3.id));

        // ------ Adding requiredProduct1 to the cart and expect the cart is not suggested with the promotion
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,requiredProduct1.id,1,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));


        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProduct(requiredProduct1,requiredProduct1.id));


        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));

        // ---------------------
        // Reset deal10CADPG1P1PG2P1PG3P1 and all products to original
        
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProduct(store1.PG1P1,store1.PG1P1.id));
        cy.waitUntil(() => cy.updateProduct(store1.PG2P1,store1.PG2P1.id));
        cy.waitUntil(() => cy.updateProduct(store1.PG3P1,store1.PG3P1.id));

        // cy.waitUntil(() => cy.updatePointPerk(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.contain(deal.id);

        }));
    });
})
