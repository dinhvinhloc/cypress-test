describe('API014a9 - Test the endpoint to get ATIVE orders and count number of ACTIVE orders', function () {
    it('Test the endpoint to get ATIVE orders and count number of ACTIVE orders', function () {
        
        // Test points:
        // Count the number of active orders
        // Create an order and process it to PAID
        // Get ACTIVE orders and assert the existing of created order
        // Count the number of active orders again -> assert vs the previous value
        // Process the order to COMPLETED
        // Get ACTIVE orders again, assert that the above order is not in the response
        // Count the number of active orders again -> assert the value to be equal to the value from the beginning

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1        
        var timeZoneAdjustment = Cypress.env('timeZoneAdjustment');        
        const now = Cypress.dayjs().add(5,'minutes').utcOffset(timeZoneAdjustment).format();
        const then = Cypress.dayjs().add(-1,'minutes').utcOffset(timeZoneAdjustment).format();

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
            console.log(store1);
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

        var numberOfActiveOrders
        var activeOrders

        cy.waitUntil(() => cy.countActiveOrders().then((response)=>{
            console.log("NUMBER OF ACTIVE ORDERS",response);
            numberOfActiveOrders = response.body
        })); 

        cy.waitUntil(() => cy.getActiveOrders().then((response)=>{
            console.log("ACTIVE ORDERS",response);
            activeOrders = response
        })); 


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
        

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.countActiveOrders().then((response)=>{
            console.log("NUMBER OF ACTIVE ORDERS AFTER HAVING 1 MORE ACTIVE ORDER",response);
            expect(response.body).to.equal(numberOfActiveOrders+1);
        })); 

        var myActiveOrders =[]
        
        cy.waitUntil(() => cy.getActiveOrders().then((response)=>{
            console.log("ACTIVE ORDERS",response);
            cy.wrap(response).each((activeOrder)=>{
                if (activeOrder.id == order.id){
                    myActiveOrders.push(activeOrder)
                }
            })
        })); 

        cy.wrap(myActiveOrders).then(()=>{
            console.log(myActiveOrders)
            expect(myActiveOrders.length,"Assert my active orders to have the current order").to.equal(1);
        })

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
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

        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
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
        
        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'READY');
            expect(response).to.have.property('status', 'PAID');
        }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        //     console.log(response);
        // }));
        
        // delivering order -> Expect failed
        cy.waitUntil(() => cy.merchantOrderCommandAllowFail(order.id, store1.storeID.id,"delivering",{ processingTime: 30 }).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 400);

        }));

        // Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'READY');
            expect(response).to.have.property('status', 'PAID');
        }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        //     console.log(response);
        // }));
        
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PICKUP');
            expect(response).to.have.property('status', 'COMPLETED');
        }));
        
        
        //Get the order by ID and check the completion
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', 'PICKUP');
            expect(response).to.have.property('status', 'COMPLETED');
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.countActiveOrders().then((response)=>{
            console.log("NUMBER OF ACTIVE ORDERS AFTER COMPLETE THE ORDER",response);
            expect(response.body).to.equal(numberOfActiveOrders);
        })); 

        var myActiveOrders1 =[]
        
        cy.waitUntil(() => cy.getActiveOrders().then((response)=>{
            console.log("ACTIVE ORDERS",response);
            cy.wrap(response).each((activeOrder)=>{
                if (activeOrder.id == order.id){
                    myActiveOrders1.push(activeOrder)
                }
            })
        })); 

        cy.wrap(myActiveOrders).then(()=>{
            expect(myActiveOrders1.length,"Assert my active orders to NOT have the current order").to.equal(0);
        })


        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))
                //Get the order by ID and check the completion
                cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
                    console.log(response);
                    expect(response.storeImages).to.be.an('array');
                    expect(response).to.have.property('storePhone', store1.storeID.phone);
                    expect(response.storeAddress).to.deep.equal(store1.storeID.address)
                }));

    });
})
