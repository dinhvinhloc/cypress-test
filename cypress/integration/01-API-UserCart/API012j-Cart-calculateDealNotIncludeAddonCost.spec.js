describe('API012j - Promotion eligibility Calculation to exclude Addon amount ', function () {
    it('Check that the applying of Promotions is solely based on Products Amount', function () {
        
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
        cy.getPromotionByID(store1.dis20CADONCART200CAD.id).then((response)=>{
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

        // Add 2 PG3P5 to the cart + 11 Addon the Total will exceed the requireAmount of the Deal
        // Expect the Deal to not applied.
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P5.id,2,store1.AG3AO2.id,11).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion).to.be.an('array').that.is.empty;
            expect(response).to.have.property('discountAmount', 0);
            // expect(response).to.have.property('totalAmount', (response.subA/mount-response.discountAmount)*response.hst+(response.subAmount-response.discountAmount));

        }));

        // Update the cart to add 3 more PG3P5
        // This makes up of the cart to be eligible for 2 deals:
        // 1.) Discount $20 on cart when exceed $200
        // 2.) Discount 10% on cart ($350 * 10% = $35)
        // Expect discount to be $55
        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,5,store1.AG3AO2.id,11).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', bundleoDealInfo.id);  
            expect(response).to.have.property('discountAmount', 55.045);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));

        // Update the cart back to 2 x PG3P5
        // Expect no discount is applied
        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG3P5.id,2,store1.AG3AO2.id,11).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion).to.be.an('array').that.is.empty;
            expect(response).to.have.property('discountAmount', 0);
            // expect(response).to.have.property('totalAmount', (response.subA/mount-response.discountAmount)*response.hst+(response.subAmount-response.discountAmount));
        }));

    });
})
