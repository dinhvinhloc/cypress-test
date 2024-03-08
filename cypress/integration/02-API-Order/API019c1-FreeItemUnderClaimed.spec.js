describe('API019c1 - User allowed to under-claim the Free Items', function () {
    it('Verify that user will be able to checkout with the number of Free Item that less than they deserve', function () {

        // Test points:
        // 1. Add items to the cart that eligible for 3 different Free Items
        // 2. Only add 1 Free Item to the cart
        // 3. Checkout
        // 4. Order should be proceeded without issue

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        var email = Cypress.env('enduser0001');
        var password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);




        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem = [];


        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P2.id, 50, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log("Reward Items ", rewardItem);
        }));



        // // Check out the order
        var toBeAppliedItems1 = []
        cy.waitUntil(() =>
            cy.wrap(rewardItem).then(() => {

                toBeAppliedItems1.push(
                    {
                        "appliedPromotionId": rewardItem[0].id,
                        "quantity": rewardItem[0].rewardProductList[0].quantity,
                        "instruction": "This is a Free Item",
                        "productId": rewardItem[0].rewardProductList[0].id,
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

        var redeemOrder
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems1).then((response) => {
            console.log(response);
            redeemOrder = response;
        }));

        var confirmationInfo
        cy.waitUntil(() => cy.get('@confirmTemplate').then((info) => { confirmationInfo = info }));


        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(redeemOrder.id, confirmationInfo).then((response) => {
            confirmResponse = response
        }));

        var chargeID

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

        // // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(redeemOrder.id));

        // // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // // Merchant Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "accept", ""));

        // Merchant preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "preparing", { processingTime: 15 }));
        // Merchant make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "ready", ""));
        // delivering order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "delivering", { processingTime: 60 }).then((response) => {
            // console.log(response);
        }));
        // Merchant complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id, "complete", "").then((response) => {
            expect(response).to.have.property('status', 'COMPLETED');
        }));

        

    });
})
