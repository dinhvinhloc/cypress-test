describe('API012h - Apply Fixed Discount on Item ', function () {
    it('Business Category: the Apply Fixed Discount on Item should be automatically apply when meet requirements', function () {
        
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
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.dis10PerPG2P2.id).then((response)=>{
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

        // Add 1 PG2P2 to the cart and expect discount 10% off to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P2.id,1,store1.AG2AO2.id,1).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);
            expect(response.appliedPromotion[0]).to.have.property('dealType', deal.dealType);  
            expect(response).to.have.property('discountAmount', 3.49);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)


        }));

        // cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
        //     console.log(response);
            
        //     // Check suggested Promotion
        //     expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
                        
        // }));

        // cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P3.id,1,null,null).then((response)=>{
        //     console.log(response);
        //     // Check applied Promotion
        //     expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
        //     expect(response).to.have.property('discountAmount', 20);
        //     cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        // }));



        // cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
        //     expect(response).to.have.property('isCartEmpty', true);

        // }));

    });
})
