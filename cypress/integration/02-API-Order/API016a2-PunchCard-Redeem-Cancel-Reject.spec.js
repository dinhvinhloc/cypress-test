describe('API016a2 - Punch Card test - Reject with Addon Charged', function () {
    it('Verify user purchase item that eligible for Punch Card promotion and redeem the punch card', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var deal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.punchCardPG1P2.id).then((response) => {
                console.log(response);
                return deal = response
            })
        );

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        //----------------------------- REDEEM ORDER and CANCEL-------------------------------
        // Login back as end user and REDEEM the Punch Card
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

        // Get all user punch cards, expect the last item to match with punchCardPG1P2 ID and is REDEEMABLE
        var myPunchCard
        cy.waitUntil(() => cy.getPunchCards().then((response) => {
            expect(response[response.length - 2]).to.have.property('promotionId', deal.id);
            myPunchCard = response[response.length - 2]
            console.log(myPunchCard)
        }));

        cy.waitUntil(() => cy.getPunchCardByID(myPunchCard.id).then((response) => {

            console.log("MY PUNCH CARD")
            console.log(response)
            expect(response).to.have.property('promotionId', deal.id);
            expect(response.punches).to.equal(myPunchCard.punches);
            expect(response).to.have.property('status', 'REDEEMABLE');
            console.log("MY PUNCH CARD")
        }));


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));
        
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, myPunchCard.promotionId, redeemProductList).then((response) => {
            console.log(response);
        }));

        // Check out the order
        var toBeAppliedItems1 = []
        var redeemOrder
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems1).then((response)=>{
            console.log(response);
            redeemOrder = response;
        }));

        // cy.waitUntil(() => cy.confirmOrder(redeemOrder.id,confirmationInfo).then((response)=>{
        //     confirmResponse = response
        // }));

        cy.waitUntil(() => cy.cancelOrder(redeemOrder.id).then((response) => {
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
        }));

        cy.waitUntil(() => cy.getPunchCardByID(myPunchCard.id).then((response) => {

            console.log("MY PUNCH CARD")
            console.log(response)
            expect(response).to.have.property('promotionId', deal.id);
            expect(response.punches).to.equal(myPunchCard.punches);
            console.log("MY PUNCH CARD")
        }));


        //----------------------------- REDEEM ORDER and REJECT -------------------------------
        // Login back as end user and REDEEM the Punch Card
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

        // Get all user punch cards, expect the last item to match with punchCardPG1P2 ID and is REDEEMABLE
        var myPunchCard
        cy.waitUntil(() => cy.getPunchCards().then((response) => {
            expect(response[response.length - 2]).to.have.property('promotionId', deal.id);
            myPunchCard = response[response.length - 2]
            console.log(myPunchCard)
        }));

        cy.waitUntil(() => cy.getPunchCardByID(myPunchCard.id).then((response) => {
            expect(response).to.have.property('promotionId', deal.id);
            expect(response).to.have.property('status', 'REDEEMABLE');

        }));


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));
        
        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, myPunchCard.promotionId, redeemProductList).then((response) => {
            console.log(response);
        }));

        // Check out the order
        var toBeAppliedItems1 = []
        var redeemOrder1
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems1).then((response)=>{
            console.log(response);
            redeemOrder1 = response;
        }));


        var confirmationInfo = { "isPickUp": true, }
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(redeemOrder1.id,confirmationInfo).then((response)=>{
            confirmResponse = response
        }));


        // Don't need to pay since the Amount = 0 

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(redeemOrder1.id)); 

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
        cy.waitUntil(() => cy.confirmPaid(redeemOrder1.id));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder1.id, store1.storeID.id, "reject", { rejectMessage: 'Test REDEEMED Punch Card Reject with charge' }).then((response) => {
            expect(response).to.have.property('status', 'REFUNDED');
            expect(response).to.have.property('serveStatus', 'REJECTED');
        }));

        // Login back as enduser and check punch card history
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.getPunchCardByID(myPunchCard.id).then((response) => {

            console.log("MY PUNCH CARD")
            console.log(response)
            expect(response).to.have.property('promotionId', deal.id);
            expect(response.punches).to.equal(myPunchCard.punches);
            console.log("MY PUNCH CARD")
        }));


        cy.waitUntil(() => cy.getPunchCardHistoryByID(myPunchCard.id).then((response) => {
            console.log(response)
            expect(response[response.length - 1]).to.have.property('userPunchCardId', myPunchCard.id);
            expect(response[response.length - 1]).to.have.property('orderId', redeemOrder1.id);
            expect(response[response.length - 1].punchesAfter).to.equal(myPunchCard.punches);
            // expect(response[response.length - 1].punchesAfter).to.equal(response[response.length - 1].punchesBefore);
        }));

    });
})
