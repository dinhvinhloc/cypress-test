describe('008a - Setup Promotion - Punch Card', function () 
{
    it('Punch Card Promotion', function()
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

        // Select Punch Card promotion
        cy.get('[data-cy="list-item-new-promotion-0-btn-next"]').click();

        // Name and describe perk
        cy.get('[data-cy="promotion-name"]').clear({force : true}).type('Punch Card Automatic Test');
        cy.get('[data-cy="promotion-description"]').clear({force : true}).type('Get a set number of punches for something.');

        // Upload image for Punch Card
        cy.get('[data-cy="promotion-select-image"]').uploadFile('images/lavender.jpg', 'image/jpeg');
        cy.wait(1500);
        cy.get('[data-cy="btn-submit"]').click({force:true});
        cy.get('[data-cy^="promotion-image"]:last',{timeout:10000})

        // Select what stores will use punch Card

        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Choose Stores'
            if ($body.text().includes('Choose Stores')) {
                // yup found it
                cy.get('[data-cy^=promotion-checkbox-store]:first').click();
            }
        })  

        // cy.get('[data-cy="promotion-checkbox-store-1"]').check({force:true}).should('be.checked');
        //cy.get('[data-cy="promotion-checkbox-store-2"]').check({force:true}).should('be.checked');
        //cy.get('[data-cy="promotion-checkbox-store-3"]').check({force:true}).should('be.checked');
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //  << ----- Go to next page ----- >>
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        cy.get('.btn').contains('Next').click();

        // Select eligible items from drop down
        cy.get('[data-cy="promotion-products-required-tree-select"]').click();
        cy.get('[data-cy^="promotion-products-required-tree-select-selectable-item"]:first').click();

        // Select number of punchs required
        cy.get('[data-cy="promotion-num-punches-input-num"]').clear({force : true}).type('3');

        // Choose reward items
        cy.get('[data-cy="promotion-products-reward-tree-select"]').click();
        cy.get('[data-cy^="promotion-products-reward-tree-select-selectable-item"]:first').click();

        // Limit reward time
        cy.get('[data-cy="time-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="time-limit-date-picker-input"]').clear({force : true}).type('07/02/2020 - 07/03/2020');

        // Select number of rewards
        cy.get('[data-cy="promotion-num-rewards-input-num"]').clear({force : true}).type('1');
        
        // Give away more points
        cy.get('[data-cy="promotion-points-toggle-btn-check"]').click();
        cy.get('[data-cy="promotion-points-input-num"]').clear({force : true}).type('100');

        // Make Promotion Active
        cy.get('[data-cy="promotion-toggle-btn-status"]').click();

        // Save Perk
        cy.get('[data-cy="btn-save"]').click();

        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });

        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Punch Card Automatic Test')

        cy.get('[data-cy$=title]:first').should('contain','Punch Card Automatic Test');
        cy.get('.v-switch-label:first').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:first').should('contain', 'Get a set number of punches for something.');
        
    })

})