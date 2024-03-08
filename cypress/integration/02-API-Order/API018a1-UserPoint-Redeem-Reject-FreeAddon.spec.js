describe('API018a1 - User Point test', function () {
    it('Verify User Point is not changed when Redeem order is rejected', function () {
        
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

        var deal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.rewardPG1P2.id).then((response)=>{
            console.log(response);
            return deal = response
        }));
        
        // Change the Reward Item to Addon Free
        cy.wrap(deal).then(()=>{
            deal.isAddonCharged = false;
            cy.updateRewardItem(deal,deal.id).then((response)=>{
                expect(response).to.have.property("isAddonCharged",false);
            })
        })


        var pointPerkDeal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.pointPerkPG3P5.id).then((response)=>{
            console.log(response);
            return pointPerkDeal = response
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Get all user punch points, extract to User Point of the store and his Global Point
        var userPointIDOfThisStore
        var globalUserPoint
        cy.waitUntil(() => cy.getUserPoints().then((response)=>{
            cy.wrap(response).each((userPoint)=>{
                if (userPoint.merchantId == merchantID){
                    userPointIDOfThisStore = userPoint
                    console.log(userPointIDOfThisStore)
                } else if (userPoint.merchantId == null){
                    globalUserPoint = userPoint
                    console.log(globalUserPoint)
                }
            })
        }));

        

        //----------------------------- REDEEM REWARD ITEM -------------------------------
        // Login back as end user and REDEEM the REWARD ITEM
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        var redeemProductList = []
        // Construct the redeemProductList json
        cy.waitUntil(() => 
            cy.wrap(deal.rewardProductList).each((item)=>{
                redeemProductList.push(
                    {
                    "quantity": item.quantity,
                    "instruction": "This is Redeem Item",
                    "productId": item.id,
                    "addons": [
                        {
                        "quantity": 1,
                        "instruction": "Addon For Redeem Item",
                        "productId": store1.AG1AO1.id,
                        "addon": true
                        },
                        {
                        "quantity": 1,
                        "instruction": "Addon For Redeem Item",
                        "productId": store1.AG1AO2.id,
                        "addon": true
                        }
                    ],
                    "addon": true
                    })
                
            })
        );
        
        // Redeem the Order using Point
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, deal.id, redeemProductList).then((response) => {
            console.log(response);
        }));


        // Check out the order
        var toBeAppliedItems1 = []
        var redeemOrder
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems1).then((response) => {
            console.log(response);
            redeemOrder = response;
        }));


        var confirmationInfo = { "isPickUp": true, }
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(redeemOrder.id, confirmationInfo).then((response) => {
            confirmResponse = response
        }));

        // NO NEED TO PAY

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(redeemOrder.id)); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"reject",{ rejectMessage: 'User Point order is rejected'}).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'REFUNDED');
            expect(response).to.have.property('serveStatus', 'REJECTED');

        }));

        //Recover Reward Item config
        cy.waitUntil(() => cy.updateRewardItem(store1.rewardPG1P2, store1.rewardPG1P2.id));

        // Login back as enduser and check punch card history
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Check again the Store User Point
        cy.waitUntil(() => cy.getUserPoints().then((response)=>{
            cy.wrap(response).each((userPoint)=>{
                if (userPoint.merchantId == merchantID){
                    console.log(userPoint)
                    expect(userPoint.point).to.equal(userPointIDOfThisStore.point);
                } 
            })
        }));

        // Check User Point history
        cy.waitUntil(() => cy.getPointHistoryByMerchantID(merchantID).then((response)=>{
            console.log(response)
            let lastHistory = response[response.length-1]
            let secondLastHistory = response[response.length-2]
            expect(lastHistory.pointAfter).to.equal(lastHistory.pointBefore + deal.requiredPoints);
            expect(lastHistory).to.have.property('historyType', 'REVERTED');
            expect(secondLastHistory.pointAfter).to.equal(secondLastHistory.pointBefore - deal.requiredPoints);
            expect(secondLastHistory).to.have.property('historyType', 'USED');
        }));

    });
})
