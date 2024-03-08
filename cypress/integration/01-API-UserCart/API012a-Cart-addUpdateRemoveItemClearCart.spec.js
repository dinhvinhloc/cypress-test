describe('API012a - Add/Update/Remove/Clear Item into the cart', function () {
    it('Business Category: should allow end-user to Add/Update/Remove/Clear Cart Items', function () {
        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1
        

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
            console.log(store1)
        }));

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,1,store1.AG1AO1.id,1).then((response)=>{
            console.log(response);
        }));

        cy.waitUntil(() => cy.updateItemInCart(1,store1.storeID.id,store1.PG1P1.id,10,store1.AG1AO1.id,3).then((response)=>{
            console.log(response);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P1.id,10,store1.AG2AO1.id,3).then((response)=>{
            console.log(response);
        }));

        cy.waitUntil(() => cy.removeItemFromCart(store1.storeID.id,1).then((response)=>{
            // expect(response).to.have.property('isCartEmpty', true);
            console.log(response);
        }));

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

    });
})
