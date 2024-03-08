describe('006a - Addon Group', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 
    it('Addon Group: should allow you to add a new Addon Group', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');

        // cy.get('[data-cy="side-bar-products"]').click({ force: true });
        // cy.get('[data-cy="side-bar-products.addon-groups"]').click({ force: true });
        cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        cy.get('[data-cy="side-bar-products.addon-groups"]').click();
        
        // Check that you are on Product Groups page
        cy.get('h1').should('contain', 'Add-on Groups');


        // Add a new Location
        cy.get('[data-cy="top-btn-add"]').click();

        // Check that you are on Adding Product Group page
        cy.get('h1').should('contain', 'Add Add-on Group');

        // Validate Addon Group Name has to be input
        cy.get('[data-cy="dlg-addon-group-input-name"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The name should be between 3 - 35 characters long');
        cy.get('[data-cy="dlg-addon-group-input-name"]').type('Soft Drinks');

        cy.get('[data-cy="dlg-addon-group-input-description"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The description should be between 3 - 255 characters long');
        cy.get('[data-cy="dlg-addon-group-input-description"]').type('Coke, Lemonades, Tea, Coffee...');
        cy.get('[data-cy="dlg-addon-group-btn-optional"]').click();

        cy.get('[data-cy="dlg-addon-group-select-image"]').uploadFile('images/softdrink.jpeg', 'image/jpeg').wait(1000);
        cy.get('[data-cy=btn-submit]').click({ force: true });
        //Wait until the image uploaded successfully.
        cy.get('[data-cy^="dlg-addon-group-image"]:last', {timeout:10000});
        cy.get('[data-cy="dlg-addon-group-toggle-btn-status"]').click({ force: true }).wait(1000);

        cy.get('[data-cy=dlg-addon-group-btn-submit]').click({ force: true }).wait(2000);

        cy.contains('Success',{timeout:20000});
        // Go back to Addon Groups screen and validate the newly created Product Group
        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.addon-groups"]').click();

        // Check the last item
        cy.get('[data-cy$=title]:last').should('contain','Soft Drink');
        cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');

        // Edit the info

        cy.get('[data-cy$=btn-edit]:last').click();
        cy.get('[data-cy="dlg-addon-group-input-name"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The name should be between 3 - 35 characters long');
        cy.get('[data-cy="dlg-addon-group-input-name"]').type('Tea and Coffee');

        cy.get('[data-cy="dlg-addon-group-input-description"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The description should be between 3 - 255 characters long');
        cy.get('[data-cy="dlg-addon-group-input-description"]').type('Tea and Coffee');

        cy.get('[data-cy="dlg-addon-group-select-image"]').uploadFile('images/teacoffee.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy=btn-submit]').click({ force: true });

        //Wait until the image uploaded successfully.
        cy.get('[data-cy^="dlg-addon-group-image"]:last', {timeout:10000});

        cy.get('[data-cy="dlg-addon-group-toggle-btn-status"]').click({ force: true }).wait(1000);

        cy.get('[data-cy=dlg-addon-group-btn-submit]').click({ force: true }).wait(2000);
        cy.contains('Success',{timeout:20000});

        // Check the last item
        cy.get('[data-cy$=title]:last').should('contain','Tea and Coffee');
        cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Tea and Coffee');


        // Delete the created AddOn

        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 }).wait(2000);
    });
})

