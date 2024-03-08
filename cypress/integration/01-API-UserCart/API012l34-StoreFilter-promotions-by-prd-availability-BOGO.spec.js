const { upperCase } = require("lodash");

describe('API012l34 - Promotion availability based on Products availability - Buy One Get One', function () {
    it('GET store detail by storeId - filter Promotion based on availability - Buy One Get One', function () {
        
        //BP-1638 [Backend] Update getting store details to filter list of products in promotions by available products
        //PunchCard: At-least 1 Required Product and 1 Reward Product is necessary. If not then, Promotion is removed.

        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        
        var email
        var password        
        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        let deal
        let requiredProduct
        let rewardProduct
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.boPG3P4foPG1P1)
            requiredProduct = Object.assign({}, store1.PG3P4)
            rewardProduct = Object.assign({}, store1.PG1P1)
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
        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",requiredProduct.id));



        // GET Store detail and check that
        // boPG3P4foPG1P1 is not in the promotions list

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
        cy.waitUntil(() => cy.updateProductStatus("ACTIVE",requiredProduct.id));
        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",rewardProduct.id));


        // GET Store detail and check that
        // boPG3P4foPG1P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));

        // ------ Adding all requiredProduct to the cart and expect the cart is not suggested with the promotion
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,requiredProduct.id,1,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));
        
        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE all requiredProduct
        cy.waitUntil(() => cy.updateProductStatus("ACTIVE",rewardProduct.id));

        // Set availableTime of requiredProducts to the past
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.boPG3P4foPG1P1)
            requiredProduct = Object.assign({}, store1.PG3P4)
            rewardProduct = Object.assign({}, store1.PG1P1)
        })
        cy.wrap(requiredProduct).then(()=>{
            let dayInWeek = Cypress.dayjs().format('dddd');
            let twoMinuteAgo = Cypress.dayjs().subtract(2, 'minutes').format('HH:mm');
            let aMinuteAgo = Cypress.dayjs().subtract(1, 'minutes').format('HH:mm');

            requiredProduct.availableTime = [];
            requiredProduct.availableTime = [
                {
                    "day": upperCase(dayInWeek),
                    "fromTime": twoMinuteAgo,
                    "toTime": aMinuteAgo
                }
            ];
            console.log(requiredProduct)            
        })

        cy.waitUntil(() => cy.updateProduct(requiredProduct,requiredProduct.id));

        // GET Store detail and check that
        // boPG3P4foPG1P1 is not in the promotions list

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
        cy.waitUntil(() => cy.updateProduct(store1.PG3P4,store1.PG3P4.id));

        // Set availableTime of rewardProducts to the past
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.boPG3P4foPG1P1)
            requiredProduct = Object.assign({}, store1.PG3P4)
            rewardProduct = Object.assign({}, store1.PG1P1)
        })
        cy.wrap(rewardProduct).then(()=>{
            let dayInWeek = Cypress.dayjs().format('dddd');
            let twoMinuteAgo = Cypress.dayjs().subtract(2, 'minutes').format('HH:mm');
            let aMinuteAgo = Cypress.dayjs().subtract(1, 'minutes').format('HH:mm');
        
            rewardProduct.availableTime = [];
            rewardProduct.availableTime = [
                {
                    "day": upperCase(dayInWeek),
                    "fromTime": twoMinuteAgo,
                    "toTime": aMinuteAgo
                }
            ];
            console.log(rewardProduct)            
        })
        
        cy.waitUntil(() => cy.updateProduct(rewardProduct,rewardProduct.id));

        // GET Store detail and check that
        // boPG3P4foPG1P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));

        // ------ Adding all requiredProduct to the cart and expect the cart is not suggested with the promotion
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,requiredProduct.id,1,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // recover all involve products
        cy.waitUntil(() => cy.updateProduct(store1.PG1P1,store1.PG1P1.id));
        cy.waitUntil(() => cy.updateProduct(store1.PG3P4,store1.PG3P4.id));
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.boPG3P4foPG1P1)
            requiredProduct = Object.assign({}, store1.PG3P4)
            rewardProduct = Object.assign({}, store1.PG1P1)
        })
        // Set hideUntil of requiredProducts to the tomorrow
        
        cy.wrap(requiredProduct).then(()=>{
            let tomorrow = Cypress.dayjs().add(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
            requiredProduct.hideUntil = tomorrow
        })
        
        cy.waitUntil(() => cy.updateProduct(requiredProduct,requiredProduct.id));

        // GET Store detail and check that
        // boPG3P4foPG1P1 is not in the promotions list

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
        cy.waitUntil(() => cy.updateProduct(store1.PG3P4,store1.PG3P4.id));
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.boPG3P4foPG1P1)
            requiredProduct = Object.assign({}, store1.PG3P4)
            rewardProduct = Object.assign({}, store1.PG1P1)
        })
        // Set hideUntil of requiredProducts to the tomorrow
        
        cy.wrap(rewardProduct).then(()=>{
            let tomorrow = Cypress.dayjs().add(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
            rewardProduct.hideUntil = tomorrow
        })
        
        cy.waitUntil(() => cy.updateProduct(rewardProduct,rewardProduct.id));

        // GET Store detail and check that
        // boPG3P4foPG1P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));

        // ------ Adding all requiredProduct to the cart and expect the cart is not suggested with the promotion
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,requiredProduct.id,1,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));

        // ---------------------
        // Reset boPG3P4foPG1P1 and all products to original
        
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProduct(store1.PG1P1,store1.PG1P1.id));
        cy.waitUntil(() => cy.updateProduct(store1.PG3P4,store1.PG3P4.id));
        // cy.waitUntil(() => cy.updatePunchCard(store1.boPG3P4foPG1P1,store1.boPG3P4foPG1P1.id));

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
