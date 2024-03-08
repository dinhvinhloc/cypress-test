describe('API012n1 - Point Perk when maxRedeem = 1', function () {
    it('Test that when maxRedeem = 1, Point Perk will be applied only once', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1;      

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));        
        
        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updatePointPerk(store1.pointPerkPG3P5, store1.pointPerkPG3P5.id))

        var deal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.pointPerkPG3P5.id).then((response)=>{
            console.log(response);
            return deal = response
        })
        );

        // INACTIVATE ALL OTHER DEALS TO NARROW DOWN THE CONDITION
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.pointPerkPG3P5.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.punchCardPG1P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P1At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P2At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P3At600.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.boPG3P4foPG1P1.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis10PerPG2P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis20CADONCART200CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.hiddenDiscount20CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis10PERONCART300CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.rewardPG1P2.id));  
        

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add one PG3P6 and the end user gets 7000 points because maxRedeem is not equal to 1 at this point.
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P6.id,1,null,null).then((response)=>{
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            rewardItem = response.toBeAppliedPromotion;
            console.log("Reward Item:: ",rewardItem);
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
                        "productId": store1.AG3AO1,
                        "addon": true
                        },
                        {
                        "quantity": 1,
                        "instruction": "Addon on Free Item is here",
                        "productId": store1.AG2AO1,
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

         cy.wrap(deal).then(()=>{
            deal.maxRedeem = 1;
            cy.updatePointPerk(deal,deal.id).then((response)=>{
                expect(response).to.have.property("maxRedeem",1);
            })
        })

        // Add the second cart, expect promotion is no longer applicable.
        // Login back with enduser credentials
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add one PG3P6 and the end should not get 7000 points because max redeem is 1.
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P6.id,1,null,null).then((response)=>{
            expect(response.appliedPromotion).to.be.an('array').that.is.empty;
        }));



        // CHANGE BACK THE DEALS -------------------------------------------------
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Update deal to normal
        cy.waitUntil(()=> cy.updatePointPerk(store1.pointPerkPG3P5,store1.pointPerkPG3P5.id));

        
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.pointPerkPG3P5.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.punchCardPG1P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P1At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P2At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P3At600.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.boPG3P4foPG1P1.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis10PerPG2P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis20CADONCART200CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.hiddenDiscount20CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis10PERONCART300CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.rewardPG1P2.id));


    });
})
