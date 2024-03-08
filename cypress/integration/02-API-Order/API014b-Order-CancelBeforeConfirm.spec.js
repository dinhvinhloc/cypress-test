describe('API014b - Test the end user is able to cancel the order before confirm', function () {
    it('Verify the end user is able to cancel the order before confirm', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1        
        const now = Cypress.dayjs().add(5,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const then = Cypress.dayjs().add(-1,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var deal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.boPG3P4foPG1P1.id).then((response)=>{
            console.log(response);
            return deal = response
        })
        );        


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,10,null,null).then((response)=>{
            console.log(response);
            expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG2AO1.id,2).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 240.119);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
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
            order = response;
        }));

        cy.waitUntil(() => cy.cancelOrder(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
    }));
        
        
        // var confirmationInfo
        // cy.waitUntil(() => cy.get('@confirmTemplate').then((info)=>{confirmationInfo = info}));        
        // // Confirm the order
        // var confirmResponse
        // cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
        //     console.log(response);
        //     confirmResponse = response
        // }));

        // // Pay with the cardID
        // var cardID = Cypress.env('enduser0001Card');
        // var chargeID;
        // cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
        //     console.log(response);
        //     chargeID = response;
        // }));

        // // Confirm order is paid
        // cy.waitUntil(() => cy.confirmPaid(order.id).then((response)=>{
        //     console.log(response);
        // })); 

        // // Login as merchant
        // email = Cypress.env('merchant1');
        // password = Cypress.env('merchant1Pass');
        // cy.Login(email, password);

        // // Accept the order
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept","").then((response)=>{
        //     console.log(response);
        // }));
        
        // // preparing the order
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
        //     console.log(response);
        // })); 

        // // make the order ready
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready","").then((response)=>{
        //     console.log(response);
        // }));
        
        // // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        // //     console.log(response);
        // // }));
        
        // // delivering order
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivering",{ processingTime: 30 }).then((response)=>{
        //     console.log(response);
        // }));

        // // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        // //     console.log(response);
        // // }));
        
        // // complete the oder
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
        //     console.log(response);
        // }));
        
        
        // // Get the order by ID and check the completion
        // cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
        //     console.log(response);
        //     expect(response).to.have.property('status', 'COMPLETED');
        // }));

        // // Get the orders by the store, check the last order
        // cy.waitUntil(() => cy.getOrdersByStore(store1.storeID.id).then((response)=>{
        //     console.log(response);
        //     expect(response[response.length-1]).to.have.property('id', order.id);
        //     expect(response[response.length-1]).to.have.property('status', 'COMPLETED');
        // }));

        // // Get all the orders of the merchant, check the last order
        // cy.waitUntil(() => cy.getOrders().then((response)=>{
        //     console.log(response);
        //     expect(response[response.length-1]).to.have.property('id', order.id);
        //     expect(response[response.length-1]).to.have.property('status', 'COMPLETED');
        // }));
        
        // email = Cypress.env('enduser0001');
        // password = Cypress.env('enduser0001Pass');
        // cy.Login(email, password);
        
        // // Get all orders of the enduser, check the last order
        // cy.waitUntil(() => cy.getOrders().then((response)=>{
        //     console.log(response);
        //     expect(response[response.length-1]).to.have.property('id', order.id);
        //     expect(response[response.length-1]).to.have.property('status', 'COMPLETED');
        // }));

    });
})
