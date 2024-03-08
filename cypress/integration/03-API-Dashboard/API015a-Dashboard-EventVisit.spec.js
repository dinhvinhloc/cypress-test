describe("API015a - Event Visit Endpoint", () => {
    it("Business Category: Event Visit Endpoint should allow to collect the user 'visit' interaction from the app", () => {
        
        // Merchant Login 
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        cy.waitUntil(() => cy.Login(email,password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));
        
        // Fixtures
        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.fixture('test-data/eventVisit.json').as('eVisitData');

        // Dates 
        var endDate = Cypress.dayjs().format('YYYY-MM-DD');
        var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');

        // Event Visit Request Payload
        var reqObj;
        var storeId;

        // Before Event Visit Variables
        var visits;
        var storeVisits;

        // After Event Visit Variables
        var updatedVisits;
        var updatedStoreVisits;

        // Getting Event Visit Request Object
        cy.waitUntil(() => cy.get('@eVisitData').then((info) => {
            reqObj = info;
            reqObj.triggeredAt = Cypress.dayjs().subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
        }));

        // Getting Store and Merhchant ID's from stores.json
        cy.waitUntil(() => cy.get('@stores').then((info) => {
             
            // merchantId = info[0].merchantID;
            storeId = info[0].storeID.id;


            var obj = {};
            obj[merchantId] = [storeId];
            reqObj.merchantStores = obj;
        }));

        // GetDashboardInit == > Total Store Visit 
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, merchantId).then((response) => {
            let metrics = response;
            visits = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VISITS' })[0].total;
            console.log(`Visits:: ${visits}`);
        }));

        // GetDashboardInitWithStore== > Total Store Visit 
        cy.waitUntil(() => cy.getDashboardInitWithStore(startDate, endDate, merchantId, storeId).then((response) => {
            let metrics = response;
            storeVisits = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VISITS' })[0].total;
            console.log(`storeVisits:: ${storeVisits}`);
        }));

        // End User Login
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Event Visit api Calling 
        cy.waitUntil(() => cy.eventVisit(reqObj).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        // Merchant Login 
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // GetDashboardInit == > Total Store Visit & Compare 
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, merchantId).then((response) => {
            let metrics = response;
            updatedVisits = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VISITS' })[0].total;
            expect(visits+1).to.equal(updatedVisits);
            console.log(`updatedVisits:: ${updatedVisits}`);
        }));

        // GetDashboardInitWithStore== > Total Store Visit & Compare
        cy.waitUntil(() => cy.getDashboardInitWithStore(startDate, endDate, merchantId, storeId).then((response) => {
            let metrics = response;
            updatedStoreVisits = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VISITS' })[0].total;
            expect(storeVisits+1).to.equal(updatedStoreVisits);
            console.log(`updatedStoreVisits:: ${updatedStoreVisits}`);
        }));








        
    })
})