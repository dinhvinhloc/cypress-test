describe('API014f - Order to apply coupon code of a Free Item', function () {
    it('Test that the order is able to apply a coupon code of a Free Item and', function () {
        
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
        cy.waitUntil(() => cy.getPromotionByID(store1.freePG3P1At250.id).then((response)=>{
            // expect(response).to.have.property('isCartEmpty', true);
            console.log(response);
            return deal = response
        }));
        
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P2At250.id));  


        cy.wrap(deal).then(()=>{
            deal.isPublicAvailable = false
            cy.waitUntil(()=> cy.updateDeal(deal,deal.id).then((updatedDeal)=>{
                expect(updatedDeal).to.have.property('isPublicAvailable', false);
            }));
        })

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));
        var rewardItem = []
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P3.id,10,null,null).then((response)=>{
            expect(response.items[0]).to.have.property('productId', store1.PG1P3.id);
            expect(response.items[0]).to.have.property('quantity', 10);
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
        }));

        cy.waitUntil(() => cy.addCoupon(store1.storeID.id, deal.couponCode).then((response)=>{
            expect(response.couponPromotion[deal.couponCode]).to.have.property('id', deal.id);
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
        }));

        var toBeAppliedItems = []
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

        cy.waitUntil(() => cy.getPromotionByID(deal.id).then((response)=>{
            expect(response).to.have.property('limitedStock', deal.limitedStock-1);
            console.log(response);
        }));

        cy.wrap(deal).then(()=>{
            deal.isPublicAvailable = true
            cy.waitUntil(()=> cy.updateDeal(deal,deal.id).then((updatedDeal)=>{
                expect(updatedDeal).to.have.property('isPublicAvailable', true);
            }));
        })
        
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P2At250.id));  


    });
})
