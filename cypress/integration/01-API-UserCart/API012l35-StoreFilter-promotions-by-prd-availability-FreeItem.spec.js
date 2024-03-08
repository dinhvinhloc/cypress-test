const { upperCase } = require("lodash");

describe('API012l35 - Promotion availability based on Products availability - Free Item', function () {
    it('GET store detail by storeId - filter Promotion based on availability - Free Item   ', function () {
        
        //BP-1638 [Backend] Update getting store details to filter list of products in promotions by available products
        //GetFreeItem/PercentDiscountOnSelectedItem: At-least 1 Reward Product is necessary.

        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        
        var email
        var password        
        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        let deal
        let rewardProduct
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.freePG3P1At250)
            rewardProduct = Object.assign({}, store1.PG3P1)
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
        cy.waitUntil(() => cy.updateProductStatus("INACTIVE",rewardProduct.id));

        // GET Store detail and check that
        // freePG3P1At250 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));
        
        
        // ------ Adding a large number of item to the cart and expect the cart is not suggested with the promotion
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P7.id,10,null,null).then((response)=>{
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
        
        // Set availableTime of requiredProducts to the past
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.freePG3P1At250)
            rewardProduct = Object.assign({}, store1.PG3P1)
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
        })

        cy.waitUntil(() => cy.updateProduct(rewardProduct,rewardProduct.id));

        // GET Store detail and check that
        // freePG3P1At250 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));

                // ------ Adding a large number of item to the cart and expect the cart is not suggested with the promotion
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P7.id,10,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));

        // // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // recover all involve products
        cy.waitUntil(() => cy.updateProduct(store1.PG3P1,store1.PG3P1.id));
        cy.wrap(store1).then(()=>{
            deal = Object.assign({}, store1.freePG3P1At250)
            rewardProduct = Object.assign({}, store1.PG3P1)
        })
        // Set hideUntil of requiredProducts to the tomorrow
        
        cy.wrap(rewardProduct).then(()=>{
            let tomorrow = Cypress.dayjs().add(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
            rewardProduct.hideUntil = tomorrow
        })
        
        cy.waitUntil(() => cy.updateProduct(rewardProduct,rewardProduct.id));

        // GET Store detail and check that
        // freePG3P1At250 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(deal.id);

        }));
        // ------ Adding a large number of item to the cart and expect the cart is not suggested with the promotion
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P7.id,10,null,null).then((response)=>{
            console.log(response);

            let suggestedIDList = response.suggestedPromotion.map(a => a.id);
            expect(suggestedIDList).to.not.contain(deal.id);

            let appliedIDList = response.appliedPromotion.map(b => b.id);
            expect(appliedIDList).to.not.contain(deal.id);

        }));
        // ---------------------
        // Reset freePG3P1At250 and all products to original
        
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateProduct(store1.PG3P1,store1.PG3P1.id));
        // cy.waitUntil(() => cy.updateRewardItem(store1.freePG3P1At250,store1.freePG3P1At250.id));

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
