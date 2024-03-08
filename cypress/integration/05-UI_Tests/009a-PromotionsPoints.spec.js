describe('009a - Setup Promotion Point Perks', function () 
{
    it('Point Perks Promotion', function()
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

        // Select Make a New Perk from side bar
        cy.get('ul.list-unstyled > li:eq(3)').click();
        cy.get('a[href*="/app/promotions/new-perk"]').click();

        // Select Point Perk
        cy.get('[data-cy="list-item-new-promotion-1-btn-next"]').click();

        // Name and describe perk
        cy.get('[data-cy="promotion-name"]').clear({force : true}).type('Point Perk Automatic Test');
        cy.get('[data-cy="promotion-description"]').clear({force : true}).type('Collect points to redeem later.');

        // Upload image
        cy.get('[data-cy="promotion-select-image"]').uploadFile('images/lavender.jpg', 'image/jpeg');
        cy.wait(2000);
        cy.get('[data-cy="btn-submit"]').click({force:true});
        cy.get('[data-cy^="promotion-image"]:last',{timeout:10000})

        // Select what stores will have Point Perk
        // cy.get('[data-cy="promotion-checkbox-store-1"]').check({force:true}).should('be.checked');
        //cy.get('[data-cy="promotion-checkbox-store-2"]').check({force:true}).should('be.checked');
        //cy.get('[data-cy="promotion-checkbox-store-3"]').check({force:true}).should('be.checked');
        
        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Choose Stores'
            if ($body.text().includes('Choose Stores')) {
                // yup found it
                cy.get('[data-cy^=promotion-checkbox-store]:first').click();
            }
        })  

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //  << ----- Go to next page ----- >>
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        cy.get('.btn').contains('Next').click();

        // Select eligible items from drop down
        cy.get('[data-cy="promotion-products-tree-select"]').click();
        cy.get('[data-cy^="promotion-products-tree-select-selectable-item"]:first').click();

        // Limit perk time
        cy.get('[data-cy="time-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="time-limit-date-picker-input"]').clear({force : true}).type('07/02/2020 - 07/03/2020');

        // Choose point reward amount
        cy.get('[data-cy="promotion-points-input-num"]').clear({force : true}).type('200');

        // Make Promotion Active
        cy.get('[data-cy="promotion-toggle-btn-status"]').click();

        // Limit Stock
        cy.get('[data-cy="stock-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="promotion-stock-limit-input-num"]').clear({force : true}).type('5');

        // Radio button select (Select New clients only)
        cy.get('[data-cy="is-new-client-radio-true"]').check({force:true}).should('be.checked');

        // Make perk exclusive
        cy.get('[data-cy="is-master-radio-false"]').check({force:true}).should('be.checked');

        // Save Perk
        cy.get('[data-cy="btn-save"]').click();

        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });

        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Point Perk Automatic Test')

        cy.get('[data-cy$=title]:first').should('contain','Point Perk Automatic Test');
        cy.get('.v-switch-label:first').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:first').should('contain', 'Collect points to redeem later.');

    })

})