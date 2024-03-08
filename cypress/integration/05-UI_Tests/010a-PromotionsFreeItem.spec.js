describe('010a - Setup Promotion Free Item', function () 
{
    it('Get Free Item', function()
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
 
        // Select Get a Free Item
        cy.get('[data-cy="list-item-new-promotion-2-btn-next"]').click();
 
        // Name and describe perk
        //cy.get('[data-cy="promotion-name"]').clear({force : true});
        //cy.get('.invalid-feedback').should('contain', 'The name should be between 3 - 35 characters long');
        cy.get('[data-cy="promotion-name"]').clear({force : true}).type('Free Item Automatic Test');

        //cy.get('[data-cy="promotion-description"]').clear({force : true});
        //cy.get('.invalid-feedback').should('contain', 'The name should be between 3 - 35 characters long');
        cy.get('[data-cy="promotion-description"]').clear({force : true}).type('Purchase a certain amount to get a free item.');
 
        // Upload image
        cy.get('[data-cy="promotion-select-image"]').uploadFile('images/lavender.jpg', 'image/jpeg');
        cy.wait(1500);
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

        // Radio button select (Select New clients only)
        cy.get('[data-cy="is-new-client-radio-true"]').check({force:true}).should('be.checked');

        // Limit time and day of week
        cy.get('[data-cy="date-time-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="date-time-limit-btn-availability"]').click();
        cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        cy.get('[data-cy="day-date-time-btn-MON"]').click();
        cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        cy.get('[data-cy="day-date-time-btn-WED"]').click();
        cy.get('[data-cy="day-date-time-btn-THU"]').click();
        cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        cy.wait(1000);
        cy.get('[data-cy="dlg-schedule-btn-submit"]').click();
 
        // Limit Stock
        cy.get('[data-cy="stock-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="promotion-stock-limit-input-num"]').clear({force : true}).type('5');

        // Limit perk time
        cy.get('[data-cy="time-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="time-limit-date-picker-input"]').clear({force : true}).type('07/02/2020 - 07/03/2020');

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //  << ----- Go to next page ----- >>
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        cy.get('.btn').contains('Next').click();

        // Set minimum order price
        cy.get('[data-cy="promotion-min-order-input-num"]').clear({force : true}).type('30.3333')

        // Hide perk
        cy.get('[data-cy="promotion-toggle-btn-hide"]').click();
        
        // Set coupon for perk
        cy.get('[data-cy="promotion-coupon-code-input"]').clear({force : true}).type('ABC123');
        
        // Cart Value for perk
        cy.get('[data-cy="promotion-cart-value-input-num"]').clear({force : true}).type('30.3333');

        // Make Promotion Active
        cy.get('[data-cy="promotion-toggle-btn-status"]').click();
        

        // Save Perk
        cy.get('[data-cy="btn-save"]').click();


        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });

        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Free Item Automatic Test')

        cy.get('[data-cy$=title]:first').should('contain','Free Item Automatic Test');
        cy.get('.v-switch-label:first').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:first').should('contain', 'Purchase a certain amount to get a free item.');

        // Edit and verify the price to be trimmed remaining 2 decimal places.
        
        cy.get('[data-cy="list-item-action-promotion-0-btn-edit"]').click();
        
        cy.get('.btn').contains('Next').click();
        cy.get('.btn').contains('Next').click();
        
        cy.contains('30.33', { timeout: 120000 });

        cy.contains('30.33', { timeout: 120000 });
        
        // Save Perk
        cy.get('[data-cy="btn-save"]').click();

    })

})