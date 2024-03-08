describe('005b - Product Listing', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 
    
    it('Products: should allow you to: List Products, copy, edit, filter, Order By, Category, Group', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');
        //------------------ Create Product Group and Product -------------------------
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
        cy.get('[data-cy^="dlg-product-group-image"]:last',{timeout:20000})

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
        cy.contains('Success', { timeout: 120000 });
        // Check the last item
        cy.get('[data-cy$=title]:last').should('contain','Thai dishes');
        cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Guay Teow, Tom Yum Goong, Tom Kha Gai, Som Tam');
        
        //------------------ Add Products -------------------

        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.products"]').click().wait(1000);

        cy.get('h1').should('contain', 'Products');
        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h1').should('contain', 'Add Product');

        cy.get('[data-cy="dlg-product-input-name"]').clear({force : true});
        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="dlg-product-input-name"]').type('Tom Yum Goong');

        cy.get('[data-cy="dlg-product-input-description"]').clear({force : true});
        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="dlg-product-input-description"]').type('The best Tom Yum Goong in town, cooked with fresh ingredients from Thailand');

        cy.get('[data-cy="dlg-product-input-price"]').type('14.99');

        cy.get('[data-cy="dlg-product-select-product-group-input"]').click({force:true}).type('Thai{enter}');

        cy.get('[data-cy="dlg-product-input-unit"]').type('10');
        
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

        //------------------ Check that there is a Product in the list -------------------

        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.products"]').click().wait(1000);
        cy.contains('Products', { timeout: 120000 });
        cy.get('h1').should('contain', 'Products');
        // cy.get('[data-cy="top-input-search"]').type('Tom Yum')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Tom Yum Goong');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'The best Tom Yum Goong in town');

        //--------------------- Copy Product ----------------

        cy.get('[data-cy$=btn-duplicate]:last').click();
        cy.get('h1').should('contain', 'Add Product');

        cy.get('[data-cy="dlg-product-checkbox-store-1"]').click().click();


        // cy.its('[data-cy="dlg-product-input-name"]').should('contain','Tom Yum Goong_copy');
        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);

        // cy.contains('There is no change, Do you want to submit it anyway?');
        // cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Products', { timeout: 120000 });
        cy.get('h1').should('contain', 'Products');
        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Tom Yum')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','_copy');
        cy.get('.v-switch-label:last').should('contain','ACTIVE');

        //--------------------- Edit Product -------------


        cy.get('[data-cy$=btn-edit]:last').click();
        cy.get('h1').should('contain', 'Edit Product');

        cy.get('[data-cy="dlg-product-input-name"]').clear({force : true}).type('Som Tam');
        cy.get('[data-cy="dlg-product-input-description"]').clear({force : true}).type('Original Flavored Thai Som Tam');
        cy.get('[data-cy="dlg-product-input-price"]').clear({force : true}).type('9.99');
        cy.get('[data-cy="dlg-product-select-product-group-input"]').click({force:true}).type('Thai{enter}');
        cy.get('[data-cy="dlg-product-input-unit"]').clear({force : true}).type('5');


        // cy.get('body').then(($body) => {
        //     // synchronously ask for the body's text
        //     // Check if the page has 'Choose Stores'
        //     if ($body.text().includes('Choose Stores')) {
        //         // yup found it
        //         cy.get('[data-cy^=dlg-product-checkbox-store]:last').click();
        //     }
        // })            
        
        cy.get('[data-cy="dlg-product-select-image"]').uploadFile('images/somtam.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
        // Wait until image is uploaded
        cy.get('[data-cy^="dlg-product-image"]:last',{timeout:20000});
        cy.get('[data-cy="dlg-product-toggle-btn-status"]').click().wait(1000);
        cy.get('.vs__search:eq(3)').click({force:true}).type('Restaurant{enter}');
        cy.get('.vs__search:eq(4)').click({force:true}).type('Calories{enter}');

        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);

        cy.contains('Success', { timeout: 120000 });

        //------------------- Verifications ----------------

        cy.contains('Products', { timeout: 120000 });
        
        //--------- Filter out all other products
        cy.get('[data-cy="top-input-search"]').clear({force : true}).type('Som Tam')

        cy.get('[data-cy$=title]:last', { timeout: 120000 }).should('contain','Som Tam');
        cy.get('.v-switch-label:last').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Original Flavored Thai Som Tam');

        //---------- Filter by Store ----------

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



        cy.get('[data-cy$=title]', { timeout: 120000 }).should('contain','Tom Yum Goong');
        cy.get('.v-switch-label').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted').should('contain', 'The best Tom Yum Goong in town');

        cy.get('[data-cy$=title]', { timeout: 120000 }).should('contain','Som Tam');
        cy.get('.v-switch-label').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted').should('contain', 'Original Flavored Thai Som Tam');

        //---------- Order By Name ------------
        cy.get('[data-cy="top-dropdown-orderby"]').click();
        cy.get('[data-cy^=top-dropdown-orderby-item]:first').click();

        cy.get('[data-cy$=title]', { timeout: 120000 }).should('contain','Som Tam');
        cy.get('.v-switch-label').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted').should('contain', 'Original Flavored Thai Som Tam');

        cy.get('[data-cy$=title]', { timeout: 120000 }).should('contain','Tom Yum Goong');
        cy.get('.v-switch-label').should('contain','ACTIVE');
        cy.get('.mb-1.text-muted').should('contain', 'The best Tom Yum Goong in town');

        //---------- Filter By Category -----------
        cy.get('[data-cy="top-dropdown-category"]').click();
        cy.get('[data-cy^=top-dropdown-category-item]').filter((index, el) => el.innerText === "Food").click();

        cy.get('[data-cy$=title]', { timeout: 120000 }).should('contain','Som Tam');
        cy.get('.v-switch-label').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted').should('contain', 'Original Flavored Thai Som Tam');

        //------------- Delete test data
        cy.get('[data-cy="top-dropdown-category"]').click();
        cy.get('[data-cy^=top-dropdown-category-item-0]').click();

        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 20000 });

        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 20000 });

        //Delete the added Product Group
        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // cy.get('[data-cy="top-input-search"]').type('Thai dishes');
        cy.get('[data-cy=draggable-list-item-product-group-0-btn-delete]').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 20000 }).wait(2000);


    });
})

