describe('007b - Addons Listing', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 
    it('Addon: should allow you to view and filter, sort the Addons on Addons screen', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');

        //---------------- Add an AddOn Group -----------------
        cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        cy.get('[data-cy="side-bar-products.addon-groups"]').click();

        // Check that you are on Product Groups page
        cy.get('h1').should('contain', 'Add-on Groups');


        // Add a new AddOn Group
        cy.get('[data-cy="top-btn-add"]').click();

        // Check that you are on Adding Product Group page
        cy.get('h1').should('contain', 'Add Add-on Group');

        // Validate Addon Group Name has to be input
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

        
        //------------------ Add a new Addon -------------------

        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.addons"]').click().wait(1000);

        cy.get('h1').should('contain', 'Add-ons');
        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h1').should('contain', 'Add Add-on');

        cy.get('[data-cy="dlg-addon-input-name"]').clear({force : true}).type('Tea');
        cy.get('[data-cy="dlg-addon-input-description"]').clear({force : true}).type('Lipton Ice Tea');
        cy.get('[data-cy="dlg-addon-input-price"]').clear({force : true}).type('0.99');

        cy.get('[data-cy="dlg-addon-select-addon-group-input"]').click({force:true}).type('Tea{enter}');

        // cy.get('[data-cy="dlg-addon-input-unit"]').type('10');
        // cy.get('[data-cy^=dlg-addon-checkbox-store]:first').click();
        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Choose Stores'
            if ($body.text().includes('Choose Stores')) {
                // yup found it
                cy.get('[data-cy^=dlg-addon-checkbox-store]:first').click();
            }
        }) 

        cy.get('[data-cy="dlg-addon-select-image"]').uploadFile('images/teacoffee.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
        cy.get('[data-cy^="dlg-addon-image"]:last',{timeout: 10000});

        cy.get('[data-cy="dlg-addon-toggle-btn-status"]').click().wait(1000);
        cy.get('[data-cy="dlg-addon-select-attribute-input"]').click({force:true}).type('Ingredients{enter}');

        cy.get('[data-cy="dlg-addon-btn-submit"]').click({ force: true }).wait(2000);

        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });
        
        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Tea');

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Tea');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Lipton Ice Tea');

        cy.get('.badge').should('contain','Tea and Coffee');
        
        //--------- Filter by Store
        cy.get('[data-cy="top-input-search"]').clear({force : true});

        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Store'
            if ($body.text().includes('Store')) {
                // yup found it
                cy.get('[data-cy="top-dropdown-store"]').click();
                cy.get('[data-cy^=top-dropdown-store-item]:first').click();
            }
        })  
        // cy.get('[data-cy="top-dropdown-store"]').click();
        // cy.get('[data-cy="top-dropdown-store-item-1"]').click();

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Tea');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Lipton Ice Tea');

        cy.get('.badge').should('contain','Tea and Coffee');

        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Store'
            if ($body.text().includes('Store')) {
                // yup found it
                cy.get('[data-cy="top-dropdown-store"]').click();
                cy.get('[data-cy^=top-dropdown-store-item]:first').click();
            }
        })  

        // cy.get('[data-cy="top-dropdown-store"]').click();
        // cy.get('[data-cy="top-dropdown-store-item-0"]').click();

        //--------- Order By

        cy.get('[data-cy="top-dropdown-orderby"]').click();
        cy.get('[data-cy^="top-dropdown-orderby-item"]:last').click();

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Tea');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Lipton Ice Tea');

        //--------- Addon Group
        cy.get('[data-cy="top-dropdown-addon-group"]').click();
        cy.get('[data-cy^="top-dropdown-addon-group-item"]:last').click();

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Tea');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Tea');

        cy.get('[data-cy="top-dropdown-addon-group"]').click();
        cy.get('[data-cy^="top-dropdown-addon-group-item"]:first').click();
        
        //--------- Duplicate an Addon

        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Tea');
        cy.get('[data-cy$=btn-duplicate]:last').click();
        cy.get('[data-cy="dlg-addon-checkbox-store-1"]').click().click();
        
        cy.get('[data-cy="dlg-addon-btn-submit"]').click({ force: true }).wait(2000);

        // cy.contains('There is no change, Do you want to submit it anyway?');
        // cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 120000 });

        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('_copy');
        cy.get('[data-cy$=btn-edit]:eq(1)').click();

        cy.get('[data-cy="dlg-addon-input-name"]').clear({force : true}).type('Mojito');
        cy.get('[data-cy="dlg-addon-input-description"]').clear({force : true}).type('Traditional Cuban highball, contains white rum, sugar, juice, ...');
        cy.get('[data-cy="dlg-addon-input-price"]').clear({force : true}).type('9.99');

        cy.get('[data-cy="dlg-addon-select-image"]').uploadFile('images/mojito.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });

        cy.get('[data-cy^="dlg-addon-image"]:last',{timeout: 20000});

        cy.get('[data-cy="dlg-addon-select-attribute-input"]').click({force:true}).type('Calories{enter}');
        cy.get('[data-cy="dlg-addon-btn-submit"]').click({ force: true });
        cy.contains('Success', { timeout: 20000 });

        
        //------- Check clone item
        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Mojito');

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Mojito');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');

        //------- Delete the 1st addon

        cy.get('[data-cy$=btn-delete]:last').click();
        cy.contains(validations.alert.delete);
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 20000 }).wait(1000);

        cy.get('[data-cy="top-input-search"]').clear({force : true});

        cy.get('[data-cy$=title]', { timeout: 120000 }).should('not.contain','Mojito');
        //------- Delete the 2nd addon

        cy.get('[data-cy$=btn-delete]:last').click();
        cy.contains(validations.alert.delete);
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 20000 }).wait(1000);

        // cy.get('[data-cy="top-input-search"]').clear({force : true});

        // cy.get('[data-cy$=title]', { timeout: 120000 }).should('not.contain','Tea');

        //-------- Delete the AddOn Group


        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.addon-groups"]').click();

        cy.get('[data-cy="top-input-search"]').type('Tea');

        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 });

    });
})

