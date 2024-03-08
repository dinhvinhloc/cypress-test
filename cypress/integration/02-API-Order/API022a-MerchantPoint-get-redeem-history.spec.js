describe('API022a - Merchant Point test - get merchant point - redeem and history', function () {
    it('Test that merchant is able to get his current point, redeem point and check history', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1        
        const now = Cypress.dayjs().add(5,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const then = Cypress.dayjs().add(-1,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

        var pointUse = 10000

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        // Login as merchant to get the coupon code
        
        var merchantID
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password).then((response)=>{
            merchantID = response.merchantID
            console.log(merchantID)
        });

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Get user's Global Point
        var userGlobalPoint
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            console.log(response)
            userGlobalPoint = response
        }));

        // CREATE AN ORDER OF 9 x PG3P6 WHICH GIVE USER ~ 11380 global points
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id));
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P6.id,9,store1.AG3AO2.id,9).then((response)=>{
            console.log("CART")
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
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
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
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
        cy.waitUntil(() => cy.confirmPaid(order.id)); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept",""));
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }));
        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready",""));
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            expect(response).to.have.property('status', 'COMPLETED');
        }));        


        // GET CURRENT MERCHANT POINT
        var merchantPoint
        cy.waitUntil(() => cy.getMerchantPoints().then((response)=>{
            merchantPoint = response
            console.log("MERCHANT POINT BEFORE PAID")
            console.log(response)
        }));


        //----------------------------- CREATE A NEW ORDER AND CHECKOUT USING pointUse GLOBAL POINT -------------------------------
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))
        var totalTaxAmount = 0;

        cy.waitUntil(() => 
            cy.wrap(order.appliedTaxes).each((taxObj) => {
                totalTaxAmount += taxObj.taxAmount
            })        
        );

        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            console.log("NEW GLOBAL POINT")
            console.log(response)
          //expect(response).to.equal(userGlobalPoint + 10 * (order.totalAmount - order.taxAmount ));  
            expect(response).to.equal(userGlobalPoint + Math.trunc(10 * (order.subAmount-order.discountAmount)));
            userGlobalPoint = response
        }));

        

        rewardItem = [];
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,1,store1.AG1AO1.id,1).then((response)=>{
            // console.log("CART")
            // console.log(response);
            rewardItem = response.toBeAppliedPromotion
            // console.log(rewardItem);
        }));
        cy.wrap(toBeAppliedItems).then(()=>{
            toBeAppliedItems = []
        })
        // Construct the toBeAppliedItems json
        // cy.waitUntil(() => 
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
        // );

        // Check out the order
        var order
        cy.waitUntil(() => cy.checkoutWithGlobalPoint(store1.storeID.id,toBeAppliedItems,pointUse).then((response)=>{
            console.log(response);
            order = response;
        }));
       
        var confirmationInfo = {   "isPickUp": true,  }
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
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
        cy.waitUntil(() => cy.confirmPaid(order.id)); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept",""));
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }));
        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready",""));
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            expect(response).to.have.property('status', 'COMPLETED');
        }));

        // CHECK MERCHANT POINT AGAIN AFTER ORDER IS COMPLETED
        // MERCHANT SHOULD HAVE ADDITIONAL OF pointUse POINTS
        cy.waitUntil(() => cy.getMerchantPoints().then((response)=>{
            console.log(response)
            // expect(response).to.have.property('merchantId',merchantID);
            expect(response.redeemablePoints).to.equal(merchantPoint.redeemablePoints + pointUse);
            // merchantPoint = response.point
            console.log("MERCHANT POINT AFTER PAID")
            console.log(response)
        }));

        // MERCHANT TO REDEEM pointUse POINTS        

        cy.waitUntil(() => cy.redeemMerchantPoint(pointUse).then((response)=>{
            // expect(response).to.have.property('merchantId',merchantID);
            expect(response.redeemablePoints).to.equal(merchantPoint.redeemablePoints);
            // merchantPoint = response.point
            console.log("MERCHANT POINT AFTER REDEEM")
            console.log(response)
        }));

        // CHECK MERCHANT POINT HISTORY

        cy.waitUntil(() => cy.getMerchantPointsHistory().then((response)=>{
            console.log(response)
            expect(response[response.length -1]).to.have.property('historyType','REDEEMED');
            expect(response[response.length -1]).to.have.property('pointAfter',merchantPoint.redeemablePoints);
            expect(response[response.length -1]).to.have.property('pointBefore',merchantPoint.redeemablePoints + pointUse);

            expect(response[response.length -2]).to.have.property('historyType','ADDED');
            expect(response[response.length -2]).to.have.property('pointAfter',merchantPoint.redeemablePoints + pointUse);
            expect(response[response.length -2]).to.have.property('pointBefore',merchantPoint.redeemablePoints);

            // merchantPoint = response.point
            console.log("MERCHANT POINT FINAL HISTORY ")
            console.log(response.length - 1)
            console.log("MERCHANT POINT FINAL HISTORY - 1")
            console.log(response.length - 2)
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            console.log("NEW GLOBAL POINT AFTER SPENT " + pointUse)
            console.log(response)
            expect(response).to.equal(userGlobalPoint + Math.trunc(10 * (order.subAmount-order.discountAmount)) - pointUse);            
            userGlobalPoint = response
        }));


    });
})
