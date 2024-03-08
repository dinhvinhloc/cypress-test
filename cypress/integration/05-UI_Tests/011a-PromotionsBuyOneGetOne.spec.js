describe('011a - Setup Promotions - Buy One get One Free', function () 
{
    it('Buy One get One', function()
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
 
        // Select Buy one get one Free perk
        cy.get('[data-cy="list-item-new-promotion-3-btn-next"]').click();
 
        // Name and describe perk
        cy.get('[data-cy="promotion-name"]').clear({force : true}).type('Buy one Get one Free');
        cy.get('[data-cy="promotion-description"]').clear({force : true}).type('Buy one get another free.');
 
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

        // Input required number of items
        cy.get('[data-cy="promotion-products-required-input-num"]').clear({force : true}).type('3');
 
        // Select eligible items from drop down
        cy.get('[data-cy="promotion-products-reward-tree-select"]').click();
        cy.get('[data-cy^="promotion-products-reward-tree-select-selectable-item"]:first').click();

        // Input number of rewards
        cy.get('[data-cy="promotion-products-reward-input-num"]').clear({force : true}).type('3');

        // Select eligible items from drop down
        cy.get('[data-cy="promotion-products-required-tree-select"]').click();
        cy.get('[data-cy^="promotion-products-required-tree-select-selectable-item"]:last').click();

        // Radio button select (Select returning clients only)
        cy.get('[data-cy="is-new-client-radio-false"]').check({force:true}).should('be.checked');

        // Radio button select (Select Master Perk)
        cy.get('[data-cy="is-master-radio-true"]').check({force:true}).should('be.checked');

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //  << ----- Go to next page ----- >>
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        cy.get('.btn').contains('Next').click();

        // Minimum Order amount
        cy.get('[data-cy="promotion-min-order-input-num"]').clear({force : true}).type('30');

        // Highlight More about perk
        cy.get('[data-cy="promotion-highlight-radio-true"]').check({force:true}).should('be.checked');
        cy.get('[data-cy="promotion-highlight-radio-reward"]').check({force:true}).should('be.checked');


        // Hide perk
        cy.get('[data-cy="promotion-toggle-btn-hide"]').click();
        
        // Set coupon code
        cy.get('[data-cy="promotion-coupon-code-input"]').clear({force : true}).type('456EFG');

        // Limit perk time
        cy.get('[data-cy="time-limit-toggle-btn-check"]').click();
        cy.get('[data-cy="time-limit-date-picker-input"]').clear({force : true}).type('07/02/2020 - 07/03/2020');
 
        // Make Promotion Active
        cy.get('[data-cy="promotion-toggle-btn-status"]').click();

        // Limit day and time
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

        // Save Perk
        cy.get('[data-cy="btn-save"]').click();

        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });

        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Buy one Get one Free')

        cy.get('[data-cy$=title]:first').should('contain','Buy one Get one Free');
        cy.get('.v-switch-label:first').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:first').should('contain', 'Buy one get another free.');

    })

})