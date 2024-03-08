describe("API015j - Metric and the Real Time API", () => {
    it("Business Category: Checking the Metric and Real Time API for bringing data related to respective metric", () => {


        // Merchant LOgin
        // get metric data - 270,280
        // get realtime data - 280 
        // end user login
        // end user event visit 
        // get metric and compare
        // get realtime and compare


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
         var endDate = Cypress.dayjs().add(0,'days').format('YYYY-MM-DD');
         var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');
 
         // Event Visit Request Payload
         var reqObj;
         var storeId;
 
         // Before Event Visit Variables
         var mVisits;
         var rVisits;
 
         // After Event Visit Variables
         var updatedMVisits;
         var updatedRVisits;
 
         // Getting Event Visit Request Object
         cy.waitUntil(() => cy.get('@eVisitData').then((info) => {
             reqObj = info;
             reqObj.triggeredAt = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ss');
         }));
 
         // Getting Store and Merhchant ID's from stores.json
         cy.waitUntil(() => cy.get('@stores').then((info) => {
              
             // merchantId = info[0].merchantID;
             storeId = info[0].storeID.id;

             var obj = {};
             obj[merchantId] = [storeId];
             reqObj.merchantStores = obj;
         }));
 
        //  get User Engagements from metric api
        cy.waitUntil(() => cy.getMetric(startDate, endDate, 'TOTAL_STORE_VISITS','DAILY', merchantId, storeId).then((response) => {
             
            let day = Cypress.dayjs().add(0,'days').dayOfYear();
            let arr = response.filter(el => el.day == day);
            if(arr.length > 0){
                mVisits = arr[0].total; 
            }
            else{
                mVisits = 0;
            }
        }));

        // get User Engagements from realtime api
        // cy.waitUntil(() => cy.getRealTime('TOTAL_STORE_VISITS','DAILY', merchantId, storeId).then((response) => {
             
        //     rVisits = response.body
        // }));
 
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
 
         // 
         cy.waitUntil(() => cy.getMetric(startDate, endDate, 'TOTAL_STORE_VISITS','DAILY', merchantId, storeId).then((response) => {
             
            let day = Cypress.dayjs().add(0,'days').dayOfYear();
            let arr = response.filter(el => el.day == day);
            if(arr.length > 0){
                updatedMVisits = arr[0].total; 
            }
            else{
                updatedMVisits = 0;
            }
            expect(mVisits+1).to.equal(updatedMVisits);
        }));

        // get User Engagements from realtime api
        // cy.waitUntil(() => cy.getRealTime('TOTAL_STORE_VISITS','DAILY', merchantId, storeId).then((response) => {
             
        //     updatedRVisits = response.body
        //     expect(rVisits+1).to.equal(updatedRVisits);
        // }));

        

    })
})