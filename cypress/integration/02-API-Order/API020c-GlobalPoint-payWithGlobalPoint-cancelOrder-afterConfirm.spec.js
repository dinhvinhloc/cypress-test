describe('API020c - Global Point test - order canceled after confirm', function () {
    it('Test the case where order is canceled (after confirm) by user and Global Point returned', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1        
        const now = Cypress.dayjs().add(5,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const then = Cypress.dayjs().add(-1,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

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

        // Get all user punch points, extract to User Point of the store and his Global Point
        var userPointIDOfThisStore
        var userGlobalPoint
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{            
            console.log("OLD GLOBAL POINT")
            console.log(response)            

            userGlobalPoint = response

        }));
        
        // CREATE AN ORDER OF 9 x PG3P6 WHICH GIVE USER ~ 11380 global points
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id));
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P6.id,9,store1.AG3AO2.id,9).then((response)=>{
            // console.log("CART")
            // console.log(response);
            rewardItem = response.toBeAppliedPromotion
            // console.log(rewardItem);
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

        //----------------------------- CREATE A NEW ORDER AND CHECKOUT USING 10000 GLOBAL POINT -------------------------------
        // Login back as end user and REDEEM the REWARD ITEM
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))

        // Get User Point again and expect it to increase 3 x 7000 points

        var totalTaxAmount = 0;

        cy.waitUntil(() => 
            cy.wrap(order.appliedTaxes).each((taxObj) => {
                totalTaxAmount += taxObj.taxAmount
            })        
        );
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{            
            console.log("NEW GLOBAL POINT")
            console.log(response)            
           // expect(response).to.equal(userGlobalPoint + 10 * (order.totalAmount - order.taxAmount ));
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
        cy.waitUntil(() => cy.checkoutWithGlobalPoint(store1.storeID.id,toBeAppliedItems,10000).then((response)=>{
            // console.log(response);
            order = response;
        }));

        var confirmationInfo = {   "isPickUp": true,  }
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            confirmResponse = response
        }));
       
        cy.waitUntil(() => cy.cancelOrder(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
        }));
        
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{            
            console.log("NEW GLOBAL POINT AFTER ORDER CANCELED")
            console.log(response)            
            expect(response).to.equal(userGlobalPoint);
        }));


        cy.waitUntil(() => cy.getGlobalPointHistory().then((response)=>{
            console.log(response)
            let firstHistory = response[0]
            let secondHistory = response[1]

            expect(firstHistory).to.have.property('historyType', 'REVERTED');
            expect(firstHistory).to.have.property('globalPoints', 10000);
            expect(secondHistory).to.have.property('historyType', 'USED');
            expect(secondHistory).to.have.property('globalPoints', -10000);

        }));

    });
})
