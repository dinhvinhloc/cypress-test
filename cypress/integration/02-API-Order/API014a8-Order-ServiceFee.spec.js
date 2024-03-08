describe('API014a8 - Test that the order will charge a Service Fee in case the amount is small', function () {
    it('Verify that the order will charge a Service Fee in case the amount is small', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1        

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
            console.log(store1);
        }));            
        
        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        var rewardItem = [];
        // Add 1 PG4P1 to the cart expect a Service Fee will be presented
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG4P1.id,1,null,null).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serviceFee', 0.5);
            cy.assertTaxItem("PG4P1",1,response.items[0].totalDiscountAmount, response.items[0].appliedTaxes)
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem = response.toBeAppliedPromotion;
        }));

        // Update item PG4P1 to exceed the amount that will be charge for service Fee, expect service Fee is null
        cy.waitUntil(() => cy.updateItemInCart(1, store1.storeID.id,store1.PG4P1.id,26,null,null).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serviceFee', null);
            cy.assertTaxItem("PG4P1",26,response.items[0].totalDiscountAmount, response.items[0].appliedTaxes)
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem = response.toBeAppliedPromotion;
        }));

        // Update item PG4P1 back to lower the amount that will be charge for service Fee, expect service Fee is presented
        cy.waitUntil(() => cy.updateItemInCart(1, store1.storeID.id,store1.PG4P1.id,10,null,null).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serviceFee', 0.5);
            cy.assertTaxItem("PG4P1",10,response.items[0].totalDiscountAmount, response.items[0].appliedTaxes)
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem = response.toBeAppliedPromotion;
        }));


        var toBeAppliedItems = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() => 
            cy.wrap(rewardItem).each((item)=>{

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
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serviceFee', 0.5);
            cy.assertTaxItem("PG4P1",10,response.items[0].totalDiscountAmount, response.items[0].appliedTaxes)
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            order = response;
        }));

       
        var confirmationInfo = {   "isPickUp": true,  }

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
            expect(response).to.have.property('serveStatus', 'ACCEPTED');
            expect(response).to.have.property('status', 'PAID');
        }));

        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PREPARING');
            expect(response).to.have.property('status', 'PAID');
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'READY');
            expect(response).to.have.property('status', 'PAID');
        }));
      
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PICKUP');
            expect(response).to.have.property('status', 'COMPLETED');
        }));

    });
})
