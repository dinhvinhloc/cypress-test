describe('API018a - User Point test', function () {
    it('Verify User Point is increase after purchase Point Perk promo item and can be redeemed', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1
        var numberOfRedeemTimes = 5

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
            console.log("Here are all the points")
            console.log(response)
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


        cy.waitUntil(() => cy.getGlobalPoint().then((response) => {
            console.log(response)
            globalUserPoint = response
        }));

        // CREATE AN ORDER TO GET ENOUGH POINTS FOR numberOfRedeemTimes
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P6.id, 2 * numberOfRedeemTimes, store1.AG3AO2.id, 3).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P7.id, 1 * numberOfRedeemTimes, store1.AG3AO2.id, 3).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));

        var toBeAppliedItems = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() =>
            cy.wrap(rewardItem).each((item) => {

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
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems).then((response) => {
            console.log(response);
            order = response;
        }));

        var confirmationInfo = { "isPickUp": true, }
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id, confirmationInfo).then((response) => {
            confirmResponse = response
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);

        var cardID = Cypress.env('enduser0001Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret, cardID).then((response) => {
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
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "accept", ""));



        // Login as user to check the increment of his user point

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Get User Point again and expect it to increase 3 x 7000 points
        cy.waitUntil(() => cy.getUserPoints().then((response) => {
            cy.wrap(response).each((userPoint) => {
                if (userPoint.merchantId == merchantID) {
                    expect(userPoint.point).to.equal(3 * pointPerkDeal.rewardPoints * numberOfRedeemTimes + userPointIDOfThisStore.point);
                }
            })
        }));


        // Login as merchant to continue processing the order
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "preparing", { processingTime: 20 }));
        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "ready", ""));
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "complete", "").then((response) => {
            expect(response).to.have.property('status', 'COMPLETED');
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



        cy.waitUntil(() => cy.confirmOrder(redeemOrder.id, confirmationInfo).then((response) => {
            confirmResponse = response
        }));

        cy.wrap(confirmResponse).then(() => {
            if (confirmResponse.clientSecret != null) {
                // Pay with the cardID
                email = Cypress.env('adminUser');
                password = Cypress.env('adminPass');
                cy.Login(email, password);

                var cardID = Cypress.env('enduser0001Card');
                
                // cy.waitUntil(() => 
                cy.payOrder(confirmResponse.clientSecret, cardID).then((response) => {
                    console.log(response);
                    chargeID = response;
                })
                // );
            }
        })





        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(redeemOrder.id));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Merchant Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "accept", ""));

        // Login as user
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Check again the Store User Point
        cy.waitUntil(() => cy.getUserPoints().then((response) => {
            cy.wrap(response).each((userPoint) => {
                if (userPoint.merchantId == merchantID) {
                    expect(userPoint.point).to.equal(userPointIDOfThisStore.point + 3 * pointPerkDeal.rewardPoints * numberOfRedeemTimes - deal.requiredPoints);
                }
            })
        }));

        // Login as merchant to continue of processing order
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);


        // Merchant preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "preparing", { processingTime: 15 }));
        // Merchant make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "ready", ""));
        // Merchant complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "complete", "").then((response) => {
            expect(response).to.have.property('status', 'COMPLETED');
        }));

        // Login back as enduser and check punch card history
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Check again the Store User Point, make sure it's still the same after Redeem order is completed.
        cy.waitUntil(() => cy.getUserPoints().then((response) => {
            cy.wrap(response).each((userPoint) => {
                if (userPoint.merchantId == merchantID) {
                    expect(userPoint.point).to.equal(userPointIDOfThisStore.point + 3 * pointPerkDeal.rewardPoints * numberOfRedeemTimes - deal.requiredPoints);
                }
            })
        }));

        // Check User Point history
        cy.waitUntil(() => cy.getPointHistoryByMerchantID(merchantID).then((response) => {
            console.log(response)
            let lastHistory = response[response.length - 1]
            expect(lastHistory.pointAfter).to.equal(lastHistory.pointBefore - deal.requiredPoints);
        }));

        // Check Global Point
        cy.waitUntil(() => cy.getGlobalPoint().then((response) => {
            console.log(response)
            expect(response).to.be.above(globalUserPoint);
        }));

        // Check Global Point history
        cy.waitUntil(() => cy.getGlobalPointHistory().then((response) => {
            console.log(response)
            let firstHistory = response[0]
            let secondHistory = response[1]

            expect(firstHistory).to.have.property('historyType', 'ADDED');
            expect(firstHistory).to.have.property('globalPoints', 25);
            expect(secondHistory).to.have.property('historyType', 'ADDED');
            expect(secondHistory).to.have.property('globalPoints', 13991);

        }));

    });
})
