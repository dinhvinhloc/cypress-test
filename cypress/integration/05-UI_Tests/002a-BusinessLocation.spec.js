describe('002a - Setup Business Location', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 

    
    it('Business Location: should allow you to setup Business Location', function () {
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

        cy.get('[data-cy="store-name"]').clear({force:true});
        // Assert store name has to be filled or error
        cy.get('[data-cy="btn-next"]').click();
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="store-name"]').type('Spring Rolls Restaurant');


        cy.get('[data-cy="store-description"]').clear({force:true});
        // Assert store description can't be blank or error
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-3-characters']);
        cy.get('[data-cy="store-description"]').type('Spring Rolls Delivery - we roll out great dinning experience right up to your door');
        
        cy.get('[data-cy="store-phone"]').clear({force:true});
        // Assert phone can't be blank and has to meet standard.
        cy.get('.invalid-feedback').should('contain', validations.general['no-phone-validation']);
        cy.get('[data-cy="store-phone"]').type('+14163657655');

        cy.get('[data-cy="store-email"]').clear({force:true});
        // Assert email has to be valid
        cy.get('.invalid-feedback').should('contain', validations.general['no-email-validation']);
        cy.get('[data-cy="store-email"]').type('info@springrolls.ca');

        cy.get('[data-cy="btn-next"]').click();

        // Next page: Location Details
        cy.get('h1').should('contain', 'Location Details');

        cy.get('[data-cy="address.street-name"]').clear({force:true});
        cy.get('[data-cy="btn-next"]').click();
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.street-name"]').type('Yonge St');


        cy.get('[data-cy="address.street-number"]').clear({force:true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.street-number"]').clear({force:true}).type('693');


        cy.get('[data-cy="address.unit"]').clear({force:true}).type('1');
        cy.get('[data-cy="address.country"]').clear({force:true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.country"]').clear({force:true}).type('Canada');

        cy.get('[data-cy="address.city"]').clear({force:true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-2-validation']);
        cy.get('[data-cy="address.city"]').clear({force:true}).type('Toronto');

        cy.get('[data-cy="address.province"]').clear({force:true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-2-validation']);
        cy.get('[data-cy="address.province"]').clear({force:true}).type('Ontario');

        cy.get('[data-cy="address.postal"]').clear({force:true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.postal"]').type('M4Y 2B2');

        cy.get('[data-cy="btn-next"]').click();

        // Next Page: 
        cy.wait(1000);
        cy.get('[data-cy="btn-find-location"]').click().wait(500);
        cy.get('[data-cy="btn-next"]').click({force:true});
        
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        
        cy.get('[data-cy="btn-next"]').click({ force: true }).wait(1000);

        cy.get('[data-cy="btn-save"]').click({ force: true });
        // Asser that an error will pop up when you don't specific the available time.
        // cy.get('div.message').should('contain','Please, specify images and available time');
        cy.contains(validations.general['no-images-available-time'], {timeout:10000});
        // Enable Syn and select Sunday
        cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        cy.get('[data-cy="day-date-time-btn-MON"]').click();
        cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        cy.get('[data-cy="day-date-time-btn-WED"]').click();
        cy.get('[data-cy="day-date-time-btn-THU"]').click();
        cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        cy.get('[data-cy="day-date-time-btn-SAT"]').click();



        // Enable open time from 12:00PM to 9:30 PM
        cy.get('[data-cy="day-date-time-slider-SUN"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-MON"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-TUE"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-WED"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-THU"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-FRI"]').clickVSlider(0.25).clickVSlider(0.7);
        cy.get('[data-cy="day-date-time-slider-SAT"]').clickVSlider(0.25).clickVSlider(0.7);

        // Upload store image

        cy.get('[data-cy="store-select-image"]').uploadFile('images/springroll.jpg', 'image/jpeg').wait(2000);
        // cy.contains('Crop the image', { timeout: 20000 });
        cy.get('[data-cy="btn-submit"]').click();
        
        // Wait until the store image icon appears, timeout in 20s
        cy.get('[data-cy^="store-image"]',{ timeout: 20000 });

        cy.get('[data-cy="store-detail-checkbox-serve-option-0"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-1"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-2"]').click({ force: true });

        
        cy.get('[data-cy="btn-save"]').click({force:true});
    
        // Next Page
        // Wait until store data successfully saved and Delivery Rules page loaded.
        cy.contains('Delivery Rules', { timeout: 20000 });

        cy.get('[data-cy="top-btn-add"]').click();
        cy.get('h4.card-header').should('contain', 'New Delivery Rule');

        cy.get('input[type="text"].mb-2').clear({force:true});
        cy.get('input[type="text"].mb-2').type('Rule 1');

        cy.get('[data-cy="delivery-rule-input-distance"]').type('1');
        cy.get('[data-cy="delivery-rule-input-price"]').type('5');
        cy.get('[data-cy="btn-save"]').click().wait(1000);
        cy.contains('Delivery Rules', { timeout: 20000 });
        cy.contains('Rule 1', { timeout: 20000 });


        // Delete the store created
        cy.get('[data-cy="side-bar-setup"]').click();
        cy.get('[data-cy="side-bar-setup.business-location"]').click();
        cy.get('[data-cy*=btn-delete]:eq(-2)').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();

        cy.contains('Success', { timeout: 20000 }).wait(2000);


    });
})

