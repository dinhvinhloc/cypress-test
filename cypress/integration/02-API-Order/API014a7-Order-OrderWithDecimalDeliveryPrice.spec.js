describe('API014a7 - Test placing order with decimal delivery price', function () {
    var confirmationInfo;
    var store1;
    beforeEach(() => {
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate');
        
        cy.get('@confirmTemplate').then((info) => {             
            confirmationInfo = info;
            console.log(confirmationInfo);
            confirmationInfo.deliveryInfoDTO.deliveryDistance = 10;
            confirmationInfo.deliveryInfoDTO.deliveryPrice = 10.11;
        })
        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.get('@stores').then((info) => {             
            store1 = info[0];
        }) 
        
    }) 
    it('Verify place an order for a delivery price with decimal place', function () {
        
      
        var timeZoneAdjustment = Cypress.env('timeZoneAdjustment');        
        const now = Cypress.dayjs().add(5,'minutes').utcOffset(timeZoneAdjustment).format();
        const then = Cypress.dayjs().add(-1,'minutes').utcOffset(timeZoneAdjustment).format();

        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Recover all the deals
        cy.waitUntil(()=> cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(()=> cy.updateDeal(store1.bundle100CADP3ALLGROUP,store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(()=> cy.updatePointPerk(store1.pointPerkPG3P5,store1.pointPerkPG3P5.id));
        cy.waitUntil(()=> cy.updatePunchCard(store1.punchCardPG1P2,store1.punchCardPG1P2.id));
        cy.waitUntil(()=> cy.updateDeal(store1.freePG3P1At250,store1.freePG3P1At250.id));
        cy.waitUntil(()=> cy.updateDeal(store1.freePG3P2At250,store1.freePG3P2At250.id));
        cy.waitUntil(()=> cy.updateDeal(store1.freePG3P3At600,store1.freePG3P3At600.id));
        cy.waitUntil(()=> cy.updateDeal(store1.boPG3P4foPG1P1,store1.boPG3P4foPG1P1.id));
        cy.waitUntil(()=> cy.updateDeal(store1.dis10PerPG2P2,store1.dis10PerPG2P2.id));
        cy.waitUntil(()=> cy.updateDeal(store1.dis20CADONCART200CAD,store1.dis20CADONCART200CAD.id));
        cy.waitUntil(()=> cy.updateDeal(store1.hiddenDiscount20CAD,store1.hiddenDiscount20CAD.id));
        cy.waitUntil(()=> cy.updateDeal(store1.dis10PERONCART300CAD,store1.dis10PERONCART300CAD.id));
        cy.waitUntil(()=> cy.updateRewardItem(store1.rewardPG1P2,store1.rewardPG1P2.id));


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

       
        // var confirmationInfo
        // cy.waitUntil(() => cy.get('@confirmTemplate').then((info)=>{confirmationInfo = info}));        
        // Confirm the order
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
            order = response;
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



        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('serveStatus', null);
            expect(response).to.have.property('status', 'PAID');
            expect(response).to.contain.keys('customerId', 'customerName','customerPhone')
            expect(response).to.not.contain.keys('merchantId', 'storeName','storeImages')

        }));

        // Get the orders by the store, check the last order
        cy.waitUntil(() => cy.getOrdersByStore(store1.storeID.id).then((response)=>{
            console.log(response);
            expect(response[response.length-1]).to.have.property('id', order.id);
            expect(response[response.length-1]).to.have.property('status', 'PAID');
            
            // Check the entire response contain only PAID orders
            cy.wrap(response).each((item)=>{
                expect(item).to.have.keys('id','isPickup','lastUpdatedAt','merchantId','numberOfItems','paidAt','serveStatus','status','storeId','totalAmount');
                expect(item).to.have.property('status', 'PAID');
                expect(item.id).to.not.be.null;
                expect(item.storeId).to.not.be.null;
                expect(item.numberOfItems).to.not.be.null;
                expect(item.merchantId).to.not.be.null;
                expect(item.lastUpdatedAt).to.not.be.null;
            })

        }));

        // Get all the orders of the merchant, check the last order
        cy.waitUntil(() => cy.getOrders().then((response)=>{
            console.log(response);
            expect(response[response.length-1]).to.have.property('id', order.id);
            expect(response[response.length-1]).to.have.property('status', 'PAID');
        }));

        // Get orders during a startDate and endDate  (https://intransigense.atlassian.net/browse/BP-1407)
        cy.waitUntil(() => cy.getOrdersByDates(then, now).then((response)=>{
            console.log(response);
            expect(response[response.length-1]).to.have.property('id', order.id);
            expect(response[response.length-1]).to.have.property('status', 'PAID');
        }));

        // Get orders during a startDate and endDate  (https://intransigense.atlassian.net/browse/BP-1408)
        cy.waitUntil(() => cy.getOrdersByStoreAndDates(store1.storeID.id,then, now).then((response)=>{
            console.log(response);
            expect(response[response.length-1]).to.have.property('id', order.id);
            expect(response[response.length-1]).to.have.property('status', 'PAID');
            
            // Check the entire response contain only PAID orders

            cy.wrap(response).each((item)=>{
                expect(item).to.have.keys('id','isPickup','lastUpdatedAt','merchantId','numberOfItems','paidAt','serveStatus','status','storeId','totalAmount');
                expect(item).to.have.property('status', 'PAID');
                expect(item.id).to.not.be.null;
                expect(item.storeId).to.not.be.null;
                expect(item.numberOfItems).to.not.be.null;
                expect(item.merchantId).to.not.be.null;
                expect(item.lastUpdatedAt).to.not.be.null;
            })
        }));





        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept","").then((response)=>{
            // console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
            // console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready","").then((response)=>{
            // console.log(response);
        }));
        
        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        //     console.log(response);
        // }));
        
        // delivering order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivering",{ processingTime: 60 }).then((response)=>{
            // console.log(response);
        }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        //     console.log(response);
        // }));
        
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            // console.log(response);
        }));
        
        // https://intransigense.atlassian.net/browse/BP-2163 [Backend] - Update API to return Order fields dynamically for Order History table
        cy.waitUntil(() => cy.getArchivedOrdersCustomFields('storeId,customerId,totalAmount').then((response)=>{
            console.log(response);
            let orders = response.content
            expect(orders[0]).to.have.property('id', order.id);
            expect(orders[0]).to.have.property('storeId', store1.storeID.id);
            expect(orders[0]).to.have.property('customerName', 'User 0001 User 0001');
            expect(orders[0]).to.have.property('customerPhone', '+19876543212');
            expect(orders[0]).to.have.property('totalAmount', order.totalAmount);
        }));
        
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))

        // Verification for https://intransigense.atlassian.net/browse/BP-1637
        cy.waitUntil(() => cy.getOrderByID(order.id).then((response)=>{
            expect(response).to.have.property('serveStatus', 'DELIVERED');
            expect(response).to.have.property('status', 'COMPLETED');
            expect(response).to.not.contain.keys('customerId', 'customerName','customerPhone')
            expect(response).to.contain.keys('merchantId', 'storeName','storeImages')
            // Delivery Object Assertions
            expect(response).to.have.property('deliveryDistance',confirmationInfo.deliveryInfoDTO.deliveryDistance);
            expect(response).to.have.property('deliveryPrice',confirmationInfo.deliveryInfoDTO.deliveryPrice);
            expect(response.deliveryAddress).to.deep.equal(confirmationInfo.deliveryInfoDTO.deliveryAddress);
        }));

        // Get the orders by the store (for end-user https://intransigense.atlassian.net/browse/BP-1391), check the last order
        // https://intransigense.atlassian.net/browse/BP-1934 User no logner has right to get Orders by storeId
        cy.waitUntil(() => cy.getOrdersByStoreAllowFail(store1.storeID.id).then((response)=>{
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 403);
            expect(response).to.have.property('statusText', 'Forbidden');

        }));

        // Get all orders of the enduser, check the last order
        cy.waitUntil(() => cy.getOrders().then((response)=>{
            console.log(response);
            expect(response[response.length-1]).to.have.property('id', order.id);
            expect(response[response.length-1]).to.have.property('status', 'COMPLETED');
        }));

        // Get orders during a startDate and endDate (https://intransigense.atlassian.net/browse/BP-1407)
        cy.waitUntil(() => cy.getOrdersByDates(then, now).then((response)=>{
            console.log(response);
            expect(response[response.length-1]).to.have.property('id', order.id);
            expect(response[response.length-1]).to.have.property('status', 'COMPLETED');
        }));

        // Get orders during a startDate and endDate  (https://intransigense.atlassian.net/browse/BP-1408)
        // https://intransigense.atlassian.net/browse/BP-1934 User no logner has right to get Orders by storeId
        cy.waitUntil(() => cy.getOrdersByStoreAndDatesAllowFail(store1.storeID.id,then, now).then((response)=>{
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 403);
            expect(response).to.have.property('statusText', 'Forbidden');

        }));


    });
})
