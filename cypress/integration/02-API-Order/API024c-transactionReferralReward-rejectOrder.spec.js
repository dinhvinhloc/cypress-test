describe('API024c - Test transactional referral reward will not be added if order is rejected', function () {
    it('Test that the referrers at each leavel will will not be added if order is rejected', function () {
        
        // REFERRAL HIERACHY:
        // enduser000x (userId: 181) -> enduser0001 (userId: 167) -> enduser0002 (userId: 173) -> enduser0003 (userId: 174)
        //                                                        -> enduser0004 (userId: 179) -> enduser0005 (userId: 180)
        
        // Create and complete an order for enduser0003, expect enduser0002, enduser0001m enduser000x to get points
        
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')

        var store1        

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        // Login as merchant to get the merchantId
        
        var merchantID
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password).then((response)=>{
            merchantID = response.merchantID
            console.log(merchantID)
        });

        // Get Global Point of the users before order

        email = Cypress.env('enduser000x');
        password = Cypress.env('enduser000xPass');
        cy.Login(email, password);
        
        var userxGlobalPoint
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            userxGlobalPoint = response
        }));
        var userxGlobalPointSummary
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            // console.log(response)
            userxGlobalPointSummary = response
            userxGlobalPointSummary.pointsAtLevel = []
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                    userxGlobalPointSummary.pointsAtLevel[0] = transaction.globalPoints
                } else if (transaction.level == 2){
                    userxGlobalPointSummary.pointsAtLevel[1] = transaction.globalPoints
                } else if (transaction.level == 3){
                    userxGlobalPointSummary.pointsAtLevel[2] = transaction.globalPoints
                }
            })
            console.log(userxGlobalPointSummary)
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        
        var user1GlobalPoint
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            user1GlobalPoint = response
        }));
        var user1GlobalPointSummary
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            // console.log(response)
            user1GlobalPointSummary = response
            user1GlobalPointSummary.pointsAtLevel = []
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                    user1GlobalPointSummary.pointsAtLevel[0] = transaction.globalPoints
                } else if (transaction.level == 2){
                    user1GlobalPointSummary.pointsAtLevel[1] = transaction.globalPoints
                } else if (transaction.level == 3){
                    user1GlobalPointSummary.pointsAtLevel[2] = transaction.globalPoints
                }
            })
            console.log(user1GlobalPointSummary)
        }));

        email = Cypress.env('enduser0002');
        password = Cypress.env('enduser0002Pass');
        cy.Login(email, password);
        
        var user2GlobalPoint
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            user2GlobalPoint = response
        }));
        var user2GlobalPointSummary
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            // console.log(response)
            user2GlobalPointSummary = response
            user2GlobalPointSummary.pointsAtLevel = []
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                    user2GlobalPointSummary.pointsAtLevel[0] = transaction.globalPoints
                } else if (transaction.level == 2){
                    user2GlobalPointSummary.pointsAtLevel[1] = transaction.globalPoints
                } else if (transaction.level == 3){
                    user2GlobalPointSummary.pointsAtLevel[2] = transaction.globalPoints
                }
            })
            console.log(user2GlobalPointSummary)
        }));

        email = Cypress.env('enduser0003');
        password = Cypress.env('enduser0003Pass');
        cy.Login(email, password);
        
        var user3GlobalPoint
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            user3GlobalPoint = response
        }));
        var user3GlobalPointSummary
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            // console.log(response)
            user3GlobalPointSummary = response
            user3GlobalPointSummary.pointsAtLevel = []
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                    user3GlobalPointSummary.pointsAtLevel[0] = transaction.globalPoints
                } else if (transaction.level == 2){
                    user3GlobalPointSummary.pointsAtLevel[1] = transaction.globalPoints
                } else if (transaction.level == 3){
                    user3GlobalPointSummary.pointsAtLevel[2] = transaction.globalPoints
                }
            })
            console.log(user3GlobalPointSummary)
        }));

        
        // CREATE AN ORDER OF 9 x PG3P6 WHICH GIVE enduser0003 ~ 11380 global points
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
        
        var cardID = Cypress.env('enduser0003Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0003');
        password = Cypress.env('enduser0003Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id)); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"reject",{ rejectMessage: 'Transactional Referral order is rejected'}).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'REFUNDED');
            expect(response).to.have.property('serveStatus', 'REJECTED');

        }));

        // CHECK GLOBAL POINT OF THE USERS

        email = Cypress.env('enduser0003');
        password = Cypress.env('enduser0003Pass');
        cy.Login(email, password);
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            expect(response).to.equal(user3GlobalPoint);
        }));
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            console.log(response)
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){

                } else if (transaction.level == 2){

                } else if (transaction.level == 3){

                }
            })
        }));

        email = Cypress.env('enduser0002');
        password = Cypress.env('enduser0002Pass');
        cy.Login(email, password);
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            expect(response).to.equal(user2GlobalPoint);
        }));
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            console.log(response)
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                    expect(transaction.globalPoints).to.equal(user2GlobalPointSummary.pointsAtLevel[0])
                } else if (transaction.level == 2){

                } else if (transaction.level == 3){

                }
            })
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            expect(response).to.equal(user1GlobalPoint);
        }));
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            console.log(response)
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                } else if (transaction.level == 2){
                    expect(transaction.globalPoints).to.equal(user1GlobalPointSummary.pointsAtLevel[1])
                } else if (transaction.level == 3){
                }
            })
        }));

        email = Cypress.env('enduser000x');
        password = Cypress.env('enduser000xPass');
        cy.Login(email, password);
        
        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
            // console.log(response)
            expect(response).to.equal(userxGlobalPoint);
        }));
        cy.waitUntil(() => cy.getGlobalPointHistorySummary().then((response)=>{
            console.log(response)
            cy.wrap(response.transactionReferralReward).each((transaction)=>{
                if (transaction.level == 1){
                } else if (transaction.level == 2){
                } else if (transaction.level == 3){
                    expect(transaction.globalPoints).to.equal(userxGlobalPointSummary.pointsAtLevel[2])
                }
            })            
        }));

    });
})
