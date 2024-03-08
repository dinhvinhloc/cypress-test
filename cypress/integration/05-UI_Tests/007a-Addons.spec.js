describe('007a - Add Addons', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 
    
    it('Addon: should allow you to add a new Addon', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');


        //------------------ Add an AddOn Group -------------
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
        cy.get('[data-cy=dlg-addon-group-btn-submit]').click({ force: true });
        cy.contains('Success',{timeout:20000});
        //------------------ Add an Addon -------------------

        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.addons"]').click().wait(1000);

        cy.get('h1').should('contain', 'Add-ons');
        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h1').should('contain', 'Add Add-on');

        cy.get('[data-cy="dlg-addon-input-name"]').clear({force : true});
        cy.get('[data-cy="dlg-addon-btn-submit"]').click({ force: true });
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="dlg-addon-input-name"]').type('Coke');

        cy.get('[data-cy="dlg-addon-input-description"]').clear({force : true});
        cy.get('[data-cy="dlg-addon-btn-submit"]').click({ force: true });
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="dlg-addon-input-description"]').type('Original Coke');

        cy.get('[data-cy="dlg-addon-input-price"]').clear({force : true}).type('0.99999');

        cy.get('[data-cy="dlg-addon-select-addon-group-input"]').click({force:true}).type('Soft{enter}');

        // cy.get('[data-cy="dlg-addon-input-unit"]').type('10');
        // cy.get('[data-cy^=dlg-addon-checkbox-store]:last').click();
        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Choose Stores'
            if ($body.text().includes('Choose Stores')) {
                // yup found it
                cy.get('[data-cy^=dlg-addon-checkbox-store]:first').click();
            }
        }) 
        cy.get('[data-cy="dlg-addon-select-image"]').uploadFile('images/coke.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });

        cy.get('[data-cy^="dlg-addon-image"]:last',{timeout: 10000});

        cy.get('[data-cy="dlg-addon-toggle-btn-status"]').click().wait(1000);
        cy.get('[data-cy="dlg-addon-select-attribute-input"]').click({force:true}).type('Calories{enter}');

        cy.get('[data-cy="dlg-addon-btn-submit"]').click({ force: true }).wait(2000);

        //------------------- Verifications ----------------

        cy.contains('Success', { timeout: 120000 });
        
        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Coke')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Coke');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Original Coke');

        cy.get('.badge').should('contain','Soft Drinks');
        cy.get('[data-cy$=-price]:last').should('contain','$0.99');

        // cy.get('.badge').should('contain','Arroy Thai Restaurant');
        //------------ Delete
        cy.get('[data-cy="top-input-search"]').clear({force : true});

        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 });

        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.addon-groups"]').click();

        cy.get('[data-cy="top-input-search"]').type('Soft');

        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 });

    });
})

