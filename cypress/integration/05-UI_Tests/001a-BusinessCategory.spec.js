describe('001a - Setup Business Category', function () {
    it('Business Category: should allow you to completely setup Business Category with a Location', function () {
        const email = Cypress.env('merchant2');
        const password = Cypress.env('merchant2Pass');

        cy.visit('/')
        cy.get('input[type="text"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('.btn').contains('LOGIN').click().wait(1000);
        cy.get('span > img[alt="Avatar"]').should('be.visible').click();


        // cy.visit('/');
        cy.get('ul.list-unstyled > li:eq(1)').click();
        cy.get('[data-cy="side-bar-setup.business-type"]').click();

        cy.get('[data-cy="list-item-business-type-radio-0"]').click({force: true});
        cy.get('.btn').contains('Next').click();

        // Select all categories
        cy.get('[data-cy="list-item-business-category-checkbox-0"]').check({ force: true }).should('be.checked');
        cy.get('[data-cy="list-item-business-category-checkbox-1"]').check({ force: true }).should('be.checked');
        cy.get('[data-cy="list-item-business-category-checkbox-2"]').check({ force: true }).should('be.checked');
        cy.get('[data-cy="list-item-business-category-checkbox-3"]').check({ force: true }).should('be.checked');
        cy.get('[data-cy="list-item-business-category-checkbox-4"]').check({ force: true }).should('be.checked');
        cy.get('[data-cy="list-item-business-category-checkbox-5"]').check({ force: true }).should('be.checked');
        cy.get('[data-cy="list-item-business-category-checkbox-6"]').check({ force: true }).should('be.checked');
        cy.get('.btn').contains('Next').click();

        // Input Business Profile

        cy.get('[data-cy="business-profile.name"]').clear({force : true}).type('Taco da Silva');
        cy.get('[data-cy="business-profile.description"]').clear({force : true}).type('We are selling Mexican food');
        cy.get('[data-cy="business-profile.phone"]').clear({force : true}).type('+16475186455');
        cy.get('[data-cy="business-profile.email"]').clear({force : true}).type('carlos@tacodasilva.ea');
        cy.get('[data-cy="business-profile.website"]').clear({force : true}).type('www.google.com');
        cy.get('.btn').contains('Next').click();

        // Input the address
        cy.get('[data-cy="address.street-name"]').clear({force : true}).type('Wellington St W');
        cy.get('[data-cy="address.street-number"]').clear({force : true}).type('432');
        cy.get('[data-cy="address.unit"]').clear({force : true}).type('1');
        cy.get('[data-cy="address.country"]').clear({force : true}).type('Canada');
        cy.get('[data-cy="address.city"]').clear({force : true}).type('Toronto');
        cy.get('[data-cy="address.province"]').clear({force : true}).type('Ontario');
        cy.get('[data-cy="address.postal"]').clear({force : true}).type('M5V 1E3');
        cy.get('.btn').contains('Next').click();

        // Enable Syn and select Sunday if this is first time setup

        // Wait for the page to fully rendered
        cy.wait(2000);
        cy.get('body').then(($body) => {
            // synchronously ask for the body's text
            // Check if the page has 'Select Available Time'
            if ($body.text().includes('Select Available Time')) {
                // yup found it
                cy.get('[data-cy="day-date-time-toggle-sync"]').click();
                cy.get('[data-cy="day-date-time-btn-SUN"]').click();
            }
        })
        
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        cy.get('*[class^="btn btn-primary btn-xs"]').filter((index, el) => el.innerText === "Add").eq(0).click();
        
        cy.get('[data-cy="btn-next"]').click({ force: true });



        // Upload Logo
        cy.get('[data-cy="logos-select-image"]').uploadFile('images/logo1.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
        cy.get('[data-cy^=logos-image]:last',{timeout:20000});

        // Upload Business Image
        cy.get('[data-cy="business-images-select-image"]').uploadFile('images/dish2.jpg', 'image/jpeg').wait(1000);
        cy.get('[data-cy="btn-submit"]').click({ force: true });
        cy.get('[data-cy^=business-images-image]:last',{timeout:20000}).wait(2000);
        

        cy.get('[data-cy="store-detail-checkbox-serve-option-0"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-1"]').click({ force: true });
        cy.get('[data-cy="store-detail-checkbox-serve-option-2"]').click({ force: true });


        cy.get('[data-cy="day-date-time-toggle-sync"]').click();
        cy.get('[data-cy="day-date-time-btn-SUN"]').click();
        cy.get('[data-cy="day-date-time-btn-MON"]').click();
        cy.get('[data-cy="day-date-time-btn-TUE"]').click();
        cy.get('[data-cy="day-date-time-btn-WED"]').click();
        cy.get('[data-cy="day-date-time-btn-THU"]').click();
        cy.get('[data-cy="day-date-time-btn-FRI"]').click();
        cy.get('[data-cy="day-date-time-btn-SAT"]').click();

        cy.get('[data-cy="btn-save"]').click({ force: true });

        // Delete Location to clear data
        // cy.wait(2000);
        // cy.get('[data-cy="list-item-store-0-btn-delete"]').click({force:true});
        // cy.get('.btn').contains('Ok').click();
        cy.contains('Your Locations', { timeout: 120000 });        // cy.Logout().visit('/');
        //Sign Out
        // cy.get('.dropdown-item:eq(1)').click();
    });
})
