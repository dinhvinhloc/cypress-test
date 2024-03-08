describe('API014a6 - Test retrieving Order from the archive order list', function () {
    it('Verify the orders completed: delivery, pickup, dinein and orders rejected, redeemed and search orders by text ', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')

        var email
        var password

        var store1        

        var timeZoneAdjustment = Cypress.env('timeZoneAdjustment');        
        const now = Cypress.dayjs().add(5,'minutes').utcOffset(timeZoneAdjustment).format();
        const then = Cypress.dayjs().add(-1,'minutes').utcOffset(timeZoneAdjustment).format();

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        //-----------Verifying the Order-delivered from Archive 

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,10,null,null).then((response)=>{
        console.log(response);
        // expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem1 = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG2AO1.id,2).then((response)=>{
            console.log(response);
            // expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 240.119);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem1 = response.toBeAppliedPromotion
            console.log(rewardItem1);
        }));
        
        var toBeAppliedItems1 = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() => 
            cy.wrap(rewardItem1).each((item)=>{

                toBeAppliedItems1.push(
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
        var order1
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems1).then((response)=>{
            console.log(response);
            order1 = response;
        }));

       
        var confirmationInfo1
        cy.waitUntil(() => cy.get('@confirmTemplate').then((info)=>{confirmationInfo1 = info}));        
        // Confirm the order
        var confirmResponse1
        cy.waitUntil(() => cy.confirmOrder(order1.id,confirmationInfo1).then((response)=>{
            console.log(response);
            confirmResponse1 = response
        }));

        // Pay with the cardID
        
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
       
        var cardID1 = Cypress.env('enduser0001Card');
        var chargeID1;
        cy.waitUntil(() => cy.payOrder(confirmResponse1.clientSecret,cardID1).then((response)=>{
            console.log(response);
            chargeID1 = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order1.id).then((response)=>{
            console.log(response);
        })); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);


        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order1.id, store1.storeID.id,"accept","").then((response)=>{
            console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order1.id, store1.storeID.id,"preparing",{ processingTime: 15 }).then((response)=>{
            console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order1.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
        }));
        
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        //     console.log(response);
        // }));
        
        // delivering order
        cy.waitUntil(() => cy.merchantOrderCommand(order1.id, store1.storeID.id,"delivering",{ processingTime: 60 }).then((response)=>{
            console.log(response);
        }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        //     console.log(response);
        // }));
        
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order1.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
        }));
        

        // Search for the order that just completed from the archive 

        cy.waitUntil(() => cy.getArchivedOrders(store1.storeID.id, then, now, "0", "1", "DELIVERY", "NORMAL", "COMPLETED").then((response)=>{
            var myOrder1 = response.content[0]
            //console.log(response);
            console.log(myOrder1);
            expect(myOrder1).to.have.property('id', order1.id);
            expect(myOrder1).to.have.property('status', 'COMPLETED');

            // orderType has been removed 
            // expect(myOrder1).to.have.property('orderType', 'NORMAL');
            expect(myOrder1).to.have.property('serveStatus', 'DELIVERED');
            
            }));

        // BP-2138 Verify that the order created is retrieved when searched by a text in order instruction
        cy.waitUntil(() => cy.searchArchivedOrdersByText(store1.storeID.id, then, now, "0", "1", "DELIVERY", "Free Item" ).then((response)=>{
            var myOrder1 = response.content[0]
            console.log(myOrder1);
            expect(myOrder1).to.have.property('id', order1.id);
            }));

        // Verify that no orders returned when searched with a non-existant text 
        cy.waitUntil(() => cy.searchArchivedOrdersByText(store1.storeID.id, then, now, "0", "1", "DELIVERY", "Randomtext" ).then((response)=>{
            expect(response).to.have.property('totalElements', 0);
            console.log(response);
            }));



         //---------------Verifying the Order-picked up from Archive 

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
            console.log(response);
        }));
        

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,10,null,null).then((response)=>{
            console.log(response);
          //  expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem2 = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG2AO1.id,2).then((response)=>{
            console.log(response);
         //   expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 240.119);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem2 = response.toBeAppliedPromotion
            console.log(rewardItem2);
        }));
        
        var toBeAppliedItems2 = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() => 
            cy.wrap(rewardItem2).each((item)=>{

                toBeAppliedItems2.push(
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
        var order2
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems2).then((response)=>{
            console.log(response);
            order2 = response;
        }));


        var confirmationInfo2 = {   "isPickUp": true,  }

        var confirmResponse2
        cy.waitUntil(() => cy.confirmOrder(order2.id,confirmationInfo2).then((response)=>{
            console.log(response);
            confirmResponse2 = response
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
        
        var cardID2 = Cypress.env('enduser0001Card');
        var chargeID2;
        cy.waitUntil(() => cy.payOrder(confirmResponse2.clientSecret,cardID2).then((response)=>{
            console.log(response);
            chargeID2 = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order2.id).then((response)=>{
            console.log(response);
        })); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order2.id, store1.storeID.id,"accept","").then((response)=>{
            console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order2.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
            console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order2.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
        }));
        
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        //     console.log(response);
        // }));
        
        // delivering order
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivering",{ processingTime: 30 }).then((response)=>{
        //     console.log(response);
        // }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        //     console.log(response);
        // }));
        
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order2.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
        }));
        
        
        
        // Search for the order that just created from the archive 
        cy.waitUntil(() => cy.getArchivedOrders(store1.storeID.id, then, now, "0", "1", "PICKUP", "NORMAL", "COMPLETED").then((response)=>{

            var myOrder2 = response.content[0]
            //console.log(response);
            console.log(myOrder2);
            expect(myOrder2).to.have.property('id', order2.id);
            expect(myOrder2).to.have.property('status', 'COMPLETED');

            // orderType has been removed 

            // expect(myOrder2).to.have.property('orderType', 'NORMAL');
            expect(myOrder2).to.have.property('serveStatus', 'PICKUP');

        }));
     

        //--------------Verifying the Order-served from Archive 

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,10,null,null).then((response)=>{
            console.log(response);
           // expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem3 = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG2AO1.id,2).then((response)=>{
            console.log(response);
           // expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 240.119);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem3 = response.toBeAppliedPromotion
            console.log(rewardItem3);
        }));
        
        var toBeAppliedItems3 = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() => 
            cy.wrap(rewardItem3).each((item)=>{

                toBeAppliedItems3.push(
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
        var order3
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems3).then((response)=>{
            console.log(response);
            order3 = response;
        }));

       
        var confirmationInfo3 = {   "isPickUp": false,  }

        var confirmResponse3
        cy.waitUntil(() => cy.confirmOrder(order3.id,confirmationInfo3).then((response)=>{
            console.log(response);
            confirmResponse3 = response
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
        
        var cardID3 = Cypress.env('enduser0001Card');
        var chargeID3;
        cy.waitUntil(() => cy.payOrder(confirmResponse3.clientSecret,cardID3).then((response)=>{
            console.log(response);
            chargeID3 = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order3.id).then((response)=>{
            console.log(response);
        })); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order3.id, store1.storeID.id,"accept","").then((response)=>{
            console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order3.id, store1.storeID.id,"preparing",{ processingTime: 15 }).then((response)=>{
            console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order3.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
        }));
        
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        //     console.log(response);
        // }));
        
        // delivering order
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivering",{ processingTime: 30 }).then((response)=>{
        //     console.log(response);
        // }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        //     console.log(response);
        // }));
        
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order3.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
        }));
        
       
        // Search for the order that just created from the archive 

        cy.waitUntil(() => cy.getArchivedOrders(store1.storeID.id, then, now, "0", "1", "DINE_IN", "NORMAL", "COMPLETED").then((response)=>{
        var myOrder3 = response.content[0]
        //console.log(response);
        console.log(myOrder3);
        expect(myOrder3).to.have.property('id', order3.id);
        expect(myOrder3).to.have.property('status', 'COMPLETED');
                // orderType has been removed 

        // expect(myOrder3).to.have.property('orderType', 'NORMAL');
        expect(myOrder3).to.have.property('serveStatus', 'SERVED');
    }));

     //---------------Verifying the Order-Rejected from Archive 
        
    email = Cypress.env('enduser0001');
    password = Cypress.env('enduser0001Pass');
    cy.Login(email, password);

    cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
        expect(response).to.have.property('isCartEmpty', true);
    }));

    // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
    cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,10,null,null).then((response)=>{
        console.log(response);
       // expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
    }));


    // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
    var rewardItem4 = [];
    cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG2AO1.id,2).then((response)=>{
        console.log(response);
        // expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
        expect(response).to.have.property('discountAmount', 240.119);
        cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
        rewardItem4 = response.toBeAppliedPromotion
        console.log(rewardItem4);
    }));
    
    var toBeAppliedItems4 = []
    // Construct the toBeAppliedItems json
    cy.waitUntil(() => 
        cy.wrap(rewardItem4).each((item)=>{

            toBeAppliedItems4.push(
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
    var order4
    cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems4).then((response)=>{
        console.log(response);
        order4 = response;
    }));

   
    var confirmationInfo4
    cy.waitUntil(() => cy.get('@confirmTemplate').then((info)=>{confirmationInfo4 = info}));        
    // Confirm the order
    var confirmResponse4
    cy.waitUntil(() => cy.confirmOrder(order4.id,confirmationInfo4).then((response)=>{
        console.log(response);
        confirmResponse4 = response
    }));

    // Pay with the cardID
    
    email = Cypress.env('adminUser');
    password = Cypress.env('adminPass');
    cy.Login(email, password);
   
    var cardID4 = Cypress.env('enduser0001Card');
    var chargeID4;
    cy.waitUntil(() => cy.payOrder(confirmResponse4.clientSecret,cardID4).then((response)=>{
        console.log(response);
        chargeID4 = response;
    }));

    email = Cypress.env('enduser0001');
    password = Cypress.env('enduser0001Pass');
    cy.Login(email, password);

    // Confirm order is paid
    cy.waitUntil(() => cy.confirmPaid(order4.id).then((response)=>{
        console.log(response);
    })); 

    // Login as merchant
    email = Cypress.env('merchant1');
    password = Cypress.env('merchant1Pass');
    cy.Login(email, password);


   // REJECT the order
   cy.waitUntil(() => cy.merchantOrderCommand(order4.id, store1.storeID.id,"reject",{ rejectMessage: 'The store is closed'}).then((response)=>{
    console.log(response);
    expect(response).to.have.property('status', 'REFUNDED');
    expect(response).to.have.property('serveStatus', 'REJECTED');
 }));
    

    // Search for the order that just rejected from the archive 
    cy.waitUntil(() => cy.getArchivedOrders(store1.storeID.id, then, now, "0", "1", "DELIVERY", "NORMAL", "REFUNDED").then((response)=>{
        var myOrder4 = response.content[0]
        //console.log(response);
        console.log(response);
        expect(myOrder4).to.have.property('id', order4.id);
        expect(myOrder4).to.have.property('status', 'REFUNDED');
        // orderType has been removed 
        // expect(myOrder4).to.have.property('orderType', 'NORMAL');
        expect(myOrder4).to.have.property('serveStatus', 'REJECTED');
        
        }));


    //-------------Verify Redeem Order-Completed from Archive 

    //Login as merchant to get the coupon code
        
    var merchantID
    var email = Cypress.env('merchant1');
    var password = Cypress.env('merchant1Pass');
    cy.Login(email, password).then((response)=>{
        merchantID = response.merchantID
        console.log(merchantID)
    });

    var deal
    cy.waitUntil(() => 
    cy.getPromotionByID(store1.rewardPG1P2.id).then((response)=>{
        console.log(response);
        return deal = response
    }));
    
    var pointPerkDeal
    cy.waitUntil(() => 
    cy.getPromotionByID(store1.pointPerkPG3P5.id).then((response)=>{
        console.log(response);
        return pointPerkDeal = response
    }));

    email = Cypress.env('enduser0001');
    password = Cypress.env('enduser0001Pass');
    cy.Login(email, password);


    // Get all user punch points, extract to User Point of the store and his Global Point
    var userPointIDOfThisStore
    var globalUserPoint
    cy.waitUntil(() => cy.getUserPoints().then((response)=>{
        console.log("Here are all the points")
        console.log(response)
        cy.wrap(response).each((userPoint)=>{
            if (userPoint.merchantId == merchantID){
                userPointIDOfThisStore = userPoint
                console.log(userPointIDOfThisStore)
            } else if (userPoint.merchantId == null){
                globalUserPoint = userPoint
                console.log(globalUserPoint)
            }
        })
    }));

    cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{
        console.log(response)
        globalUserPoint = response
    }));

    // CREATE AN ORDER OF 3 x PG3P7 WHICH GIVE USER 3 x 7000 = 21000 points
    var rewardItem5 = [];
    cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P6.id,2,store1.AG3AO2.id,3).then((response)=>{
        console.log(response);
        rewardItem5 = response.toBeAppliedPromotion
        console.log(rewardItem5);
    }));
    cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P7.id,1,store1.AG3AO2.id,3).then((response)=>{
        console.log(response);
        rewardItem5 = response.toBeAppliedPromotion
        console.log(rewardItem5);
    }));
    
    var toBeAppliedItems5 = []
    // Construct the toBeAppliedItems json
    cy.waitUntil(() => 
        cy.wrap(rewardItem5).each((item)=>{

            toBeAppliedItems5.push(
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
    var order5
    cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems5).then((response)=>{
        console.log(response);
        order5 = response;
    }));
   
    var confirmationInfo5 = {   "isPickUp": true,  }
    var confirmResponse5
    cy.waitUntil(() => cy.confirmOrder(order5.id,confirmationInfo5).then((response)=>{
        confirmResponse5 = response
    }));

    // Pay with the cardID
    email = Cypress.env('adminUser');
    password = Cypress.env('adminPass');
    cy.Login(email, password);
    
    var cardID5 = Cypress.env('enduser0001Card');
    var chargeID5;
    cy.waitUntil(() => cy.payOrder(confirmResponse5.clientSecret,cardID5).then((response)=>{
        console.log(response);
        chargeID5 = response;
    }));

    email = Cypress.env('enduser0001');
    password = Cypress.env('enduser0001Pass');
    cy.Login(email, password);

    // Confirm order is paid
    cy.waitUntil(() => cy.confirmPaid(order5.id)); 

    // Login as merchant
    email = Cypress.env('merchant1');
    password = Cypress.env('merchant1Pass');
    cy.Login(email, password);

    // Accept the order
    cy.waitUntil(() => cy.merchantOrderCommand(order5.id, store1.storeID.id,"accept",""));
    // preparing the order
    cy.waitUntil(() => cy.merchantOrderCommand(order5.id, store1.storeID.id,"preparing",{ processingTime: 15 }));
    // make the order ready
    cy.waitUntil(() => cy.merchantOrderCommand(order5.id, store1.storeID.id,"ready",""));
    // complete the oder
    cy.waitUntil(() => cy.merchantOrderCommand(order5.id, store1.storeID.id,"complete","").then((response)=>{
        expect(response).to.have.property('status', 'COMPLETED');
    }));        

    //----------------------------- REDEEM REWARD ITEM -------------------------------
    // Login back as end user and REDEEM the REWARD ITEM
    email = Cypress.env('enduser0001');
    password = Cypress.env('enduser0001Pass');
    cy.Login(email, password);

    // Get User Point again and expect it to increase 3 x 7000 points
    cy.waitUntil(() => cy.getUserPoints().then((response)=>{
        cy.wrap(response).each((userPoint)=>{
            if (userPoint.merchantId == merchantID){
                expect(userPoint.point).to.equal(3*pointPerkDeal.rewardPoints + userPointIDOfThisStore.point);
            }
        })
    }));
    


    var redeemProductList = []
    // Construct the redeemProductList json
    cy.waitUntil(() => 
        cy.wrap(deal.rewardProductList).each((item)=>{
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
    
    // Redeem the Order using Point
    // var redeemOrder
    // cy.waitUntil(() => cy.redeemPoint(store1.storeID.id,deal.id,userPointIDOfThisStore.id,redeemProductList).then((response)=>{
    //     console.log(response);
    //     redeemOrder = response;
    // }));

    // cy.waitUntil(() => cy.confirmOrder(redeemOrder.id,confirmationInfo5).then((response)=>{
    //     confirmResponse5 = response
    // }));

    cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
        expect(response).to.have.property('isCartEmpty', true);
    }));

    cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id, deal.id, redeemProductList).then((response) => {
        console.log(response);
    }));


    // Check out the order
    var toBeAppliedItems6 = []
    var redeemOrder
    cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems6).then((response) => {
        console.log(response);
        redeemOrder = response;
    }));

    var confirmationInfo = { "isPickUp": true, }
    var confirmResponse
    cy.waitUntil(() => cy.confirmOrder(redeemOrder.id, confirmationInfo).then((response) => {
        confirmResponse = response
        console.log(response)
    }));
    var chargeID;
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

    // Confirm order is paid
    cy.waitUntil(() => cy.confirmPaid(redeemOrder.id));




    // // Pay with the cardID
    // email = Cypress.env('adminUser');
    // password = Cypress.env('adminPass');
    // cy.Login(email, password);
   
    // var cardID5 = Cypress.env('enduser0001Card');
    // var chargeID5;
    // cy.waitUntil(() => cy.payOrder(confirmResponse5.clientSecret,cardID5).then((response)=>{
    //     console.log(response);
    //     chargeID5 = response;
    // }));

    // email = Cypress.env('enduser0001');
    // password = Cypress.env('enduser0001Pass');
    // cy.Login(email, password);

    // // Confirm order is paid
    // cy.waitUntil(() => cy.confirmPaid(redeemOrder.id)); 

    // Login as merchant
    email = Cypress.env('merchant1');
    password = Cypress.env('merchant1Pass');
    cy.Login(email, password);

    // Merchant Accept the order
    cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"accept",""));
    // Merchant preparing the order
    cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"preparing",{ processingTime: 15 }));
    // Merchant make the order ready
    cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"ready",""));
    // Merchant complete the oder
    cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"complete","").then((response)=>{
        expect(response).to.have.property('status', 'COMPLETED');
    })); 


    // Search for the Redeem order that just created from the archive 
    cy.waitUntil(() => cy.getArchivedOrders(store1.storeID.id, then, now, "0", "1", "PICKUP", "NORMAL", "COMPLETED").then((response)=>{
        var myOrder5 = response.content[0]
        //console.log(response);
        console.log(myOrder5);
        expect(myOrder5).to.have.property('id', redeemOrder.id);
        expect(myOrder5).to.have.property('status', 'COMPLETED');
                // orderType has been removed 

        // expect(myOrder5).to.have.property('orderType', 'NORMAL');
        expect(myOrder5).to.have.property('serveStatus', 'PICKUP');

    }));
});

})

