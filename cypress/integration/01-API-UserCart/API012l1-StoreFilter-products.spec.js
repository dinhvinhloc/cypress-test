const { upperCase } = require("lodash");

describe('API012l1 - Check the availability of all store items based on configuration - Product  ', function () {
    it('GET store detail by storeId - filter as Product configuration', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        
        var email
        var password        
        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        let temp
        cy.wrap(store1).then(()=>{temp = Object.assign({}, store1.PG3P7)})

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE PG3P7
        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",temp.id));



        // GET Store detail and check that
        // PG3P7 is not in the products list
        // PG3 should not contain PG2P7

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let productIDList = storeInfo.products.map(a => a.id);
            expect(productIDList).to.not.contain(temp.id);
            
            cy.wrap(storeInfo.productGroups).each((group)=>{
                if (group.id == store1.PG3.id){
                    expect(group.products).to.not.contain(temp.id);
                } 
            })
            // console.log(productIDList)
        })); 


        // Set ACTIVE PG3P7, Set available time to TODAY and 1 minute ago
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProductStatus("ACTIVE",temp.id));

        cy.wrap(temp).then(()=>{
            let dayInWeek = Cypress.dayjs().format('dddd');
            let twoMinuteAgo = Cypress.dayjs().subtract(2, 'minutes').format('HH:mm');
            let aMinuteAgo = Cypress.dayjs().subtract(1, 'minutes').format('HH:mm');

            temp.availableTime = [];
            temp.availableTime = [
                {
                    "day": upperCase(dayInWeek),
                    "fromTime": twoMinuteAgo,
                    "toTime": aMinuteAgo
                }
            ];
            console.log(temp)            
        })

        cy.waitUntil(() => cy.updateProduct(temp,temp.id));

        // GET Store detail and check that
        // PG3P7 is not in the products list
        // PG3 should not contain PG2P7
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            console.log(storeInfo)
            expect(storeInfo.store.serveOptions).deep.equal(['PICKUP', 'DELIVERY', 'DINE_IN']);
            let productIDList = storeInfo.products.map(a => a.id);
            expect(productIDList).to.not.contain(temp.id);

            cy.wrap(storeInfo.productGroups).each((group)=>{
                if (group.id == store1.PG3.id){
                    expect(group.products).to.not.contain(temp.id);
                } 
            })
            console.log(productIDList)
        })); 


        // Recover original info
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProduct(store1.PG3P7,store1.PG3P7.id));
        // Set ACTIVE PG3P7, Set Hide unitl tomorrow
        cy.wrap(store1).then(()=>{temp = Object.assign({}, store1.PG3P7)})

        cy.wrap(temp).then(()=>{
            let tomorrow = Cypress.dayjs().add(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
            temp.hideUntil = tomorrow
            console.log(temp)            
        })

        cy.waitUntil(() => cy.updateProduct(temp,temp.id));


        // GET Store detail and check that
        // PG3P7 is not in the products list
        // PG3 should not contain PG2P7
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            let productIDList = storeInfo.products.map(a => a.id);
            expect(productIDList).to.not.contain(temp.id);
            cy.wrap(storeInfo.productGroups).each((group)=>{
                if (group.id == store1.PG3.id){
                    expect(group.products).to.not.contain(temp.id);
                } 
            })
            console.log(productIDList)
        })); 


        
        // ---------------------
        // Reset PG3P7 to original
        
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProduct(store1.PG3P7,store1.PG3P7.id));
    });
})
