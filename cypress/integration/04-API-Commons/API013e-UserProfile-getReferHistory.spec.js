describe("API013e - Check refer history endpoint", () => {
    it("Test the refer history endpoint", () => {

        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

            cy.getReferHistory().then((response)=>{
            console.log(response)
            expect(response).to.be.an("array").that.is.not.empty;
        })
    })
})
