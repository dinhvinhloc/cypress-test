describe('API012k - isMaster on deals ', function () {
    it('Test that the Deal that has isMaster is always applied. Add/Remove items impact number of deals applied and discount is recalculated', function () {
        
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

        // Get 2 Deals information and store them

        var fixedCartDiscount
        var fixedCartDiscount_origin
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.dis20CADONCART200CAD.id).then((response)=>{
            return fixedCartDiscount = fixedCartDiscount_origin = response
        }));
        
        var percentCartDiscount
        var percentCartDiscount_origin
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.dis10PERONCART300CAD.id).then((response)=>{
            return percentCartDiscount = percentCartDiscount_origin = response
        }));

        // Change the Percentage discount to be isMaster and both does not change on addone
        
        cy.wrap((fixedCartDiscount)).then(()=>{
            fixedCartDiscount.isMaster = false;
            fixedCartDiscount.isAddonCharged = false;
            console.log(fixedCartDiscount) 
        })


        cy.wrap((fixedCartDiscount)).then(()=>{
            percentCartDiscount.isMaster = true;
            percentCartDiscount.isAddonCharged = false;
            console.log(percentCartDiscount)
        })

        // Update the Deals info

        cy.waitUntil(()=> cy.updateDeal(fixedCartDiscount,fixedCartDiscount.id).then((updatedDeal)=>{
            expect(updatedDeal).to.have.property('isMaster', fixedCartDiscount.isMaster);
            expect(updatedDeal).to.have.property('isAddonCharged', fixedCartDiscount.isAddonCharged);
        }));


        cy.waitUntil(()=> cy.updateDeal(percentCartDiscount,percentCartDiscount.id).then((updatedDeal)=>{
            expect(updatedDeal).to.have.property('isMaster', percentCartDiscount.isMaster);
            expect(updatedDeal).to.have.property('isAddonCharged', percentCartDiscount.isAddonCharged);
        }));


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add  PG3P5 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P5.id,3,store1.AG1AO1.id,3).then((response)=>{
            console.log(response);
            
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);  
            expect(response).to.have.property('discountAmount', 25.004);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)


        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,5,store1.AG1AO1.id,5).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[1]).to.have.property('id', fixedCartDiscount.id);  
            expect(response.appliedPromotion[0]).to.have.property('id', percentCartDiscount.id);
            expect(response).to.have.property('discountAmount', 68.945);
        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,3,null,null).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);  
            expect(response).to.have.property('discountAmount', 20);
        }));
        // EXCLUSIVE TEST

        // Login as merchant to change back the deals
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        
        // Change the Percentage discount to be isMaster and both does not change on addon
        
        cy.wrap((fixedCartDiscount)).then(()=>{
            fixedCartDiscount.isMaster = false;
            fixedCartDiscount.isAddonCharged = false;

            console.log(fixedCartDiscount) 
        })


        cy.wrap((fixedCartDiscount)).then(()=>{
            percentCartDiscount.isMaster = false;
            percentCartDiscount.isAddonCharged = false;
            console.log(percentCartDiscount)
        })

        // Update the Deals info

        cy.waitUntil(()=> cy.updateDeal(fixedCartDiscount,fixedCartDiscount.id).then((updatedDeal)=>{
            expect(updatedDeal).to.have.property('isMaster', fixedCartDiscount.isMaster);
            expect(updatedDeal).to.have.property('isAddonCharged', fixedCartDiscount.isAddonCharged);
        }));


        cy.waitUntil(()=> cy.updateDeal(percentCartDiscount,percentCartDiscount.id).then((updatedDeal)=>{
            expect(updatedDeal).to.have.property('isMaster', percentCartDiscount.isMaster);
            expect(updatedDeal).to.have.property('isAddonCharged', percentCartDiscount.isAddonCharged);
        }));


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add  PG3P5 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P5.id,3,store1.AG1AO1.id,3).then((response)=>{
            console.log(response);
            
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);  
            expect(response).to.have.property('discountAmount', 25.004);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)


        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,5,store1.AG1AO1.id,5).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);
            expect(response).to.have.property('discountAmount', 33.9);
        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,3,null,null).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);  
            expect(response).to.have.property('discountAmount', 20);
        }));


        // NON-EXCLUSIVE TEST

        // Login as merchant to change back the deals
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        
        // Change the Percentage discount to be isMaster and both does not change on addon
        
        cy.wrap((fixedCartDiscount)).then(()=>{
            fixedCartDiscount.isMaster = null;
            fixedCartDiscount.isAddonCharged = false;

            console.log(fixedCartDiscount) 
        })


        cy.wrap((fixedCartDiscount)).then(()=>{
            percentCartDiscount.isMaster = null;
            percentCartDiscount.isAddonCharged = false;
            console.log(percentCartDiscount)
        })

        // Update the Deals info

        cy.waitUntil(()=> cy.updateDeal(fixedCartDiscount,fixedCartDiscount.id).then((updatedDeal)=>{
            expect(updatedDeal).to.have.property('isMaster', fixedCartDiscount.isMaster);
            expect(updatedDeal).to.have.property('isAddonCharged', fixedCartDiscount.isAddonCharged);
        }));


        cy.waitUntil(()=> cy.updateDeal(percentCartDiscount,percentCartDiscount.id).then((updatedDeal)=>{
            expect(updatedDeal).to.have.property('isMaster', percentCartDiscount.isMaster);
            expect(updatedDeal).to.have.property('isAddonCharged', percentCartDiscount.isAddonCharged);
        }));


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add  PG3P5 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P5.id,3,store1.AG1AO1.id,3).then((response)=>{
            console.log(response);
            
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);  
            expect(response).to.have.property('discountAmount', 25.004);

        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,5,store1.AG1AO1.id,5).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);
            expect(response).to.have.property('discountAmount', 68.945);
        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,3,null,null).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', fixedCartDiscount.id);  
            expect(response).to.have.property('discountAmount', 20);
        }));

        // Login as merchant to change back the deals
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Change back the Deals

        cy.wrap((fixedCartDiscount)).then(()=>{
            fixedCartDiscount.isMaster = true;
            fixedCartDiscount.isAddonCharged = true;
        })

        cy.wrap((fixedCartDiscount)).then(()=>{
            percentCartDiscount.isMaster = true;
            percentCartDiscount.isAddonCharged = true;
        })

        // Update the Deals info

        cy.waitUntil(()=> cy.updateDeal(store1.dis20CADONCART200CAD,store1.dis20CADONCART200CAD.id));
        cy.waitUntil(()=> cy.updateDeal(store1.dis10PERONCART300CAD,store1.dis10PERONCART300CAD.id));



    });
})
