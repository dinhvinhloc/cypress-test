describe('API012e - Apply Bundle Deal test', function () {
    it('Business Category: the Bundle Deal should be automatically apply when meet Bundle Deal criteria', function () {
        
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

        var bundleoDealInfo
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.bundle100CADP3ALLGROUP.id).then((response)=>{
            console.log(response);
            return bundleoDealInfo = response
        })
        );
        


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P3.id,1,store1.AG1AO1.id,1).then((response)=>{
            console.log(response);
            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', bundleoDealInfo.id);
            cy.assertTaxItem("PG1P3", 1, response.items[0].totalDiscountAmount, response.items[0].appliedTaxes)
            cy.assertTaxItem("AG1AO1", 1, response.items[0].addons[0].totalDiscountAmount, response.items[0].addons[0].appliedTaxes)

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            
            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', bundleoDealInfo.id);
            expect(response.suggestedPromotion[0]).to.have.property('dealType', bundleoDealInfo.dealType);
            cy.assertTaxItem("PG2P3", 1, response.items[1].totalDiscountAmount, response.items[1].appliedTaxes)
            cy.assertTaxItem("AG2AO1", 1, response.items[1].addons[0].totalDiscountAmount, response.items[1].addons[0].appliedTaxes)
        
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P3.id,1,null,null).then((response)=>{
            console.log(response);
            // Check applied Promotion
            expect(response.appliedPromotion[0]).to.have.property('id', bundleoDealInfo.id);
            cy.assertTaxItem("PG3P3", 1, response.items[2].totalDiscountAmount, response.items[2].appliedTaxes)

            // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
        
           }));



        // cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
        //     expect(response).to.have.property('isCartEmpty', true);

        // }));

    });
})
