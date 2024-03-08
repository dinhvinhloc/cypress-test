describe('003a - Setup Delivery Rule', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 
    
    it('Business Location: should allow you to setup Delivery Rule for Business Location', function () {
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
        cy.get('[data-cy="store-name"]').clear({force:true}).type('Panino Cappuccino');
        cy.get('[data-cy="store-description"]').clear({force:true}).type('Hideaway eatery with a cozy bistro vibe & a menu of Italian comfort food & house-baked focaccia.');
        cy.get('[data-cy="store-phone"]').clear({force:true}).type('+14163656453');
        cy.get('[data-cy="store-email"]').clear({force:true}).type('info@paninocappuccino.ca');
        cy.get('[data-cy="btn-next"]').click();

        // Next page: Location Details
        cy.get('[data-cy="address.street-name"]').clear({force:true}).type('Wester Rd');
        cy.get('[data-cy="address.street-number"]').clear({force:true}).type('3243');
        cy.get('[data-cy="address.unit"]').clear({force:true}).type('1');
        cy.get('[data-cy="address.country"]').clear({force:true}).type('Canada');
        cy.get('[data-cy="address.city"]').clear({force:true}).type('North York');
        cy.get('[data-cy="address.province"]').clear({force:true}).type('Ontario');
        cy.get('[data-cy="address.postal"]').clear({force:true}).type('M4Y 2B2');
        cy.get('[data-cy="btn-next"]').click();

        // Next Page: 
        cy.wait(1000);
        cy.get('[data-cy="btn-find-location"]').click().wait(500);
        cy.get('[data-cy="btn-next"]').click({force:true});

        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        // cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        
        cy.get('[data-cy="btn-next"]').click({ force: true }).wait(1000);

        cy.get('[data-cy="btn-save"]').click({ force: true });
        
        // Asser that an error will pop up when you don't specific the available time.
        // cy.get('div.message').should('contain','Please, specify images and available time');
        cy.contains(validations.general['no-images-available-time'], {timeout:10000});
        

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
        cy.get('[data-cy="day-date-time-slider-SUN"]').clickVSlider(0.25).clickVSlider(0.8).wait(500);
        cy.get('[data-cy="day-date-time-slider-MON"]').clickVSlider(0.1).clickVSlider(0.9).wait(500);
        cy.get('[data-cy="day-date-time-slider-TUE"]').clickVSlider(0.05).clickVSlider(0.6).wait(500);
        cy.get('[data-cy="day-date-time-slider-WED"]').clickVSlider(0.12).clickVSlider(0.6).wait(500);
        cy.get('[data-cy="day-date-time-slider-THU"]').clickVSlider(0.13).clickVSlider(0.6).wait(500);
        cy.get('[data-cy="day-date-time-slider-FRI"]').clickVSlider(0.14).clickVSlider(0.6).wait(500);
        cy.get('[data-cy="day-date-time-slider-SAT"]').clickVSlider(0.2).clickVSlider(0.8).wait(500);

        // Upload store image

        cy.get('[data-cy="store-select-image"]').uploadFile('images/pc_photo_120-2.jpg', 'image/jpeg').wait(2000);
        cy.get('[data-cy="btn-submit"]').click({force:true});
        // Wait until the store image icon appears, timeout in 20s
        cy.get('[data-cy^="store-image"]',{ timeout: 20000 });
        cy.get('[data-cy="store-detail-checkbox-serve-option-0"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-1"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-2"]').click({ force: true });
        cy.get('[data-cy="btn-save"]').click({force:true});

        // Next Page: Add a Delivery Rule
        cy.contains('Delivery Rules', { timeout: 120000 });

        cy.get('.mr-3 > .btn').click();
        cy.wait(1000);
        cy.get('h4.card-header').should('contain', 'New Delivery Rule');
        cy.get('[data-cy="delivery-rule-input-name"]').clear({force:true});
        cy.get('[data-cy="btn-save"]').click({force:true});
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-1-characters']);
        cy.get('[data-cy="delivery-rule-input-name"]').type('Rule 1');

        cy.get('[data-cy="delivery-rule-input-distance"]').type('1');
        cy.get('[data-cy="delivery-rule-input-price"]').type('5');

        // Check that minimum amout of order is disable (0) for first rule

        cy.get('[data-cy="delivery-rule-input-min-amount"]').should('be.disabled');

        cy.get('[data-cy="btn-save"]').click({force:true});
        cy.contains('Success', { timeout: 20000 });

        // Add another Delivery Rule with the same info and check that the system dectects the duplication
        cy.contains('Delivery Rules', { timeout: 20000 });

        cy.get('[data-cy="top-btn-add"]').click();
        cy.wait(1000);
        cy.get('h4.card-header').should('contain', 'New Delivery Rule');

        cy.get('[data-cy="delivery-rule-input-name"]').clear({force:true});
        cy.get('[data-cy="btn-save"]').click({force:true});
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-1-characters']);
        cy.get('[data-cy="delivery-rule-input-name"]').type('Rule 2');

        cy.get('[data-cy="delivery-rule-input-distance"]').type('1');
        cy.get('[data-cy="delivery-rule-input-price"]').type('5');
        
        // Check that there should be a text complain it's not unique
        cy.get('body').should('contain','A rule with this distance 11 KM and minimum amount 0 CAD already exists');
        
        // Check that the Next button is disabled
        cy.get('[data-cy="btn-save"]').should('be.disabled');

        // Re-enter new value combination
        cy.get('[data-cy="delivery-rule-input-distance"]').clear({force:true}).type('10');
        cy.get('[data-cy="delivery-rule-input-price"]').clear({force:true}).type('50');
        cy.get('[data-cy="btn-save"]').click({force:true});

        cy.contains('Success', { timeout: 20000 });
        // Verify it goes back to Delivery Rules screen
        cy.contains('Delivery Rules', { timeout: 20000 });

        // Check that user can search the Delivery Rule and edit.
        cy.get('[data-cy="top-input-search"]').type('Rule 2');

        cy.get('#btn_edit').click();
        // cy.get('[data-cy="delivery-rule-input-name"]').should('have.text', 'Rule 2');
        cy.get('[data-cy="delivery-rule-input-distance"]').wait(1000).type('{backspace}{backspace}').type('5');
        cy.get('[data-cy="btn-save"]').click().wait(1000);

        // Check the info updated
        cy.get('[data-cy="top-input-search"]').type('Rule 2');
        cy.get('[data-cy="list-item-delivery-rule-0"]').should('contain', '5 KM');

        cy.get('#btn_delete').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Delivery Rules', { timeout: 20000 });

        // Go back to Location and add a Delivery Rule using 
        cy.get('[data-cy="side-bar-setup"]').click();
        cy.get('[data-cy="side-bar-setup.business-location"]').click();
        cy.get('[data-cy*=btn-delivery-rules]:eq(-2)').click();

        cy.contains('Delivery Rules', { timeout: 20000 });
        cy.get('[data-cy="top-btn-add"]').click();
        cy.wait(1000);
        cy.get('h4.card-header').should('contain', 'New Delivery Rule');

        cy.get('[data-cy="delivery-rule-input-name"]').clear({force:true});
        cy.get('[data-cy="btn-save"]').click({force:true});
        cy.get('.invalid-feedback').should('contain', validations.general['minimum-1-characters']);
        cy.get('[data-cy="delivery-rule-input-name"]').type('Rule 3');

        cy.get('[data-cy="delivery-rule-input-distance"]').clear({force:true}).type('10');
        cy.get('[data-cy="delivery-rule-input-price"]').clear({force:true}).type('10.9999');

        cy.get('[data-cy="btn-save"]').click({force:true});

        cy.contains('Success', { timeout: 20000 });
        // Verify it goes back to Delivery Rules screen
        cy.contains('Delivery Rules', { timeout: 20000 });

        // Check the info updated
        cy.get('[data-cy="top-input-search"]').type('Rule 3');
        cy.get('[data-cy="list-item-delivery-rule-0"]').should('contain', '10 KM');
        cy.get('[data-cy="list-item-delivery-rule-0"]').should('contain', '10.99 CAD');

        cy.get('#btn_delete').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();


        // Delete the store created
        cy.get('[data-cy="side-bar-setup"]').click();
        cy.get('[data-cy="side-bar-setup.business-location"]').click();
        cy.get('[data-cy*=btn-delete]:eq(-1)').click();
        cy.get('[data-cy="dlg-alert-btn-ok"]').click();
        
        cy.contains('Success', { timeout: 20000 }).wait(2000);
    });
})

