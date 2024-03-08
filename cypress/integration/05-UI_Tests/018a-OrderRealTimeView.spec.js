describe('018a - Real time Order view', function () {
    it('Should show the order arrive in real time', function () {
        // Login
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var timeZoneAdjustment = Cypress.env('timeZoneAdjustment'); 
        // cy.Login(email, password);

        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');

        // Get to Order View
        // cy.get('a[href*="/app/orders"]').click();
        cy.get('[class="d-none d-sm-inline-block iconsminds-tablet-3"]').click();

        // cy.get('[data-cy="dlg-auth-input-password"]').type(password)
        // cy.get('[data-cy="dlg-auth-btn-ok"]').click();

        // Create an Order


        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1
        // const now = Cypress.dayjs().add(-4, 'hours').add(10, 'seconds').format('MMMM DD, YYYY - hh:mm A');

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Login as merchant to get the coupon code
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var deal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.boPG3P4foPG1P1.id).then((response) => {
                console.log(response);
                return deal = response
            })
        );


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P4.id, 10, null, null).then((response) => {
            console.log(response);
            expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P1.id, 10, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);
            expect(response).to.have.property('discountAmount', 240.119);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee);            
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
        let shortId
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems).then((response) => {
            console.log(response);
            order = response;
            shortId = "\n        #" + order.id.toString().slice(-4) + "\n      ";
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

        cy.contains('There is a new order', { timeout: 120000 });

        let now;
        let now2;
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response) => {
            let paidAt = response.paidAt;
            now = Cypress.dayjs(new Date(paidAt)).utcOffset(timeZoneAdjustment).format('MMMM DD, YYYY - hh:mm A').toString();
            now2 = Cypress.dayjs(new Date(paidAt)).utcOffset(timeZoneAdjustment).format('MM/DD/YYYY, hh:mm A').toString();
            console.log(now);
        }));



        cy.wrap(now).then(()=>{
            cy.get('[data-cy="list-item-order-0-paid-at"]', { timeout: 120000 }).should('contain',now);
        })

        cy.wrap(order).then(()=>{

            let last4DigitOrderId = order.id.substring(order.id.length- 4, order.id.length)

            cy.get('[data-cy="dlg-product-group-input-search"]').clear({force : true}).type('0000');

            cy.get('[data-cy^="list-item-order"]').should('not.exist');

            cy.get('[data-cy="dlg-product-group-input-search"]').clear({force : true}).type(last4DigitOrderId);

            cy.get('[data-cy="list-item-order-0-order-number"]').should('contain',last4DigitOrderId);

        })



        cy.get('[data-cy^="list-item-order"]:first').click();

        cy.wrap(order).then(()=>{

            let last4DigitOrderId = order.id.substring(order.id.length- 4, order.id.length)
            cy.get('[data-cy="main-order-order-number"]').should('contain',last4DigitOrderId);
            cy.get('[data-cy="main-order-serve-status"]').should('contain',"Pick Up");
        })

        cy.wrap(now2).then(()=>{
            cy.get('[data-cy="main-order-paid-at"]', { timeout: 120000 }).should('contain',now2);
        })

        cy.get('[data-cy$="-order-number"]:first').invoke('text').then((id) => {
            expect(id).to.be.equal(shortId);
        })

        cy.get('[data-cy="order-btn-accept"]').click().wait(500);

        cy.contains('An order is updated.', { timeout: 120000 });

        cy.get('[data-cy="order-btn-preparing"]').click().wait(500);

        cy.contains('An order is updated.', { timeout: 120000 });

        cy.get('[data-cy="order-btn-ready"]').click().wait(500);

        cy.contains('An order is updated.', { timeout: 120000 });

        cy.get('[data-cy="order-btn-pickup"]').click().wait(500);

        cy.contains('An order is updated.', { timeout: 120000 });
        cy.contains('Completed', { timeout: 120000 });

    })

})