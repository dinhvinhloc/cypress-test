const { upperCase } = require("lodash");

describe('API012l3 - Check the availability of all store items based on configuration - Promotion  ', function () {
    it('GET store detail by storeId - filter as Promotion configuration', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        
        var email
        var password        
        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        let temp
        cy.wrap(store1).then(()=>{
            temp = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)
        })


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            console.log(storeInfo);
            expect(storeInfo.promotions[0]).to.have.property('dealType', 'DEAL_MULTI_COMBO');
            expect(storeInfo.promotions[0]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[1]).to.have.property('dealType', 'DEAL_MULTI_BUNDLE');
            expect(storeInfo.promotions[1]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[2]).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(storeInfo.promotions[2]).to.have.property('type', 'POINT_PERK');

            expect(storeInfo.promotions[3]).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(storeInfo.promotions[3]).to.have.property('type', 'PUNCH_CARD');

            expect(storeInfo.promotions[4]).to.have.property('dealType', 'DEAL_FREE_ITEM');
            expect(storeInfo.promotions[4]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[5]).to.have.property('dealType', 'DEAL_FREE_ITEM');
            expect(storeInfo.promotions[5]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[6]).to.have.property('dealType', 'DEAL_FREE_ITEM');
            expect(storeInfo.promotions[6]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[7]).to.have.property('dealType', 'DEAL_BUY_ONE_GET_ONE');
            expect(storeInfo.promotions[7]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[8]).to.have.property('dealType', 'DEAL_DISCOUNT_ITEMS_P');
            expect(storeInfo.promotions[8]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[9]).to.have.property('dealType', 'DEAL_DISCOUNT_CART_F');
            expect(storeInfo.promotions[9]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[10]).to.have.property('dealType', 'DEAL_DISCOUNT_CART_P');
            expect(storeInfo.promotions[10]).to.have.property('type', 'DEAL');

            expect(storeInfo.promotions[11]).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(storeInfo.promotions[11]).to.have.property('type', 'REWARD_ITEM');
        })); 


        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE deal10CADPG1P1PG2P1PG3P1
        cy.log("TEST INACTIVE PRODUCT")
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",temp.id));



        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(temp.id);

        })); 

        cy.log("TEST availableFrom/To PRODUCT")

        // ------------------ Filter Promotion by availableFrom/To        
        // Recover original info
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",temp.id));
        cy.waitUntil(() => cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        // Set ACTIVE deal10CADPG1P1PG2P1PG3P1, availabelFrom/avalableTo
        cy.wrap(store1).then(()=>{temp = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)})

        cy.wrap(temp).then(()=>{
            let yesterday = Cypress.dayjs().add(-1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
            let aMinuteAgo = Cypress.dayjs().add(-1, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
            temp.availableFrom = yesterday
            temp.availableTo = aMinuteAgo
            // console.log(temp)            
        })

        cy.waitUntil(() => cy.updateDeal(temp,temp.id));


        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(temp.id);
            // console.log(IDList)
        })); 

        cy.log("TEST isNewClient PRODUCT")

        // ------------------ Filter Promotion by isNewClient        
        // Recover original info
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",temp.id));
        cy.waitUntil(() => cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        // Set ACTIVE deal10CADPG1P1PG2P1PG3P1, availabelFrom/avalableTo
        cy.wrap(store1).then(()=>{temp = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)})

        cy.wrap(temp).then(()=>{
            temp.isNewClient = true;
            // console.log(temp)            
        })

        cy.waitUntil(() => cy.updateDeal(temp,temp.id));


        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(temp.id);
            // console.log(IDList)
        }));

        cy.log("TEST maxRedeem PRODUCT")

        // ------------------ Filter Promotion by maxRedeem        
        // Recover original info
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",temp.id));
        cy.waitUntil(() => cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        // Set maxRedeem of deal10CADPG1P1PG2P1PG3P1, to 1
        cy.wrap(store1).then(()=>{temp = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)})

        cy.wrap(temp).then(()=>{
            temp.maxRedeem = 1;
            // console.log(temp)            
        })

        cy.waitUntil(() => cy.updateDeal(temp,temp.id));


        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(temp.id);
            // console.log(IDList)
        }));

        cy.log("TEST limitedStock PRODUCT")

        // ------------------ Filter Promotion by limitedStock        
        // Recover original info
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",temp.id));
        cy.waitUntil(() => cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        // Set ACTIVE deal10CADPG1P1PG2P1PG3P1, availabelFrom/avalableTo
        cy.wrap(store1).then(()=>{temp = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)})

        cy.wrap(temp).then(()=>{
            temp.limitedStock = 1;
            console.log(temp)            
        })

        cy.waitUntil(() => cy.updateDeal(temp,temp.id).then((response)=>{
            console.log(response)
        }));


        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.contain(temp.id);
            console.log(IDList)
        }));

        ////// Create an order to use up the limitedStock

        let rewardItem 
        let comboDealInfo

        cy.wrap(store1).then(()=>{comboDealInfo = Object.assign({}, store1.deal10CADPG1P1PG2P1PG3P1)})

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,1,store1.AG1AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 1);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);

            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', comboDealInfo.id);

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P1.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.items[1]).to.have.property('productId', store1.PG2P1.id);
            expect(response.items[1]).to.have.property('quantity', 1);
            expect(response.items[1].addons[0]).to.have.property('productId', store1.AG2AO1.id);
            expect(response.items[1].addons[0]).to.have.property('quantity', 1);
            
            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', comboDealInfo.id);
                        
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P1.id,2,null,null).then((response)=>{
            console.log(response);
            expect(response.items[2]).to.have.property('productId', store1.PG3P1.id);
            expect(response.items[2]).to.have.property('quantity', 2);


            // Check suggested Promotion
            expect(response.appliedPromotion[0]).to.have.property('id', comboDealInfo.id);  
            expect(response).to.have.property('discountAmount', comboDealInfo.discountAmount);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem = response.toBeAppliedPromotion

        }));


        var toBeAppliedItems = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() => 
            cy.wrap(rewardItem).each((item)=>{

                toBeAppliedItems.push(
                    {
                    "appliedPromotionId": item.id,
                        "quantity": item.rewardProductList[0].quantity,
                    "instruction": "This is a Free Item",
                    "productId": item.rewardProductList[0].id,
                    "addons": [
                        {
                        "quantity": 1,
                        "instruction": "Addon on Free Item is here",
                        "productId": store1.AG3AO1.id,
                        "addon": true
                        },
                        {
                        "quantity": 1,
                        "instruction": "Addon on Free Item is here",
                        "productId": store1.AG2AO1.id,
                        "addon": true
                        }
                    ],
                    "addon": true
                    })
                
            })
        );


        // Check out the order
        var order
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems).then((response)=>{
            console.log(response);
            order = response;
        }));

       
        var confirmationInfo = {   "isPickUp": true,  }
       
        // Confirm the order
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
       
        var cardID = Cypress.env('enduser0001Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id).then((response)=>{
            console.log(response);
        })); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept","").then((response)=>{
            console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
            console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
        }));
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
        }));

        // GET Store detail and check that
        // deal10CADPG1P1PG2P1PG3P1 is not in the promotions list
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // let result = objArray.map(a => a.foo);
            let IDList = storeInfo.promotions.map(a => a.id);
            expect(IDList).to.not.contain(temp.id);
            console.log(IDList)
        }));





        // ---------------------
        // Reset deal10CADPG1P1PG2P1PG3P1 to original
        
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
    });
})
