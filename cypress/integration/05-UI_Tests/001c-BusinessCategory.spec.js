describe('001c - Setup Business Category', function () {
    var validations;
    beforeEach(() => {
        cy.fixture('test-data/en.json').as('source');
        cy.get('@source').then((info) => {             
            validations = info;
            console.log(info);
        })
    }) 

    it('Business Category: should complains when Business Location missing information', function () {
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
        cy.get('[data-cy="address.street-name"]').clear({force : true});
        cy.get('[data-cy="btn-next"]').click();
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.street-name"]').type('Wellington St W');


        cy.get('[data-cy="address.street-number"]').clear({force : true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.street-number"]').clear({force : true}).type('432');


        cy.get('[data-cy="address.unit"]').clear({force : true}).type('1');
        cy.get('[data-cy="address.country"]').clear({force : true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);
        cy.get('[data-cy="address.country"]').clear({force : true}).type('Canada');

        cy.get('[data-cy="address.city"]').clear({force : true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-2-validation']);
        cy.get('[data-cy="address.city"]').clear({force : true}).type('Toronto');

        cy.get('[data-cy="address.province"]').clear({force : true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-2-validation']);
        cy.get('[data-cy="address.province"]').clear({force : true}).type('Ontario');

        cy.get('[data-cy="address.postal"]').clear({force : true});
        cy.get('.invalid-feedback').should('contain', validations.address['no-item-3-validation']);

        cy.get('[data-cy="btn-next"]').should('be.disabled');

        // cy.Logout().visit('/');
        //Sign Out
        // cy.get('.dropdown-item:eq(1)').click();
    });
})
