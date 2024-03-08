describe('000 - Login', function () {
    it('should allow you to login via web interface', function () {
        
        // Getting username and password from cypress.json
        const username = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        cy.visit('/')
        cy.get('input[type="text"]').type(username)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.get('h3').should('contain', 'Connect your account to Stripe');


        //Sign Out
        cy.get('.dropdown-item:eq(1)').click();

    });
})

