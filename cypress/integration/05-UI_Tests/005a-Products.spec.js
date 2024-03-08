describe('005a - Add Products', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 
    
    it('Products: should allow you to add a new Product', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');
        // cy.Login(email, password);

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();

        // cy.visit('/');
        
        cy.get('ul.list-unstyled > li:eq(1)').click();
        cy.get('a[href*="/app/setup/business-location"]').click();

        // Check that you on Your Locations page
        cy.get('h1').should('contain', 'Your Locations');


        // Add a new Location
        cy.get('[data-cy="btn-add-new"]').click();
        cy.get('[data-cy="store-name"]').clear({force:true}).type('Arroy Thai Restaurant');
        cy.get('[data-cy="store-description"]').clear({force:true}).type('The Authentic Taste Of Thailand');
        cy.get('[data-cy="store-phone"]').clear({force:true}).type('+19057601110');
        cy.get('[data-cy="store-email"]').clear({force:true}).type('info@arroythairestaurant.com');
        cy.get('[data-cy="btn-next"]').click();

        // Next page: Location Details
        cy.get('[data-cy="address.street-name"]').clear({force:true}).type('Jane Street');
        cy.get('[data-cy="address.street-number"]').clear({force:true}).type('7581');
        cy.get('[data-cy="address.unit"]').clear({force:true}).type('1');
        cy.get('[data-cy="address.country"]').clear({force:true}).type('Canada');
        cy.get('[data-cy="address.city"]').clear({force:true}).type('Concord');
        cy.get('[data-cy="address.province"]').clear({force:true}).type('Ontario');
        cy.get('[data-cy="address.postal"]').clear({force:true}).type('L4K 1X3');
        // cy.get('[data-cy="btn-next"]').click();

        cy.get('[data-cy="btn-find-location"]').click().wait(500);
        cy.get('[data-cy="btn-next"]').click();

        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        // cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        
        cy.get('[data-cy="btn-next"]').click({ force: true }).wait(1000);

        // Next Page:
        cy.contains('Select Available Time');
        
        // cy.wait(1000);
        // cy.get('[data-cy="btn-next"]').click({force:true});
        
        // Asser that an error will pop up when you don't specific the available time.
        // cy.get('div.message').should('contain','Please, specify images and available time');

        // Enable Syn and select Sunday
        cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        // cy.get('[data-cy="day-date-time-btn-MON"]').click();
        // cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        // cy.get('[data-cy="day-date-time-btn-WED"]').click();
        // cy.get('[data-cy="day-date-time-btn-THU"]').click();
        // cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        // cy.get('[data-cy="day-date-time-btn-SAT"]').click();



        // Enable open time 
        cy.wait(500);
        cy.get('[data-cy="day-date-time-slider-SUN"]').clickVSlider(0.25).clickVSlider(0.8);
 

        // Upload store image

        cy.get('[data-cy="store-select-image"]').uploadFile('images/arroythai.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({force:true});
        cy.get('[data-cy^="store-image"]',{ timeout: 20000 });

        cy.get('[data-cy="store-detail-checkbox-serve-option-0"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-1"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-2"]').click({ force: true });

        cy.get('[data-cy="btn-save"]').click({force:true});

        // Next Page: Add a Delivery Rule
        cy.contains('Delivery Rules', { timeout: 120000 });

        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h4.card-header', {timeout: 10000}).should('contain', 'New Delivery Rule');

        cy.get('[data-cy="delivery-rule-input-name"]').clear({force:true}).type('Rule 1');
        cy.get('[data-cy="delivery-rule-input-distance"]').clear({force:true}).type('1');
        cy.get('[data-cy="delivery-rule-input-price"]').clear({force:true}).type('5');

        cy.get('[data-cy="btn-save"]').click().wait(2000);

        //-------------------------- Add Product Groups ----------------------

        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // Check that you are on Product Groups page
        cy.get('h1').should('contain', 'Product Groups');


        // Add a new Location
        cy.get('[data-cy="top-btn-add"]').click({force: true});

        // Check that you are on Adding Product Group page
        // cy.get('h1').should('contain', 'Add Product Group');
        cy.contains('Add Product Group', { timeout: 120000 });
        // Validate Product Group Name has to be input
        cy.get('[data-cy="dlg-product-group-input-name"]').clear({force:true}).type('Thai dishes');
        cy.get('[data-cy="dlg-product-group-input-description"]').clear({force:true}).type('Guay Teow, Tom Yum Goong, Tom Kha Gai, Som Tam...');

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

        cy.get('[data-cy="dlg-product-input-name"]').clear({force:true});
        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="dlg-product-input-name"]').type('Tom Yum Goong');

        cy.get('[data-cy="dlg-product-input-description"]').clear({force:true});
        cy.get('[data-cy="dlg-product-btn-submit"]').click({ force: true }).wait(2000);
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="dlg-product-input-description"]').type('The best Tom Yum Goong in town, cooked with fresh ingredients from Thailand');

        cy.get('[data-cy="dlg-product-input-price"]').clear({force:true}).type('14.99999');

        cy.get('[data-cy="dlg-product-select-product-group-input"]').click({force:true}).type('Thai{enter}');

        cy.get('[data-cy="dlg-product-input-unit"]').type('10');
        cy.get('[data-cy^=dlg-product-checkbox-store]:last').click();

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
        cy.get('.badge:eq(2)').should('contain','Arroy Thai Restaurant');
        cy.get('[data-cy$=-price]:last').should('contain','$14.99');

        //Delete the added Product
        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 });

        //Delete the added Product Group
        cy.get('[data-cy="side-bar-products"]').click();
        cy.get('[data-cy="side-bar-products.product-groups"]').click();

        // cy.get('[data-cy="top-input-search"]').type('Thai dishes');
        cy.get('[data-cy=draggable-list-item-product-group-0-btn-delete]').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 });
        //Delete the created store
        cy.get('[data-cy="side-bar-setup"]').click();
        cy.get('[data-cy="side-bar-setup.business-location"]').click();
        cy.get('[data-cy*=btn-delete]:last').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        cy.contains('Success', { timeout: 20000 }).wait(2000);




    });
})

