describe('017 - Search Perk Promotions Listing page', function () 
{
    it('Search Listing', function()
    {
        // Login
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');

        // Select Your Perks from side bar
        cy.get('ul.list-unstyled > li:eq(3)').click();
        cy.get('[data-cy="side-bar-promotions.promotions-main"]').click();

        // Change Listing order by
        cy.get('[data-cy="top-dropdown-orderby"]').click();
        cy.get('[data-cy^="top-dropdown-orderby-item-0"]').click();
        cy.wait(2000);

        cy.get('[data-cy="top-dropdown-orderby"]').click();
        cy.get('[data-cy^="top-dropdown-orderby-item-1"]').click();
        cy.wait(2000);

        // Sort by store

        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Store'
            if ($body.text().includes('Store')) {
                // yup found it
                cy.get('[data-cy="top-dropdown-store"]').click();
                cy.get('[data-cy^=top-dropdown-store-item]:last').click();
                cy.wait(2000);

            }
        })  

        // cy.get('[data-cy="top-dropdown-store"]').click();
        // cy.get('[data-cy^="top-dropdown-store-item-1"]:last').click();
        // cy.wait(2000);

        // Sort by type
        cy.get('[data-cy="top-dropdown-promotion-list"]').click();
        cy.get('[data-cy^="top-dropdown-promotion-list-item-1"]').click();
        cy.wait(2000);

        cy.get('[data-cy="top-dropdown-promotion-list"]').click();
        cy.get('[data-cy^="top-dropdown-promotion-list-item-2"]').click();
        cy.wait(2000);

        cy.get('[data-cy="top-dropdown-promotion-list"]').click();
        cy.get('[data-cy^="top-dropdown-promotion-list-item-3"]').click();
        cy.wait(2000);

        cy.get('[data-cy="top-dropdown-promotion-list"]').click();
        cy.get('[data-cy^="top-dropdown-promotion-list-item-0"]').click();
        cy.wait(2000);

    })

})