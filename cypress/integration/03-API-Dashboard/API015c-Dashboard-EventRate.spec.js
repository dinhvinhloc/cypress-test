describe("API015c - Event Rate Endpoint", () => {
    it("Business Category: Event Rate Endpoint should allow to collect the user 'Rating' from the app", () => {


        // Merchant Login
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        cy.waitUntil(() => cy.Login(email, password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));

        // Fixtures
        cy.fixture('test-data/created-data/stores.json').as('stores');

        // Dates
        var endDate = Cypress.dayjs().add(1, 'days').format('YYYY-MM-DD');
        var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');

        // Event Rate Request Object

        // Before Event Rate Variables
        var rating;
        var storeRating;

        // After Event Rate Variables
        var updatedRating;
        var updatedStoreRating;
        var store1

        // Getting Store and Merhchant ID's from stores.json
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Get Dashboard Rating ==> TotalUserRating - With MerchantId
        cy.waitUntil(() => cy.getDashboardRating(startDate, endDate, merchantId).then((response) => {
            expect(response).to.have.property('totalUserRatings');
            rating = response.totalUserRatings;
        }));

        // Get Dashboard Rating ==> TotalUserRating - With MerchantId & storeId
        cy.waitUntil(() => cy.getDashboardRatingWithStore(startDate, endDate, merchantId, store1.storeID.id).then((response) => {
            expect(response).to.have.property('totalUserRatings');
            storeRating = response.totalUserRatings;
        }));


        // CREATE AN ORDER AND RATE IT

        // Enduser Login
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P4.id, 10, null, null));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P1.id, 10, store1.AG2AO1.id, 2).then((response) => {
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
            console.log(response);
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
        cy.waitUntil(() => cy.confirmPaid(order.id).then((response) => {
            console.log(response);
        }));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "accept", "").then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'ACCEPTED');
            expect(response).to.have.property('status', 'PAID');
        }));

        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'ACCEPTED');
            expect(response).to.have.property('status', 'PAID');
        }));

        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "preparing", { processingTime: 15 }).then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PREPARING');
            expect(response).to.have.property('status', 'PAID');
        }));

        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PREPARING');
            expect(response).to.have.property('status', 'PAID');
        }));

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "ready", "").then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'READY');
            expect(response).to.have.property('status', 'PAID');
        }));

        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'READY');
            expect(response).to.have.property('status', 'PAID');
        }));


        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'READY');
            expect(response).to.have.property('status', 'PAID');
        }));

        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "complete", "").then((response) => {
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PICKUP');
            expect(response).to.have.property('status', 'COMPLETED');
        }));


        // LOGIN AS USER AGAIN TO RATE
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        
        // Event Rate
        cy.waitUntil(() => cy.eventRate(order.id, 5).then((response) => {
            expect(response).to.have.property('status', 200);
            console.log("RATING RESPONSE IS HERE")
            console.log(response)

        })).wait(500);


        // Get the rating of the order
        cy.waitUntil(() => cy.getRatingByOrderId(order.id).then((response) => {
            // expect(response).to.have.property('status', 200);
            console.log("RATING OF ORDER")
            console.log(response)
            expect(response).to.have.property('rating', 5);
            expect(response).to.have.property('comment', "5 stars, Great food. Highly satisfied");
        })).wait(2000);


        // Merchant Login
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);


        // Get Dashboard Rating  By Time ==> storeId indicated
        cy.waitUntil(() => cy.getRatingByTime(startDate, endDate, merchantId, 0, 5, store1.storeID.id).then((response) => {
            console.log(`RATING FORM ${startDate} TO ${endDate} OF STORE ${store1.storeID.id}`)
            console.log(response)
            expect(response.content[0]).to.have.property('orderId', order.id);
            expect(response.content[0]).to.have.property('rating', 5);
            expect(response.content[0]).to.have.property('comment', "5 stars, Great food. Highly satisfied");
        }));

        // Get Dashboard Rating  By Time ==> storeId NOT indicated
        cy.waitUntil(() => cy.getRatingByTime(startDate, endDate, merchantId, 0, 5).then((response) => {
            console.log(`RATING FORM ${startDate} TO ${endDate}`)
            console.log(response)
            expect(response.content[0]).to.have.property('orderId', order.id);
            expect(response.content[0]).to.have.property('rating', 5);
            expect(response.content[0]).to.have.property('comment', "5 stars, Great food. Highly satisfied");
        }));

        // Get Dashboard Rating ==> TotalUserRating & Compare - With MerchantId
        cy.waitUntil(() => cy.getDashboardRating(startDate, endDate, merchantId).then((response) => {
            expect(response).to.have.property('totalUserRatings');
            updatedRating = response.totalUserRatings;
            expect(rating + 1).to.equal(updatedRating);
        }));

        // Get Dashboard Rating ==> TotalUserRating & Compare - With MerchantId & storeId
        cy.waitUntil(() => cy.getDashboardRatingWithStore(startDate, endDate, merchantId, store1.storeID.id).then((response) => {
            expect(response).to.have.property('totalUserRatings');
            updatedStoreRating = response.totalUserRatings;
            expect(storeRating + 1).to.equal(updatedStoreRating);
        }));

    })
})