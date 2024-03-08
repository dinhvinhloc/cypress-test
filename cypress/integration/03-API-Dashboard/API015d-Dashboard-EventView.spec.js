describe("API015d - Event View Endpoint", () => {
    it("Business Category: Event View Endpoint should allow to collect the user 'click' interaction from the app", () => {

        // Merchant Login 
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        cy.Login(email, password);
        cy.waitUntil(() => cy.Login(email,password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));

        // Fixtures
        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.fixture('test-data/eventView.json').as('eViewData');

        // Dates 
        var endDate = Cypress.dayjs().format('YYYY-MM-DD');
        var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');

        // Event View Request Payload
        var reqObj;

        // Before Event View Variables
        var engagements;
        var views;
        var storeEngagements;
        var storeViews;

        // After Event View Variables
        var updatedEngagements;
        var updatedViews;
        var updatedStoreEngagements;
        var updatedStoreViews;



        // Getting Event View Request Object
        cy.waitUntil(() => cy.get('@eViewData').then((info) => {
            reqObj = info;
            reqObj.triggeredAt = Cypress.dayjs().subtract(0,'days').format('YYYY-MM-DDTHH:mm:ss');
        }));

        // Getting Store and Merhchant ID's from stores.json
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            reqObj.storeId = info[0].storeID.id;

            reqObj.merchantId = merchantId;
        }));

        // GetDashboardInit == > User TOTAL_ENGAGEMENTS and TOTAL_STORE_VIEWS
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, reqObj.merchantId).then((response) => {
            let metrics = response;
            engagements = metrics.filter((el) => { return el.metric == 'TOTAL_ENGAGEMENTS' })[0].total;
            views = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VIEWS' })[0].total;
            console.log(`Engagements:: ${engagements}\nViews:: ${views}`);
        }));

        // GetDashboardInitWithStore == > User TOTAL_ENGAGEMENTS and TOTAL_STORE_VIEWS
        cy.waitUntil(() => cy.getDashboardInitWithStore(startDate, endDate, reqObj.merchantId, reqObj.storeId).then((response) => {
            let metrics = response;
            storeEngagements = metrics.filter((el) => { return el.metric == 'TOTAL_ENGAGEMENTS' })[0].total;
            storeViews = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VIEWS' })[0].total;
            console.log(`StoreEngagements:: ${storeEngagements}\nStoreViews:: ${storeViews}`);
        }));

    

        // End user Login 
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        // End User Event View Call
        cy.waitUntil(() => cy.eventView(reqObj).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        // Merchant login 
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // getDashboardInit() to compare for a increment in engagement.
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, reqObj.merchantId).then((response) => {
            let metrics = response;
            updatedEngagements = metrics.filter((el) => { return el.metric == 'TOTAL_ENGAGEMENTS' })[0].total;
            updatedViews = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VIEWS' })[0].total;
            console.log(`updatedEngagements:: ${updatedEngagements}\nupdatedViews:: ${updatedViews}`);
            expect(engagements + 1).to.equal(updatedEngagements);
            expect(views + 1).to.equal(updatedViews);
        }));

        // getDashboardInitWithStore() to compare for a increment in engagement. 
        cy.waitUntil(() => cy.getDashboardInitWithStore(startDate, endDate, reqObj.merchantId, reqObj.storeId).then((response) => {
            let metrics = response;
            updatedStoreEngagements = metrics.filter((el) => { return el.metric == 'TOTAL_ENGAGEMENTS' })[0].total;
            updatedStoreViews = metrics.filter((el) => { return el.metric == 'TOTAL_STORE_VIEWS' })[0].total;
            console.log(`updatedStoreEngagements:: ${updatedStoreEngagements}\nupdatedStoreViews:: ${updatedStoreViews}`);
            expect(storeEngagements + 1).to.equal(updatedStoreEngagements);
            expect(storeViews + 1).to.equal(updatedStoreViews);
        }));


        // Check if there is platform object for the sent platform request payload.
        cy.waitUntil(() => cy.getDashboardPlatform(startDate, endDate, reqObj.merchantId, reqObj.storeId).then((response) => {
             
            let platformObj = response.filter(el => el.platform === reqObj.platform)[0];
            expect(platformObj).to.have.property('platform');
        }));

    })
})