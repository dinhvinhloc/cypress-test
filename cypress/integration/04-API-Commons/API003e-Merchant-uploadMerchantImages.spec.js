describe('API003e - Upload Merchant Image using API', function () {
    it('Business Category: should allow you to Upload image of the Merchant', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var fileUploaded;

            cy.uploadMerchantImage('images/logo.jpg').then((response)=>{
                console.log(response);
                expect(response[0]).to.contains('http');
                return fileUploaded = response         
            }).then((file)=>{
                cy.log('Merchant image uploaded: '+ file)
            }).then(()=>{
                cy.log('DELETING IMAGE')
                cy.deleteMerchantImage(fileUploaded).then((response)=>{
                    console.log(response)
                })
                cy.log('IMAGE DELETED')
            })        
    });
})
