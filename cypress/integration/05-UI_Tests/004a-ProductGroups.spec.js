describe('004a - Add Product Group', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    })     
    it('Product Group: should allow you to add a new Product Group', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');
        
        cy.get('[data-cy="side-bar-products"]').click().wait(1000);
        cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // Check that you are on Product Groups page
        cy.get('h1').should('contain', 'Product Groups');


        // Add a new Location
        cy.get('[data-cy="top-btn-add"]').click();

        // Check that you are on Adding Product Group page
        cy.get('h1').should('contain', 'Add Product Group');

        // Validate Product Group Name has to be input
        cy.get('[data-cy="dlg-product-group-input-name"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The name should be between 3 - 35 characters long');
        cy.get('[data-cy="dlg-product-group-input-name"]').type('Mexican Cuisine');

        cy.get('[data-cy="dlg-product-group-input-description"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The description should be between 3 - 255 characters long');
        cy.get('[data-cy="dlg-product-group-input-description"]').type('Tacos, quesadillas, burritos, enchiladas...');

        cy.get('[data-cy="dlg-product-group-select-image"]').uploadFile('images/mexicancuisine.jpg', 'image/jpeg').wait(2000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });

        // Get the image icon before progress to make sure the image uploaded successfully.
        cy.get('[data-cy^="dlg-product-group-image"]:last',{timeout:20000});
        cy.get('[data-cy="dlg-product-group-toggle-btn-status"]').click({ force: true }).wait(1000);


        cy.get('[data-cy="dlg-product-group-btn-schedule"]').click();

        cy.get('h5').should('contain', 'Select Schedule');

        // Enable Syn and select Sunday
        // cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        cy.get('[data-cy="day-date-time-btn-MON"]').click();
        cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        cy.get('[data-cy="day-date-time-btn-WED"]').click();
        cy.get('[data-cy="day-date-time-btn-THU"]').click();
        cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        cy.get('[data-cy="day-date-time-btn-SAT"]').click();



        // Enable open time 
        cy.get('[data-cy="day-date-time-slider-SUN"]').clickVSlider(0.1).clickVSlider(0.8);
        cy.get('[data-cy="day-date-time-slider-MON"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-TUE"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-WED"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-THU"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-FRI"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-SAT"]').clickVSlider(0.1).clickVSlider(0.8);

        cy.get('[data-cy="dlg-schedule-btn-submit"]').click({ force: true }).wait(1000);
        cy.get('[data-cy="dlg-product-group-btn-submit"]').click({ force: true }).wait(1000);

        // Go back to Product Groups screen and validate the newly created Product Group
        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // Check the last item
        cy.get('[data-cy$=title]:last').should('contain','Mexican Cuisine');
        cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');

        cy.contains('Success', { timeout: 20000 });

        // Edit the info

        cy.get('[data-cy$=btn-edit]:last').click();
        cy.get('[data-cy="dlg-product-group-input-name"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The name should be between 3 - 35 characters long');
        cy.get('[data-cy="dlg-product-group-input-name"]').type('Ecuador Cuisine');

        cy.get('[data-cy="dlg-product-group-input-description"]').clear({force : true});
        // cy.get('.invalid-feedback').should('contain', 'The description should be between 3 - 255 characters long');
        cy.get('[data-cy="dlg-product-group-input-description"]').type('Ecuadorian ceviche, fanesca, chorizo, ...');

        cy.get('[data-cy="dlg-product-group-btn-submit"]').click({ force: true }).wait(1000);

        cy.contains('Success', { timeout: 20000 });
        // Check the last item
        cy.get('[data-cy$=title]:last').should('contain','Ecuador Cuisine');
        cy.get('[data-cy$=toggle-btn-status]:last').should('contain','INACTIVE');
        cy.get('.mb-1.text-muted:last').should('contain', 'Ecuadorian ceviche, fanesca, chorizo');

        // Delete the Product Group created

        cy.get('[data-cy$=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 }).wait(2000);


    });
})

