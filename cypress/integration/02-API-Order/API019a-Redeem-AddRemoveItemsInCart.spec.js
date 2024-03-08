describe('API019a - User Cart with redeem items - vanila case', function () {
    it('Verify that user is capable of adding/removing redeem items (punch and point) into/out of cart', function () {

        // Test points:
        // 1. Add 2 Punch Card promotions' items into the cart. Assert the added items vs the constructed redeemProductList.
        // 2. Add 2 Reward Promotions' items into the cart. Assert the added items vs the constructed redeemProductList.
        // 3. Add regular items that meet other promotions.
        // 4. Remove 1 Punch Card redeem items. Assert the redeem items have been removed.
        // 5. Add back Punch Card redeem item with updates. Assert again the added items vs the constructed redeemProductList.
        // 6. Remove 1 Reward redeem item. Assert the redeem items have been removed.
        // 7. Add back Reward redeem item. Assert again the added items vs the constructed redeemProductList.


        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


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


        // cy.waitUntil(() =>
            cy.getGlobalPoint().then((response) => {
                console.log(response)
                globalUserPoint = response
            })
        // );

        var myPunchCard1
        var myPunchCard2
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
                        "quantity": item.quantity,
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
                        "quantity": item.quantity,
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



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem = [];
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo1.id, redeemProductListReward1).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response,rewardPromo1.id,redeemProductListReward1)
            cy.assertPromotionApplied(response, rewardPromo1);
        }));
        
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo2.id, redeemProductListReward2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response,rewardPromo2.id,redeemProductListReward2)
            cy.assertPromotionApplied(response, rewardPromo2);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo1.id, redeemProductListPunch1).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response,punchPromo1.id,redeemProductListPunch1)
            cy.assertPromotionApplied(response, punchPromo1);
        }));
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo2.id, redeemProductListPunch2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response,punchPromo1.id,redeemProductListPunch2)
            cy.assertPromotionApplied(response, punchPromo2);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, 50, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
        }));

        cy.waitUntil(() => cy.removeRedeemItemFromCart(store1.storeID.id, punchPromo1.id).then((response) => {
            console.log("Redeem Cart: ", response);
            let promotionIdList = response.items.map(item => item.appliedPromotionId);
            expect(promotionIdList).to.not.contain(punchPromo1.id);
        }));

        cy.wrap(redeemProductListPunch1).then(() => {
            redeemProductListPunch1 = []
            cy.waitUntil(() =>
                // Construct the redeemProductListReward1 json
                cy.wrap(punchPromo1.rewardProductList).each((item) => {
                    redeemProductListPunch1.push(
                        {
                            "quantity": item.quantity * 2,
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
        })

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, punchPromo1.id, redeemProductListPunch1).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response,punchPromo1.id,redeemProductListPunch1)

        }));

        // Remove Reward item from cart


        cy.waitUntil(() => cy.removeRedeemItemFromCart(store1.storeID.id, rewardPromo1.id).then((response) => {
            console.log("Redeem Cart: ", response);
            let promotionIdList = response.items.map(item => item.appliedPromotionId);
            expect(promotionIdList).to.not.contain(rewardPromo1.id);
        }));

        // Update quantity 

        cy.wrap(redeemProductListReward1).then(() => {
            redeemProductListReward1 = []
            cy.waitUntil(() =>
                // Construct the redeemProductListReward1 json
                cy.wrap(rewardPromo1.rewardProductList).each((item) => {
                    redeemProductListReward1.push(
                        {
                            "quantity": item.quantity * 2,
                            "instruction": "Redeem " + rewardPromo1.name,
                            "productId": item.id,
                            "addons": [
                                {
                                    "quantity": 2,
                                    "instruction": "Addon For Redeem " + rewardPromo1.name,
                                    "productId": store1.AG1AO2.id,
                                    "addon": true
                                },
                                {
                                    "quantity": 2,
                                    "instruction": "Addon For Redeem " + rewardPromo1.name,
                                    "productId": store1.AG2AO2.id,
                                    "addon": true
                                }
                            ],
                            "addon": true
                        })
                })
            );
        })

        // Add back reward item into cart with new quantity

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, rewardPromo1.id, redeemProductListReward1).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
            cy.assertRedeemProductListAddedToCart(response,rewardPromo1.id,redeemProductListReward1)
        }));

        // // Check out the order
        // var toBeAppliedItems1 = []
        // var redeemOrder
        // cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems1).then((response) => {
        //     console.log(response);
        //     redeemOrder = response;
        // }));



        // cy.waitUntil(() => cy.confirmOrder(redeemOrder.id, confirmationInfo).then((response) => {
        //     confirmResponse = response
        // }));

        // cy.wrap(confirmResponse).then(() => {
        //     if (confirmResponse.clientSecret != null) {
        //         // Pay with the cardID
        //         email = Cypress.env('adminUser');
        //         password = Cypress.env('adminPass');
        //         cy.Login(email, password);

        //         var cardID = Cypress.env('enduser0001Card');

        //         // cy.waitUntil(() => 
        //         cy.payOrder(confirmResponse.clientSecret, cardID).then((response) => {
        //             console.log(response);
        //             chargeID = response;
        //         })
        //         // );
        //     }
        // })





        // email = Cypress.env('enduser0001');
        // password = Cypress.env('enduser0001Pass');
        // cy.Login(email, password);

        // // Confirm order is paid
        // cy.waitUntil(() => cy.confirmPaid(redeemOrder.id));

        // // Login as merchant
        // email = Cypress.env('merchant1');
        // password = Cypress.env('merchant1Pass');
        // cy.Login(email, password);

        // // Merchant Accept the order
        // cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "accept", ""));

        // // Merchant preparing the order
        // cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "preparing", { processingTime: 15 }));
        // // Merchant make the order ready
        // cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "ready", ""));
        // // Merchant complete the oder
        // cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "complete", "").then((response) => {
        //     expect(response).to.have.property('status', 'COMPLETED');
        // }));

        // // Login back as enduser and check punch card history
        // email = Cypress.env('enduser0001');
        // password = Cypress.env('enduser0001Pass');
        // cy.Login(email, password);

        // // Check again the Store User Point, make sure it's still the same after Redeem order is completed.
        // cy.waitUntil(() => cy.getUserPoints().then((response) => {
        //     cy.wrap(response).each((userPoint) => {
        //         if (userPoint.merchantId == merchantID) {

        //         }
        //     })
        // }));





    });
})
