describe('API018a2 - User Point test - Redeem order cancel (after confirm)', function () {
    it('Verify User Point is not changed when Redeem order cancel (after confirm)', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Login as merchant to get the coupon code

        var merchantID
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password).then((response) => {
            merchantID = response.merchantID
            console.log(merchantID)
        });

        var deal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.rewardPG1P2.id).then((response) => {
                console.log(response);
                return deal = response
            }));

        var pointPerkDeal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.pointPerkPG3P5.id).then((response) => {
                console.log(response);
                return pointPerkDeal = response
            }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Get all user punch points, extract to User Point of the store and his Global Point
        var userPointIDOfThisStore
        var globalUserPoint
        cy.waitUntil(() => cy.getUserPoints().then((response) => {
            cy.wrap(response).each((userPoint) => {
                if (userPoint.merchantId == merchantID) {
                    userPointIDOfThisStore = userPoint
                    console.log(userPointIDOfThisStore)
                } else if (userPoint.merchantId == null) {
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
            cy.wrap(deal.rewardProductList).each((item) => {
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


        // Cancel the order

        cy.waitUntil(() => cy.cancelOrder(redeemOrder.id).then((response) => {
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
        }));


        // Check again the Store User Point
        cy.waitUntil(() => cy.getUserPoints().then((response) => {
            cy.wrap(response).each((userPoint) => {
                if (userPoint.merchantId == merchantID) {
                    console.log(userPoint)
                    expect(userPoint.point).to.equal(userPointIDOfThisStore.point);
                }
            })
        }));

        // Check User Point history
        cy.waitUntil(() => cy.getPointHistoryByMerchantID(merchantID).then((response) => {
            console.log(response)
            let lastHistory = response[response.length - 1]
            let secondLastHistory = response[response.length - 2]
            expect(lastHistory.pointAfter).to.equal(lastHistory.pointBefore + deal.requiredPoints);
            expect(lastHistory).to.have.property('historyType', 'REVERTED');
            expect(secondLastHistory.pointAfter).to.equal(secondLastHistory.pointBefore - deal.requiredPoints);
            expect(secondLastHistory).to.have.property('historyType', 'USED');
        }));

    });
})
