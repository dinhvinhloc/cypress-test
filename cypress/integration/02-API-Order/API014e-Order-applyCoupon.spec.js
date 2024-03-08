describe('API014e - Order to apply coupon and limitedStock deduction', function () {
    it('Test that when the cart applying a coupon code, limitedStock will be decreased once complete', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));        
        
        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var deal
        cy.waitUntil(() => cy.getPromotionByID(store1.hiddenDiscount20CAD.id).then((response)=>{
            // expect(response).to.have.property('isCartEmpty', true);
            console.log(response);
            return deal = response
        }));
        
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,3,store1.AG1AO1.id,1).then((response)=>{
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 3);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);
            console.log(response);

        }));

        cy.waitUntil(() => cy.addCoupon(store1.storeID.id, deal.couponCode).then((response)=>{
            expect(response.couponPromotion[deal.couponCode]).to.have.property('id', deal.id);
            console.log(response);
        }));

        var toBeAppliedItems = []
        
        // Check out the order
        var order
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems).then((response)=>{
            console.log(response);
            order = response;
        }));

       
        var confirmationInfo = {   "isPickUp": false,  }

        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
        
        var cardID = Cypress.env('enduser0001Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id).then((response)=>{
            console.log(response);
        })); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept","").then((response)=>{
            console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
            console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
        }));
        
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
        }));
        
        
        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'COMPLETED');
        }));

        // Check again the discount Deal

        cy.waitUntil(() => cy.getPromotionByID(store1.hiddenDiscount20CAD.id).then((response)=>{
            expect(response).to.have.property('limitedStock', deal.limitedStock-1);
            console.log(response);
        }));

// Add another order but will be rejected this case. Expect the limitedStock stay unchanged


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))
        
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,3,store1.AG1AO1.id,1).then((response)=>{
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 3);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);
            console.log(response);

        }));

        cy.waitUntil(() => cy.addCoupon(store1.storeID.id, deal.couponCode).then((response)=>{
            expect(response.couponPromotion[deal.couponCode]).to.have.property('id', deal.id);
            console.log(response);
        }));

        var toBeAppliedItems = []
        
        // Check out the order
        var order
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems).then((response)=>{
            console.log(response);
            order = response;
        }));

       
        var confirmationInfo = {   "isPickUp": false,  }

        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
        
        var cardID = Cypress.env('enduser0001Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id).then((response)=>{
            console.log(response);
        })); 
        
        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"reject",{ rejectMessage: 'Item sold out'}).then((response)=>{
            console.log(response);
        }));        
        
        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'REFUNDED');
        }));

        // Check again the discount Deal

        cy.waitUntil(() => cy.getPromotionByID(store1.hiddenDiscount20CAD.id).then((response)=>{
            expect(response).to.have.property('limitedStock', deal.limitedStock-1);
            console.log(response);
        }));







        // Add another order but will be canceled this case. Expect the limitedStock stay unchanged


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,3,store1.AG1AO1.id,1).then((response)=>{
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 3);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);
            console.log(response);

        }));

        cy.waitUntil(() => cy.addCoupon(store1.storeID.id, deal.couponCode).then((response)=>{
            expect(response.couponPromotion[deal.couponCode]).to.have.property('id', deal.id);
            console.log(response);
        }));

        var toBeAppliedItems = []
        
        // Check out the order
        var order
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems).then((response)=>{
            console.log(response);
            order = response;
        }));

       
        var confirmationInfo = {   "isPickUp": false,  }

        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
        }));

        cy.waitUntil(() => cy.cancelOrder(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
        }));

                // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

                // Check again the discount Deal

        cy.waitUntil(() => cy.getPromotionByID(store1.hiddenDiscount20CAD.id).then((response)=>{
            expect(response).to.have.property('limitedStock', deal.limitedStock-1);
            console.log(response);
        }));

    });
})
