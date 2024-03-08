describe('API019d - Confirm 2 orders almost concurrently result in failure for second confirmation', function () {
    it('Verify that user has 2 checked out order that consume all punches and user point, second confirmation will be fail if checkout almost concurrently', function () {

        // Test points:
        // 1. Check out 4 orders. Order 1: Consume all available Punch Cards and Point; Order 2: Consume all available Punch Card; Order 3: consume all available points; Order 4: same as order 1.
        // 2. Confirm 1st order
        // 3. Confirm 2nd order after ~300ms => Expect error complaining insufficient Punches.
        // 4. Confirm 3rd order after ~300ms => Expect error complaining insufficient Point.
        // 5. Confirm 4th order after ~300ms => Expect error complaining insufficient Point.

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')

        const mongodbURL = Cypress.env('mongodbURL');
        const databaseName = Cypress.env('databaseName');

        var store1
        var rewardPromo1
        var rewardPromo2
        var punchPromo1
        var punchPromo2
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


        cy.waitUntil(() =>
            cy.getPromotionByID(store1.rewardPG1P2.id).then((response) => {
                console.log("Reward 1: ", response);
                rewardPromo1 = response
            })
        );
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.rewardPG4P4.id).then((response) => {
                console.log("Reward 2: ", response);
                rewardPromo2 = response
            })
        );
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.punchCardPG1P2.id).then((response) => {
                console.log("Punch Card Promotion 1: ", response);
                punchPromo1 = response
            })
        );
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.punchCardPG4P2PG4P3.id).then((response) => {
                console.log("Punch Card Promotion 2: ", response);
                punchPromo2 = response
            })
        );


        // GET ALL PUNCHES AND USER POINTS INFO
        var userId
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password).then((response) => {
            userId = response.id
            console.log(userId)
        });



        var myPunchCard1
        var myPunchCard2

        cy.wrap(punchPromo1).then(() => {
            cy.task('updatePunchCard', { promotionId: punchPromo1.id, punches: 1 * punchPromo1.requiredPunches, status: "REDEEMABLE" }).then((textOrNull) => {
                console.log(textOrNull)
            })
        })
        cy.wrap(punchPromo1).then(() => {
            cy.task('updatePunchCard', { promotionId: punchPromo2.id, punches: 2 * punchPromo2.requiredPunches, status: "REDEEMABLE" }).then((textOrNull) => {
                console.log(textOrNull)
            })
        })

        cy.wrap(userId).then(() => {
            cy.wrap(merchantID).then(() => {
                cy.task('updateUserPoint', { userId: userId, merchantId: merchantID, point: (rewardPromo1.requiredPoints + 2 * rewardPromo2.requiredPoints) }).then((textOrNull) => {
                    console.log(textOrNull)
                })
            })
        })

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


        // cy.waitUntil(() =>
        cy.getGlobalPoint().then((response) => {
            console.log(response)
            globalUserPoint = response
        })
        // );


        cy.waitUntil(() =>
            cy.getPunchCards().then((punchCards) => {
                cy.wrap(punchCards).each((punchCard) => {
                    if (punchCard.promotionId == punchPromo1.id) {
                        myPunchCard1 = punchCard
                    } else if (punchCard.promotionId == punchPromo2.id) {
                        myPunchCard2 = punchCard
                    }
                })
            })
        );


        // Logging all point and punch cards

        cy.wrap(globalUserPoint).then(() => {
            console.log("Global Point: ", globalUserPoint)
        })
        cy.wrap(userPointIDOfThisStore).then(() => {
            console.log("User Point of this store: ", userPointIDOfThisStore)
        })
        cy.wrap(myPunchCard1).then(() => {
            console.log("Punch Card 1: ", myPunchCard1)
        })
        cy.wrap(myPunchCard1).then(() => {
            console.log("Punch Card 2: ", myPunchCard2)
        })
        //----------------------------- REDEEM REWARD ITEM -------------------------------
        // Login back as end user and REDEEM the REWARD ITEM
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        var redeemProductListReward1 = []
        var redeemProductListReward2 = []
        var redeemProductListPunch1 = []
        var redeemProductListPunch2 = []

        cy.waitUntil(() =>
            // Construct the redeemProductListReward1 json
            cy.wrap(rewardPromo1.rewardProductList).each((item) => {
                redeemProductListReward1.push(
                    {
                        "quantity": item.quantity,
                        "instruction": "Redeem " + rewardPromo2.name,
                        "productId": item.id,
                        "addons": [
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + rewardPromo1.name,
                                "productId": store1.AG1AO1.id,
                                "addon": true
                            },
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + rewardPromo1.name,
                                "productId": store1.AG1AO2.id,
                                "addon": true
                            }
                        ],
                        "addon": true
                    })
            })
        );
        cy.waitUntil(() =>
            // Construct the redeemProductListReward1 json
            cy.wrap(rewardPromo2.rewardProductList).each((item) => {
                redeemProductListReward2.push(
                    {
                        "quantity": item.quantity,
                        "instruction": "Redeem " + rewardPromo2.name,
                        "productId": item.id,
                        "addons": [
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + rewardPromo2.name,
                                "productId": store1.AG1AO1.id,
                                "addon": true
                            },
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + rewardPromo2.name,
                                "productId": store1.AG1AO2.id,
                                "addon": true
                            }
                        ],
                        "addon": true
                    })
            })
        );
        cy.waitUntil(() =>
            // Construct the redeemProductListReward1 json
            cy.wrap(punchPromo1.rewardProductList).each((item) => {
                redeemProductListPunch1.push(
                    {
                        "quantity": 1,
                        "instruction": "Redeem " + punchPromo1.name,
                        "productId": item.id,
                        "addons": [
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + punchPromo1.name,
                                "productId": store1.AG1AO1.id,
                                "addon": true
                            },
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + punchPromo1.name,
                                "productId": store1.AG1AO2.id,
                                "addon": true
                            }
                        ],
                        "addon": true
                    })
            })
        );
        cy.waitUntil(() =>
            // Construct the redeemProductListReward1 json
            cy.wrap(punchPromo2.rewardProductList).each((item) => {
                redeemProductListPunch2.push(
                    {
                        "quantity": 1,
                        "instruction": "Redeem " + punchPromo2.name,
                        "productId": item.id,
                        "addons": [
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + + punchPromo2.name,
                                "productId": store1.AG1AO1.id,
                                "addon": true
                            },
                            {
                                "quantity": 1,
                                "instruction": "Addon For Redeem " + punchPromo2.name,
                                "productId": store1.AG1AO2.id,
                                "addon": true
                            }
                        ],
                        "addon": true
                    })
            })
        );






        cy.wrap(redeemProductListPunch1).then(() => {
            console.log("Redeem Product List Punch Card 1: ", redeemProductListPunch1)
        })
        cy.wrap(redeemProductListPunch2).then(() => {
            console.log("Redeem Product List Punch Card 2: ", redeemProductListPunch2)
        })
        cy.wrap(redeemProductListReward1).then(() => {
            console.log("Redeem Product List Reward 1: ", redeemProductListReward1)
        })
        cy.wrap(redeemProductListReward2).then(() => {
            console.log("Redeem Product List Reward 2: ", redeemProductListReward2)
        })


        // CREATE ORDER 1

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem = [];
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo1.id, redeemProductListReward1).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response, rewardPromo1.id, redeemProductListReward1)
            cy.assertPromotionApplied(response, rewardPromo1);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo2.id, redeemProductListReward2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response, rewardPromo2.id, redeemProductListReward2)
            cy.assertPromotionApplied(response, rewardPromo2);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo1.id, redeemProductListPunch1).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response, punchPromo1.id, redeemProductListPunch1)
            cy.assertPromotionApplied(response, punchPromo1);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo2.id, redeemProductListPunch2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response, punchPromo2.id, redeemProductListPunch2)
            cy.assertPromotionApplied(response, punchPromo2);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, 10, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
        }));



        // // Check out the order
        var toBeAppliedItems1 = []
        cy.waitUntil(() =>
            cy.wrap(rewardItem).each((item) => {

                toBeAppliedItems1.push(
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

        var redeemOrder1
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems1).then((response) => {
            console.log(response);
            redeemOrder1 = response;
        }));

        // CREATE ORDER 2

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem2 = [];
        // cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo1.id, redeemProductListReward1).then((response) => {
        //     console.log(response);
        //     rewardItem2 = response.toBeAppliedPromotion
        //     console.log("Reward Items ", rewardItem2);
        //     cy.assertRedeemProductListAddedToCart(response, rewardPromo1.id, redeemProductListReward1)
        //     cy.assertPromotionApplied(response, rewardPromo1);
        // }));

        // cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo2.id, redeemProductListReward2).then((response) => {
        //     console.log(response);
        //     rewardItem2 = response.toBeAppliedPromotion
        //     console.log("Reward Items ", rewardItem2);
        //     cy.assertRedeemProductListAddedToCart(response, rewardPromo2.id, redeemProductListReward2)
        //     cy.assertPromotionApplied(response, rewardPromo2);
        // }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo1.id, redeemProductListPunch1).then((response) => {
            console.log(response);
            rewardItem2 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem2);
            cy.assertRedeemProductListAddedToCart(response, punchPromo1.id, redeemProductListPunch1)
            cy.assertPromotionApplied(response, punchPromo1);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo2.id, redeemProductListPunch2).then((response) => {
            console.log(response);
            rewardItem2 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem2);
            cy.assertRedeemProductListAddedToCart(response, punchPromo2.id, redeemProductListPunch2)
            cy.assertPromotionApplied(response, punchPromo2);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, 10, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem2 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem2);
        }));



        // // Check out the order
        var toBeAppliedItems2 = []
        cy.waitUntil(() =>
            cy.wrap(rewardItem2).each((item) => {

                toBeAppliedItems2.push(
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

        var redeemOrder2
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems2).then((response) => {
            console.log(response);
            redeemOrder2 = response;
        }));

        // CREATE ORDER 3

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem3 = [];
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo1.id, redeemProductListReward1).then((response) => {
            console.log(response);
            rewardItem3 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem3);
            cy.assertRedeemProductListAddedToCart(response, rewardPromo1.id, redeemProductListReward1)
            cy.assertPromotionApplied(response, rewardPromo1);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo2.id, redeemProductListReward2).then((response) => {
            console.log(response);
            rewardItem3 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem3);
            cy.assertRedeemProductListAddedToCart(response, rewardPromo2.id, redeemProductListReward2)
            cy.assertPromotionApplied(response, rewardPromo2);
        }));
        // cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo1.id, redeemProductListPunch1).then((response) => {
        //     console.log(response);
        //     rewardItem3 = response.toBeAppliedPromotion
        //     console.log("Reward Items ", rewardItem3);
        //     cy.assertRedeemProductListAddedToCart(response, punchPromo1.id, redeemProductListPunch1)
        //     cy.assertPromotionApplied(response, punchPromo1);
        // }));
        // cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo2.id, redeemProductListPunch2).then((response) => {
        //     console.log(response);
        //     rewardItem3 = response.toBeAppliedPromotion
        //     console.log("Reward Items ", rewardItem3);
        //     cy.assertRedeemProductListAddedToCart(response, punchPromo2.id, redeemProductListPunch2)
        //     cy.assertPromotionApplied(response, punchPromo2);
        // }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, 10, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem3 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem3);
        }));



        // // Check out the order
        var toBeAppliedItems3 = []
        cy.waitUntil(() =>
            cy.wrap(rewardItem3).each((item) => {

                toBeAppliedItems3.push(
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

        var redeemOrder3
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems3).then((response) => {
            console.log(response);
            redeemOrder3 = response;
        }));

        // CREATE ORDER 4

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem4 = [];
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo1.id, redeemProductListReward1).then((response) => {
            console.log(response);
            rewardItem4 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem4);
            cy.assertRedeemProductListAddedToCart(response, rewardPromo1.id, redeemProductListReward1)
            cy.assertPromotionApplied(response, rewardPromo1);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo2.id, redeemProductListReward2).then((response) => {
            console.log(response);
            rewardItem4 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem4);
            cy.assertRedeemProductListAddedToCart(response, rewardPromo2.id, redeemProductListReward2)
            cy.assertPromotionApplied(response, rewardPromo2);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo1.id, redeemProductListPunch1).then((response) => {
            console.log(response);
            rewardItem4 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem4);
            cy.assertRedeemProductListAddedToCart(response, punchPromo1.id, redeemProductListPunch1)
            cy.assertPromotionApplied(response, punchPromo1);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo2.id, redeemProductListPunch2).then((response) => {
            console.log(response);
            rewardItem4 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem4);
            cy.assertRedeemProductListAddedToCart(response, punchPromo2.id, redeemProductListPunch2)
            cy.assertPromotionApplied(response, punchPromo2);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, 10, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem4 = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem4);
        }));



        // // Check out the order
        var toBeAppliedItems4 = []
        cy.waitUntil(() =>
            cy.wrap(rewardItem4).each((item) => {

                toBeAppliedItems4.push(
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

        var redeemOrder4
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems4).then((response) => {
            console.log(response);
            redeemOrder4 = response;
        }));

        // CONFIRM 2 ORDERS WITH MINIMUM INTERVAL

        var confirmationInfo
        cy.waitUntil(() => cy.get('@confirmTemplate').then((info) => { confirmationInfo = info }));


        var confirmResponse1
        cy.waitUntil(() => cy.confirmOrder(redeemOrder1.id, confirmationInfo).then((response) => {
            confirmResponse1 = response
            console.log(response)
        }));

        var confirmResponse2
        cy.waitUntil(() => cy.confirmOrder(redeemOrder2.id, confirmationInfo).then((response) => {
            confirmResponse2 = response
            console.log(response)
            expect(response).to.have.property('status', 400);
            expect(response.message).to.have.string('Not enough Punches to redeem requested Products.');
        }));
        var confirmResponse3
        cy.waitUntil(() => cy.confirmOrder(redeemOrder3.id, confirmationInfo).then((response) => {
            confirmResponse3 = response
            console.log(response)
            expect(response).to.have.property('status', 400);
            expect(response.message).to.have.string('Not enough Points to redeem requested Products!');
        }));
        var confirmResponse4
        cy.waitUntil(() => cy.confirmOrder(redeemOrder4.id, confirmationInfo).then((response) => {
            confirmResponse4 = response
            console.log(response)
            expect(response).to.have.property('status', 400);
            expect(response.message).to.have.string('Not enough Points to redeem requested Products!');
        }));


    });
})
