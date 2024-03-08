describe('API012e5 - Bundle Deal test - highlightInProductList', function () {
    it('Test the the Bundle deal is suggested based on the product selected in Highlight list', function () {
        
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

        // Reset back the deal to original
        cy.waitUntil(()=> cy.updateDeal(store1.bundle100CADP3ALLGROUP,store1.bundle100CADP3ALLGROUP.id));

        var deal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.bundle100CADP3ALLGROUP.id).then((response)=>{
            console.log(response);
            return deal = response
        })
        );
        // INACTIVATE ALL OTHER DEALS TO NARROW DOWN THE CONDITION
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.pointPerkPG3P5.id));  
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


        // highlightInProductList = null: No promotion suggestion ------------------------------

        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.wrap(deal).then(()=>{
            deal.highlightInProductList = null
            cy.updateDeal(deal,deal.id).then((response)=>{
                expect(response).to.have.property("highlightInProductList",null)
            })
        })

        // Log back in as enduser and add items to the cart
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P3.id,1,store1.AG1AO1.id,1).then((response)=>{
            console.log(response);
            // // Check suggested Promotion
            // expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);

                         // Check applied Promotion SHOULD BE BLANK            
                         expect(response.appliedPromotion).to.be.an('array').that.is.empty;

                         // Check suggested Promotion SHOULD BE BLANK            
                         expect(response.suggestedPromotion).to.be.an('array').that.is.empty;

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            
            // // Check suggested Promotion
            // expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);

                         // Check applied Promotion SHOULD BE BLANK            
                         expect(response.appliedPromotion).to.be.an('array').that.is.empty;

                         // Check suggested Promotion SHOULD BE BLANK            
                         expect(response.suggestedPromotion).to.be.an('array').that.is.empty;
                        
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P3.id,1,null,null).then((response)=>{
            console.log(response);
            // // Check applied Promotion
            // expect(response.appliedPromotion[0]).to.have.property('id', deal.id);
            
                         // Check applied Promotion SHOULD BE BLANK            
                         expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  

                         // Check suggested Promotion SHOULD BE BLANK            
                         expect(response.suggestedPromotion).to.be.an('array').that.is.empty;
            
            expect(response).to.have.property('discountAmount', response.subAmountProducts-deal.fixedAmount);
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));

        // highlightInProductList = [0]: Suggest promotion as soon as the 1st item is added ------------------------

        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.wrap(deal).then(()=>{
            deal.highlightInProductList = [0]
            cy.updateDeal(deal,deal.id).then((response)=>{
                expect(response.highlightInProductList).to.deep.equal([0])
            })
        })

        // Log back in as enduser and add items to the cart
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P3.id,1,store1.AG1AO1.id,1).then((response)=>{
            console.log(response);
            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            
            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
                        
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P3.id,1,null,null).then((response)=>{
            console.log(response);
            // Check applied Promotion
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', response.subAmountProducts-deal.fixedAmount);
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));

        // highlightInProductList = [1]: Suggest promotion only the 2nd item is added ------------------------

        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.wrap(deal).then(()=>{
            deal.highlightInProductList = [1]
            cy.updateDeal(deal,deal.id).then((response)=>{
                expect(response.highlightInProductList).to.deep.equal([1])
            })
        })

        // Log back in as enduser and add items to the cart
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P3.id,1,store1.AG1AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.items[0]).to.have.property('productId', store1.PG1P3.id);
            expect(response.items[0]).to.have.property('quantity', 1);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);

             // Check applied Promotion SHOULD BE BLANK            
             expect(response.appliedPromotion).to.be.an('array').that.is.empty;

             // Check suggested Promotion SHOULD BE BLANK
             expect(response.suggestedPromotion).to.be.an('array').that.is.empty;
            
            //  expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);  

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.items[1]).to.have.property('productId', store1.PG2P3.id);
            expect(response.items[1]).to.have.property('quantity', 1);
            expect(response.items[1].addons[0]).to.have.property('productId', store1.AG2AO1.id);
            expect(response.items[1].addons[0]).to.have.property('quantity', 1);
            
             // Check applied Promotion SHOULD BE BLANK            
             expect(response.appliedPromotion).to.be.an('array').that.is.empty;

             // Check suggested Promotion SHOULD BE BLANK            
             expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);  
                        
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P3.id,1,null,null).then((response)=>{
            console.log(response);
            expect(response.items[2]).to.have.property('productId', store1.PG3P3.id);
            expect(response.items[2]).to.have.property('quantity', 1);


            // Check suggested Promotion
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            // Discount is deal discount + Addon discount
            expect(response).to.have.property('discountAmount', response.subAmountProducts-deal.fixedAmount);
            cy.assertDiscount(response.items,response.discountAmount);

            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));

            // Clear the cart and add the second item first, expect the promotion is suggested right away
            
            cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
                expect(response).to.have.property('isCartEmpty', true);
            }));
    
            
    
            cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
                console.log(response);
                expect(response.items[0]).to.have.property('productId', store1.PG2P3.id);
                expect(response.items[0]).to.have.property('quantity', 1);
                expect(response.items[0].addons[0]).to.have.property('productId', store1.AG2AO1.id);
                expect(response.items[0].addons[0]).to.have.property('quantity', 1);
                
                 // Check applied Promotion SHOULD BE BLANK            
                 expect(response.appliedPromotion).to.be.an('array').that.is.empty;
    
                 // Check suggested Promotion SHOULD NOT BE BLANK            
                 expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);  
                            
            }));

            cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P3.id,1,store1.AG1AO1.id,1).then((response)=>{
                console.log(response);
                expect(response.items[1]).to.have.property('productId', store1.PG1P3.id);
                expect(response.items[1]).to.have.property('quantity', 1);
                expect(response.items[1].addons[0]).to.have.property('productId', store1.AG1AO1.id);
                expect(response.items[1].addons[0]).to.have.property('quantity', 1);
    
                 // Check applied Promotion SHOULD BE BLANK            
                 expect(response.appliedPromotion).to.be.an('array').that.is.empty;
    
                 // Check suggested Promotion SHOULD NOT BE BLANK
                //  expect(response.suggestedPromotion).to.be.an('array').that.is.empty;
                
                 expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);  
    
            }));
    
            cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P3.id,1,null,null).then((response)=>{
                console.log(response);
                expect(response.items[2]).to.have.property('productId', store1.PG3P3.id);
                expect(response.items[2]).to.have.property('quantity', 1);
    
    
                // Check suggested Promotion
                expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
                // Discount is deal discount + Addon discount
                expect(response).to.have.property('discountAmount', response.subAmountProducts-deal.fixedAmount);
                cy.assertDiscount(response.items,response.discountAmount);

                // Check Tax
                cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
        
            }));
        
        
        
        
        
        // CHANGE BACK THE DEALS -------------------------------------------------
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        
        // cy.waitUntil(()=> cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(()=> cy.updateDeal(store1.bundle100CADP3ALLGROUP,store1.bundle100CADP3ALLGROUP.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.pointPerkPG3P5,store1.pointPerkPG3P5.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.punchCardPG1P2,store1.punchCardPG1P2.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.freePG3P1At250,store1.freePG3P1At250.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.freePG3P2At250,store1.freePG3P2At250.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.freePG3P3At600,store1.freePG3P3At600.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.boPG3P4foPG1P1,store1.boPG3P4foPG1P1.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.dis10PerPG2P2,store1.dis10PerPG2P2.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.dis20CADONCART200CAD,store1.dis20CADONCART200CAD.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.hiddenDiscount20CAD,store1.hiddenDiscount20CAD.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.dis10PERONCART300CAD,store1.dis10PERONCART300CAD.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.rewardPG1P2,store1.rewardPG1P2.id));
        
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
