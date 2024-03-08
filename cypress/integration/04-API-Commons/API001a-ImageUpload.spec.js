describe('API001a - Upload Image using API', function () {
    it('Business Category: should allow you to Upload images to file server', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var fileUploaded;
        var imageURLs={};
        var fileName = 'cypress/fixtures/test-data/imageURLs.json';


        cy.waitUntil(()=>cy.uploadImage('images/logo.jpg').then((response)=>{

            fileUploaded = response[0].uploaded
            console.log('File uploaded: '+ fileUploaded)
        }));

        cy.uploadMerchantImage('images/logo.jpg').then((response)=>{
            console.log(response);
            imageURLs.logo = response[0];        
        }).then(()=>{
            cy.uploadMerchantImage('images/promotion.jpg').then((response)=>{
                console.log(response);
                imageURLs.promotion = response[0];        
            })    
        })
        .then(()=>{
            cy.writeFile(fileName, imageURLs)    
        })
    });
})
