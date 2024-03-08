describe('API012b - Count cart items, Get the finalized cart', function () {
    it('Business Category: should allow end-user Count cart items, Get the finalized cart', function () {
        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));
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

        cy.waitUntil(() => cy.getCart(store1.storeID.id).then((response)=>{
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 10);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);
            expect(response.items[1]).to.have.property('productId', store1.PG2P1.id);
            expect(response.items[1]).to.have.property('quantity', 10);
            expect(response.items[1].addons[0]).to.have.property('productId', store1.AG2AO1.id);
            expect(response.items[1].addons[0]).to.have.property('quantity', 1);
            console.log(response);
        }));

        cy.waitUntil(() => cy.countCartItems(store1.storeID.id).then((response)=>{
            // expect(response).to.have.property('isCartEmpty', true);
            expect(response).to.have.property('body', 2);
            console.log(response);
        }));

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            // expect(response).to.have.property('status', 200);

        }));

    });
})
