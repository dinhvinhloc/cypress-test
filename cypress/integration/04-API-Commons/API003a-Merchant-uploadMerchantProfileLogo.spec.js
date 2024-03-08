describe('API003a - Upload Merchant Profile Logo using API', function () {
    it('Business Category: should allow you to Upload Logo of the Merchant', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var fileUploaded;

        cy.waitUntil(()=>
            cy.uploadMerchantProfileLogo('images/logo.jpg').then((response)=>{
            expect(response).to.contains('http');
            fileUploaded = response         
        }))

        cy.waitUntil(()=>
            cy.deleteMerchantImage(fileUploaded).then((response)=>{
                console.log(response)
            })        
        )           
    });
})
