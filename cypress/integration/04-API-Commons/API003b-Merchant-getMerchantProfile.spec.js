describe('API003b - Get Merchant Profile using API', function () {
    it('Business Category: should allow you to get Merchant profile', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var merchantEmail;
        var merchantPhone;
        var merchantName;

        cy.getMerchantProfile().then((response)=>{
           console.log(response)
            expect(response).to.have.property('email');
            expect(response).to.have.property('phone');
            expect(response).to.have.property('name');
            console.log(response);
            merchantEmail = response.email;
            merchantPhone = response.phone;
            merchantName = response.name;         
        }).then(()=>{
            cy.log('Merchant Name: ' + merchantName);
            cy.log('Merchant Email: ' + merchantEmail);
            cy.log('Merchant Phone: ' + merchantPhone);            
        })                 
    });
})
