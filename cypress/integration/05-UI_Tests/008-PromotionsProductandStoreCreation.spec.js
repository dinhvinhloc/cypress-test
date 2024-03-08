describe('008 - Create Product Group/Product for Promotions', function () {
    it('Create Product Group/Product for Promotions', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');
        
        //-------------------------- Add Product Groups ----------------------

        cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // cy.visit('/app/products/product-groups');
        // Check that you are on Product Groups page
        // cy.get('h1').contains('Product Groups', { timeout: 120000 });
        cy.get('h1').should('contain', 'Product Groups');


        // Add a new Location
        cy.get('[data-cy="top-btn-add"]').click({force: true});

        // Check that you are on Adding Product Group page
        // cy.get('h1').should('contain', 'Add Product Group');
        cy.contains('Add Product Group', { timeout: 120000 });
        // Validate Product Group Name has to be input
        cy.get('[data-cy="dlg-product-group-input-name"]').clear({force : true}).type('Thai dishes');
        cy.get('[data-cy="dlg-product-group-input-description"]').clear({force : true}).type('Guay Teow, Tom Yum Goong, Tom Kha Gai, Som Tam...');

        cy.get('[data-cy="dlg-product-group-select-image"]').uploadFile('images/thaidishes.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
        cy.get('[data-cy^="dlg-product-group-image"]:last',{timeout:10000});
        cy.get('[data-cy="dlg-product-group-toggle-btn-status"]').click({ force: true }).wait(1000);


        cy.get('[data-cy="dlg-product-group-btn-schedule"]').click();

        cy.get('h5').should('contain', 'Select Schedule');

        // Enable Syn and select Sunday
        cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        cy.get('[data-cy="day-date-time-btn-MON"]').click();
        cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        cy.get('[data-cy="day-date-time-btn-WED"]').click();
        cy.get('[data-cy="day-date-time-btn-THU"]').click();
        cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        cy.get('[data-cy="day-date-time-btn-SAT"]').click();

        // Enable open time 
        cy.get('[data-cy="day-date-time-slider-SUN"]').clickVSlider(0.1).clickVSlider(0.8);

        cy.get('[data-cy="dlg-schedule-btn-submit"]').click({ force: true }).wait(1000);
        cy.get('[data-cy="dlg-product-group-btn-submit"]').click({ force: true }).wait(1000);

        // Go back to Product Groups screen and validate the newly created Product Group
        // cy.get('[data-cy="side-bar-products"]').click();
        // cy.get('[data-cy="side-bar-products.product-groups"]').click();

        cy.contains('Success', { timeout: 120000 });
        // Check the last item

        // cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Thai dishes')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Thai dishes');

        // cy.get('[data-cy$=title]:last').should('contain','Thai dishes');
        // cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');
        
        //-------------------------- Add Another Product Groups ----------------------

        // cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        // cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // cy.visit('/app/products/product-groups');
        // Check that you are on Product Groups page
        // cy.get('h1').contains('Product Groups', { timeout: 120000 });
        cy.get('h1').should('contain', 'Product Groups');


        // Add a new Location
        cy.get('[data-cy="top-btn-add"]').click({force: true});

        // Check that you are on Adding Product Group page
        // cy.get('h1').should('contain', 'Add Product Group');
        cy.contains('Add Product Group', { timeout: 120000 });
        // Validate Product Group Name has to be input
        cy.get('[data-cy="dlg-product-group-input-name"]').clear({force : true}).type('Thai deserts');
        cy.get('[data-cy="dlg-product-group-input-description"]').clear({force : true}).type('Thai deserts: Tom Kha Gai...');

        cy.get('[data-cy="dlg-product-group-select-image"]').uploadFile('images/tomkhagai.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
        cy.get('[data-cy^="dlg-product-group-image"]:last',{timeout:10000});
        cy.get('[data-cy="dlg-product-group-toggle-btn-status"]').click({ force: true }).wait(1000);


        cy.get('[data-cy="dlg-product-group-btn-schedule"]').click();

        cy.get('h5').should('contain', 'Select Schedule');

        // Enable Syn and select Sunday
        cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        cy.get('[data-cy="day-date-time-btn-MON"]').click();
        cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        cy.get('[data-cy="day-date-time-btn-WED"]').click();
        cy.get('[data-cy="day-date-time-btn-THU"]').click();
        cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        cy.get('[data-cy="day-date-time-btn-SAT"]').click();

        // Enable open time 
        cy.get('[data-cy="day-date-time-slider-SUN"]').clickVSlider(0.1).clickVSlider(0.8);

        cy.get('[data-cy="dlg-schedule-btn-submit"]').click({ force: true }).wait(1000);
        cy.get('[data-cy="dlg-product-group-btn-submit"]').click({ force: true }).wait(1000);

        // Go back to Product Groups screen and validate the newly created Product Group
        // cy.get('[data-cy="side-bar-products"]').click();
        // cy.get('[data-cy="side-bar-products.product-groups"]').click();

        cy.contains('Success', { timeout: 120000 });

        // cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Thai deserts')

        cy.get('[data-cy$=title]:first', { timeout: 120000 }).should('contain','Thai deserts');

        // Check the last item
        // cy.get('[data-cy$=title]:last').should('contain','Thai deserts', { timeout: 120000 });
        // cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');
        
        //------------------ Add Products -------------------

        cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        cy.get('[data-cy="side-bar-products.products"]').click().wait(1000);

        cy.get('h1').should('contain', 'Products');
        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h1').should('contain', 'Add Product');

        cy.get('[data-cy="dlg-product-input-name"]').clear({force : true});
        cy.get('[data-cy="dlg-product-input-name"]').type('Tom Yum Goong');

        cy.get('[data-cy="dlg-product-input-description"]').clear({force : true});
        cy.get('[data-cy="dlg-product-input-description"]').type('The best Tom Yum Goong in town, cooked with fresh ingredients from Thailand');

        cy.get('[data-cy="dlg-product-input-price"]').clear({force : true}).type('14.99');

        cy.get('[data-cy="dlg-product-select-product-group-input"]').click({force:true}).type('Thai dishes{enter}');

        cy.get('[data-cy="dlg-product-input-unit"]').type('10');
        // cy.get('[data-cy^=dlg-product-checkbox-store]:last').click();
        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Choose Stores'
            if ($body.text().includes('Choose Stores')) {
                // yup found it
                cy.get('[data-cy^=dlg-product-checkbox-store]:first').click();
            }
        })

        cy.get('[data-cy="dlg-product-select-image"]').uploadFile('images/tomyumgoong.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
                // Wait until image is uploaded
                cy.get('[data-cy^="dlg-product-image"]:last',{timeout:20000});

        cy.get('[data-cy="dlg-product-toggle-btn-status"]').click().wait(1000);
        cy.get('.vs__search:eq(3)').click({force:true}).type('Food{enter}');
        cy.get('.vs__search:eq(4)').click({force:true}).type('Size{enter}');

        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);

        //------------------- Verifications ----------------

        cy.contains('Products', { timeout: 120000 });
        
        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').type('Tom Yum')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Tom Yum Goong');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'The best Tom Yum Goong in town');

        cy.get('.badge:eq(0)').should('contain','Food');
        cy.get('.badge:eq(1)').should('contain','Thai dishes');
        // cy.get('.badge:eq(2)').should('contain','Arroy Thai Restaurant');

        
                
        //------------------ Add Another Product -------------------

        // cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        // cy.get('[data-cy="side-bar-products.products"]').click().wait(1000);

        cy.get('h1').should('contain', 'Products');
        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h1').should('contain', 'Add Product');

        cy.get('[data-cy="dlg-product-input-name"]').clear({force : true});
        cy.get('[data-cy="dlg-product-input-name"]').type('Som Tam');

        cy.get('[data-cy="dlg-product-input-description"]').clear({force : true});
        cy.get('[data-cy="dlg-product-input-description"]').type('The best Som Tam in town, cooked with fresh ingredients from Thailand');

        cy.get('[data-cy="dlg-product-input-price"]').clear({force : true}).type('14.99');

        cy.get('[data-cy="dlg-product-select-product-group-input"]').click({force:true}).type('deserts{enter}');

        cy.get('[data-cy="dlg-product-input-unit"]').type('10');
        // cy.get('[data-cy^=dlg-product-checkbox-store]:last').click();
        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Choose Stores'
            if ($body.text().includes('Choose Stores')) {
                // yup found it
                cy.get('[data-cy^=dlg-product-checkbox-store]:first').click();
            }
        })

        cy.get('[data-cy="dlg-product-select-image"]').uploadFile('images/somtam.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
                // Wait until image is uploaded
                cy.get('[data-cy^="dlg-product-image"]:last',{timeout:20000});

        cy.get('[data-cy="dlg-product-toggle-btn-status"]').click().wait(1000);
        cy.get('.vs__search:eq(3)').click({force:true}).type('Food{enter}');
        cy.get('.vs__search:eq(4)').click({force:true}).type('Size{enter}');

        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);

        //------------------- Verifications ----------------

        cy.contains('Products', { timeout: 120000 });
        
        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Som Tam')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Som Tam');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'The best Som Tam in town');

        cy.get('.badge:eq(0)').should('contain','Food');
        cy.get('.badge:eq(1)').should('contain','Thai deserts');
        // cy.get('.badge:eq(2)').should('contain','Arroy Thai Restaurant');


    });
})

