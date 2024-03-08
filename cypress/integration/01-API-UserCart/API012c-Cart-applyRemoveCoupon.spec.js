describe('API012c - Apply/Remove Coupon', function () {
    it('Business Category: should allow end-user to Apply/Remove Coupon', function () {
        
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
        cy.waitUntil(() => cy.getPromotionByID(store1.hiddenDiscount20CAD.id).then((response)=>{
            // expect(response).to.have.property('isCartEmpty', true);
            console.log(response);
            return deal = response
        }));
        
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG1AO1.id,1).then((response)=>{
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 10);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);
            console.log(response);

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P1.id,10,store1.AG2AO1.id,1).then((response)=>{
            expect(response.items[1]).to.have.property('productId', store1.PG2P1.id);
            expect(response.items[1]).to.have.property('quantity', 10);
            expect(response.items[1].addons[0]).to.have.property('productId', store1.AG2AO1.id);
            expect(response.items[1].addons[0]).to.have.property('quantity', 1);
            console.log(response);
        }));

        cy.waitUntil(() => cy.addCoupon(store1.storeID.id, deal.couponCode).then((response)=>{
            expect(response.couponPromotion[deal.couponCode]).to.have.property('id', deal.id);
            console.log(response);
        }));

        cy.waitUntil(() => cy.removeCoupon(store1.storeID.id, deal.couponCode).then((response)=>{
            console.log(response);
            expect(response.couponPromotion).to.empty;
        }));


        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

    });
})
