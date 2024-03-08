describe('API018a3 - User Point test - get the Global Point configuration', function () {
    it('Test the API to allow user to GET Global Point configuration', function () {
        

        let email = Cypress.env('enduser0001');
        let password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.getGlobalPointConfig().then((response)=>{
            expect(response).to.have.keys('pointPerDollar', 'customerPercentOnOrder', 'referrerRegistrationReward', 'newCustomerRegistrationReward','transactionReferralRewardPercentage','minimumOrdersReceiveRegistrationReward','highestReferralLevel');
            console.log(response)
        }));
        
        

    });
})
