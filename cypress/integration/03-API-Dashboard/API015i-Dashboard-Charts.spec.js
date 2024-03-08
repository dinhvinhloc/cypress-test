describe("API015i - Best Sellers, Popular Time Chart ", () => {
    it("Business Category: Respective API should be returning the information relevant to that chart", () => {

        // merchant user login
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        var storeId;
        var endDate = Cypress.dayjs().format('YYYY-MM-DD');
        var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');

        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate');

        cy.waitUntil(() => cy.Login(email, password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));

        // Getting the store Id from the stores.json
        cy.waitUntil(() => cy.get('@stores').then((info) => {
             
            storeId = info[0].storeID.id;

        }));

        // Popular Time Chart without Store Id
        cy.waitUntil(() => cy.getDashboardTime(startDate, endDate, 'MONDAY', merchantId).then((response) => {
            // Compare instance of response to array.
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.getDashboardTime(startDate, endDate, 'MONDAY', merchantId, storeId).then((response) => {
            // Compare status to 200
            expect(response).to.have.property('status', 200);
        }));

        // Best Sellers Chart 
        cy.waitUntil(() => cy.getBestSeller(startDate, endDate, merchantId).then((response) => {
            // Compare status to 200
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.getBestSeller(startDate, endDate, merchantId, storeId).then((response) => {
            // Compare status to 200
            expect(response).to.have.property('status', 200);
        }));

    })
})