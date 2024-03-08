describe('000 - Login End User to merchant web', function () {
    it('should not allow end user to login merchant web', function () {
        
        // Getting username and password from cypress.json
        const username = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.visit('/')
        cy.get('input[type="text"]').type(username)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.contains('Bad credentials', { timeout: 120000 });
        // cy.get('h3').should('contain', 'Connect your account to Stripe');


        //Sign Out
        // cy.get('.dropdown-item:eq(1)').click();

    });
})

