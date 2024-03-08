describe("API013c - Upload User Profile Avatar using API", () => {
    it("Business Category: should allow to Upload the avatar of the user profile", () => {

        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

            cy.checkUserReferred().then((response)=>{
            expect(response).to.equal(false);
        })
    })
})
