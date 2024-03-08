describe('API003d - Get Merchant Profile by Merchant Number using API', function () {
    it('Business Category: should allow you to get Merchant profile by Merchant Number', function () {
        var merchantID
        var id
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password).then((response)=>{
            merchantID = response.merchantID
            id = response.id
            console.log(response)
        });


        cy.Login("platform.intra@gmail.com", "admin");

        cy.waitUntil(()=>
            cy.getMerchantProfileByID(merchantID).then((response)=>{
                console.log(response)
                expect(response).to.have.property('merchantId',merchantID);
            })
        )
    });
})