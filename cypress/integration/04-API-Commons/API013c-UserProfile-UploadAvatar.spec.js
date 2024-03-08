describe("API013c - Upload User Profile Avatar using API", () => {
    it("Business Category: should allow to Upload the avatar of the user profile", () => {

        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        var fileUploaded;

        cy.waitUntil(()=>
            cy.uploadUserProfileAvatar('images/logo.jpg').then((response)=>{
            expect(response).to.contains('http');
            fileUploaded = response         
        }))
    })
})
