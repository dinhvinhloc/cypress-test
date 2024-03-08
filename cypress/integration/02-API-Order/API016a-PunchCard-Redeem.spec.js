describe('API016a - Punch Card test', function () {
    it('Verify user purchase item that eligible for Punch Card promotion and redeem the punch card', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1

        var redeemProductList = []
        var redeemProductListNegative1 = []
        var redeemProductListNegative2 = []
        var numberOfRedeemTimes = 5

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var punchPromo1
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.punchCardPG1P2.id).then((response) => {
                console.log(response);
                return punchPromo1 = response
            })
        );

        var punchPromo2
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.punchCardPG4P2PG4P3.id).then((response) => {
                console.log(response);
                return punchPromo2 = response
            })
        );

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.getPunchCards().then((response) => {
            console.log("Punch cards")
            console.log(response)
        }));


        // CREATE AN ORDER TO GET PUNCHES
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, punchPromo1.requiredPunches*numberOfRedeemTimes, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P3.id, punchPromo1.requiredPunches*numberOfRedeemTimes, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG4P2.id, punchPromo2.requiredPunches*numberOfRedeemTimes, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG4P3.id, punchPromo2.requiredPunches*numberOfRedeemTimes, store1.AG2AO1.id, 2).then((response) => {
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

        cy.waitUntil(() =>
            cy.wrap(order.promotions).each((promotion) => {
                if (promotion.type == "PUNCH_CARD" && promotion.name == punchPromo1.name) {
                    expect(promotion).to.have.property('rewardPunches', punchPromo1.requiredPunches*numberOfRedeemTimes*2)
                }
            })
        )

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

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        // Get all user punch cards, expect the last item to match with punchCardPG1P2 ID and is REDEEMABLE
        var myPunchCard
        cy.waitUntil(() => cy.getPunchCards().then((response) => {
            expect(response[response.length - 2]).to.have.property('promotionId', punchPromo1.id);
            myPunchCard = response[response.length - 2]
            console.log(myPunchCard)
        }));

        cy.waitUntil(() => cy.getPunchCardByID(myPunchCard.id).then((response) => {
            expect(response).to.have.property('promotionId', punchPromo1.id);
            expect(response).to.have.property('status', 'REDEEMABLE');

        }));

        // Get Punch Card history
        cy.waitUntil(() => cy.getPunchCardHistoryByID(myPunchCard.id).then((response) => {
            console.log(response)
            expect(response[response.length - 1]).to.have.property('userPunchCardId', myPunchCard.id);
            expect(response[response.length - 1]).to.have.property('orderId', order.id);
            expect(response[response.length - 1].punchesAfter).to.equal(response[response.length - 1].punchesBefore + punchPromo1.requiredPunches*numberOfRedeemTimes*2);
        }));

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

        //----------------------------- REDEEM ORDER -------------------------------
        // Login back as end user and REDEEM the Punch Card
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        // Get all user punch cards, expect the last item to match with punchCardPG1P2 ID and is REDEEMABLE
        var myPunchCard
        cy.waitUntil(() => cy.getPunchCards().then((response) => {
            expect(response[response.length - 2]).to.have.property('promotionId', punchPromo1.id);
            myPunchCard = response[response.length - 2]
            console.log(myPunchCard)
        }));

        cy.waitUntil(() => cy.getPunchCardByID(myPunchCard.id).then((response) => {
            expect(response).to.have.property('promotionId', punchPromo1.id);
            expect(response).to.have.property('status', 'REDEEMABLE');

        }));

        // Get Punch Card history
        cy.waitUntil(() => cy.getPunchCardHistoryByID(myPunchCard.id).then((response) => {
            expect(response[response.length - 1]).to.have.property('userPunchCardId', myPunchCard.id);
            expect(response[response.length - 1]).to.have.property('orderId', order.id);
            expect(response[response.length - 1].punchesAfter).to.equal(response[response.length - 1].punchesBefore + punchPromo1.requiredPunches*numberOfRedeemTimes*2);
        }));


        // Construct the redeemProductList json with quantity > reward quantity
        cy.waitUntil(() =>
            cy.wrap(punchPromo1.rewardProductList).each((item) => {
                redeemProductListNegative1.push(
                    {
                        "quantity": item.quantity + 1000,
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


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));



        cy.waitUntil(() => cy.addRedeemItemToCartAllowFail("29870387762985932891447369999", myPunchCard.promotionId, redeemProductListNegative1).then((response) => {
            console.log(response);
            expect(response).to.not.have.key('id');

            expect(response).to.have.property('status', 400);
            expect(response).to.have.property('message', "Merchant Store does not exist.");

            console.log(response);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCartAllowFail(store1.storeID.id, myPunchCard.promotionId, redeemProductListNegative1).then((response) => {
            console.log(response);
            expect(response).to.not.have.key('id');

            expect(response).to.have.property('status', 400);
            expect(response).to.have.property('message', "You have insufficient punches to redeem promotion "+punchPromo1.name);

            console.log(response);
        }));


        // Construct the redeemProductList json with quantity < reward quantity
        cy.waitUntil(() =>
            cy.wrap(punchPromo1.rewardProductList).each((item) => {
                redeemProductListNegative2[0] =
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
                }

            })
        );


        // THIS SNIPPET IS NOW OBSOLETE. USER CAN UNDER-REDEEM WHICH MEAN HE/SHE CAN SELECT THE QUANTITY THAT
        // LESS THAN THE QUANTITY ALLOWED TO REDEEM.
        // cy.waitUntil(() => cy.addRedeemItemToCartAllowFail(store1.storeID.id, myPunchCard.promotionId, redeemProductListNegative2).then((response) => {
        //     console.log(response);
        //     expect(response).to.not.have.key('id');
        //     expect(response).to.have.property('status', 400);
        //     expect(response).to.have.property('message', "Please choose 2 reward items");

        //     console.log(response);
        // }));

        // Construct the redeemProductList json
        cy.waitUntil(() =>
            cy.wrap(punchPromo1.rewardProductList).each((item) => {
                redeemProductList.push(
                    {
                        "quantity": 1,
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

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));
        
        cy.waitUntil(() => cy.addRedeemItemToCartAllowFail(store1.storeID.id, myPunchCard.promotionId, redeemProductList).then((response) => {
            console.log(response);
        }));


        // Check out the order
        var toBeAppliedItems1 = []
        var redeemOrder
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems1).then((response)=>{
            console.log(response);
            redeemOrder = response;
        }));



        cy.waitUntil(() => cy.confirmOrder(redeemOrder.id,confirmationInfo).then((response)=>{
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
        cy.waitUntil(() => cy.confirmPaid(redeemOrder.id));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Merchant Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "accept", ""));
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

        cy.waitUntil(() => cy.getPunchCardHistoryByID(myPunchCard.id).then((response) => {
            console.log(response)
            expect(response[response.length - 1]).to.have.property('userPunchCardId', myPunchCard.id);
            expect(response[response.length - 1]).to.have.property('orderId', redeemOrder.id);
            expect(response[response.length - 1].punchesAfter).to.equal(response[response.length - 1].punchesBefore - punchPromo1.requiredPunches);
        }));

    });
})
