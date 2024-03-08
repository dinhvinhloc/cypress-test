describe('017g - Edit Promotion - Percentage off of Cart', function () 
{
    it('Percentage off of Cart', function()
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
        cy.get('[data-cy="side-bar-promotions.promotions-main"]').click().wait(2000);
        //cy.get('a[href*="/app/promotions/promotions-main"]').click();

        // Search for specific perk
        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Percent Discount on Cart');
        cy.get('[data-cy$=title]:first').should('contain','Percent Discount on Cart');
        cy.wait(1000);
        //cy.get('[data-cy="top-input-search"]').clear({force : true});

        // Make Inactive then reactive
        cy.get('[data-cy$=toggle-btn-status]:first').click();
        cy.get('.v-switch-label:first').should('contain','INACTIVE');
        cy.wait(1000);

        cy.get('[data-cy$=toggle-btn-status]:first').click();
        cy.get('.v-switch-label:first').should('contain','ACTIVE');
        cy.wait(1000);

        //------------------- Edit Perk ----------------

        cy.get('[data-cy$=btn-edit]:first').click();

        // Edit name and perk description
        cy.get('[data-cy="promotion-name"]').clear({force : true}).type('% Discount on Cart Edit');
        cy.get('[data-cy="promotion-description"]').clear({force : true}).type('Edit');

        // Add new image
        cy.get('[data-cy="promotion-select-image"]').uploadFile('images/chamomile.jpg', 'image/jpeg');
        cy.wait(1500);
        cy.get('[data-cy="btn-submit"]').click({force:true});
        cy.get('[data-cy^="promotion-image"]:last',{timeout:10000})

        // Change Store that offers promotion
        // cy.get('[data-cy="promotion-checkbox-store-1"]').uncheck({force:false}).should('not.be.checked');
        // cy.get('[data-cy="promotion-checkbox-store-2"]').check({force:true}).should('be.checked');
        // cy.wait(2000);

        cy.get('.btn').contains('Next').click().wait(2000);

        // Save Perk
        cy.get('[data-cy="btn-save"]').click();

        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });

        // Search for edited perk
        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('% Discount on Cart Edit');
        cy.wait(1000);

        cy.get('.v-switch-label:first').should('contain','ACTIVE');

        // Check new name
        cy.get('[data-cy$=title]:first').should('contain','% Discount on Cart Edit');

        // Check new description
        cy.get('.mb-1.text-muted:first').should('contain', 'Edit');
        cy.wait(1500);

        //------------------- Delete ----------------

        cy.get('[data-cy$=btn-delete]:first').click();
        cy.wait(1500);
        cy.get('[data-cy="dlg-alert-btn-ok"]').click({force:true});

        // Verify delete
        cy.contains('Success', { timeout: 120000 });
        
    })

})