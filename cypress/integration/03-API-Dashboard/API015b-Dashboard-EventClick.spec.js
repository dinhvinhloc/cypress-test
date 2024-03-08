describe("API015b - Event Click Endpoint", () => {
    it("Business Category: Event Click Endpoint should allow to collect the user 'click' interaction from the app", () => {

    
        // Merchant login - merchant1, 
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        cy.waitUntil(() => cy.Login(email,password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));

        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.fixture('test-data/eventClick.json').as('eClickData');

        var endDate = Cypress.dayjs().add(1,'days').format('YYYY-MM-DD');
        var startDate= Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');
        var reqObj;
        var calls;
        var subscribers;
        var updatedCalls;
        var updatedSubscribers;
        
         
        cy.waitUntil(() => cy.get('@eClickData').then((info) => {
            reqObj = info;
            reqObj.triggeredAt = Cypress.dayjs().subtract(0,'days').format('YYYY-MM-DDTHH:mm:ssZ');
            console.log(reqObj)
        }));

        var store1
        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));   

        cy.waitUntil(() => cy.get('@stores').then((info) => {
            reqObj.storeId = info[0].storeID.id;

            reqObj.merchantId = merchantId;
        }));



        // end user login - enduser0001
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.unsubscribeTopic(store1.storeID.id,"STORE", null).then((response)=>{
            console.log(response)
            
        }));

        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // getDashboardInit() => calls , subscribers
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, reqObj.merchantId ).then((response)=>{
            var metrics = response;
            subscribers = metrics.filter((el)=>{ return el.metric == 'TOTAL_SUBSCRIBERS'})[0].total;
            calls = metrics.filter((el)=>{ return el.metric == 'TOTAL_CALLS'})[0].total;
            console.log(`Calls:: ${calls}\nSubscribers:: ${subscribers}`);
        }));

        // end user login - enduser0001
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        var subscription
        cy.waitUntil(()=> cy.subscribeTopic(store1.storeID.id, "STORE", null).then((response)=>{
            console.log(response)
            expect(response).to.have.property('city', null);
            expect(response).to.have.property('subscriptionType', 'STORE');
            expect(response).to.have.property('topic', store1.storeID.id);
            subscription = response
        }));


        // event click for CALL
        cy.waitUntil(() => cy.eventClick(reqObj).then((response) => {
            // Check the response for 200.
            expect(response).to.have.property('status', 200);
        }));
    
        // merchant login 
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // getDashboardInit() => expect(res.calls) == calls + 1; 
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, reqObj.merchantId ).then((response)=>{
            var metrics = response;
            updatedSubscribers = metrics.filter((el)=>{ return el.metric == 'TOTAL_SUBSCRIBERS'})[0].total;
            updatedCalls = metrics.filter((el)=>{ return el.metric == 'TOTAL_CALLS'})[0].total;
            console.log(`updatedCalls:: ${updatedCalls}\nupdatedSubscribers:: ${updatedSubscribers}`);
            expect(calls+1,"Assert TOTAL_CALLS").to.equal(updatedCalls);
            expect(subscribers+1,"Assert TOTAL_SUBSCRIBERS").to.equal(updatedSubscribers);
        }));
    })
})