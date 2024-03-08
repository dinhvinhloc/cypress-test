describe('API002f - Delivery Rules CRUD APIs', function () {
    it('Business Category: should allow you to get delivery price by store ID', function () {
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/delivery-rule.json').as('deliveryRule')
        var storeInfo
        var storeID;
        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []

        cy.waitUntil(() => cy.getTaxConfig().then((taxInfoResponse) => {
            taxInfo = taxInfoResponse
        }));

        cy.waitUntil(() => cy.get('@storeInfo').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.description = 'Created date: ' + today;
            storeInfo = info
        }));

        cy.waitUntil(() =>
            cy.wrap(taxInfo).each((tax) => {

                // Create a default tax config Ids array
                if ((tax.country == storeInfo.address.country && tax.province == storeInfo.address.province && tax.city == storeInfo.address.city)
                    || (tax.country == storeInfo.address.country && tax.province == storeInfo.address.province && tax.city == null)
                    || (tax.country == storeInfo.address.country && tax.province == null && tax.city == null)) {
                    console.log(tax);
                    defaultTaxIds.push(tax.id)
                }
                // Create a config Ids array of HST and GST
                if ((tax.country == storeInfo.address.country && tax.province == storeInfo.address.province && tax.city == null)
                    || (tax.country == storeInfo.address.country && tax.province == null && tax.city == null)) {
                    console.log(tax);
                    gstHstTaxIds.push(tax.id)
                }

            })
        );

        cy.wrap(storeInfo).then(() => {
            storeInfo.taxConfigIds = defaultTaxIds

        })

        cy.waitUntil(() => cy.createMerchantStore(storeInfo).then((createdStore) => {
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);

            console.log(storeID);
            storeID = createdStore.id
        }));


        var deliveryRule;
        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '5 km - HST and GST';
            info.price = 10;
            info.distance = 5;
            info.minAmount = 0;
            info.taxConfigIds = gstHstTaxIds
            info.isDefaultStoreTax = false
            deliveryRule = info
            console.log("Creating Delivery Rule: ", deliveryRule)
        }));

        var createdDeliveryRule
        cy.waitUntil(() => cy.createDeliveryRule(storeID, deliveryRule).then((response) => {
            console.log(response);
            createdDeliveryRule = response
            console.log("Created Delivery Rule: ", createdDeliveryRule)
            expect(response).to.have.property('name', deliveryRule.name);
            expect(response).to.have.property('price', deliveryRule.price);
            expect(response).to.have.property('distance', deliveryRule.distance);
            expect(response).to.have.property('minAmount', deliveryRule.minAmount);
            expect(response.taxConfigIds).to.deep.equal(deliveryRule.taxConfigIds);
        }));

        // CREATE DUPLICATE DELIVERY RULE => EXPECT TO FAIL 
        cy.waitUntil(() => cy.createDeliveryRuleAllowFail(storeID, deliveryRule).then((response) => {
            console.log(response);
            expect(response).to.have.property('status', 400);
            expect(response).to.have.property('message', "Requested delivery rule combination already exists. Please verify and re-try.");
        }));


        var updatedDeliveryRule
        cy.waitUntil(() =>
            cy.wrap(createdDeliveryRule).then(() => {
                createdDeliveryRule.name = '5 km - HST and GST - updated';
                createdDeliveryRule.price = 11;
                createdDeliveryRule.distance = 11;
                createdDeliveryRule.minAmount = 0;
                createdDeliveryRule.taxConfigIds = defaultTaxIds
                createdDeliveryRule.isDefaultStoreTax = true
                updatedDeliveryRule = createdDeliveryRule
                console.log("Updating Delivery Rule: ", updatedDeliveryRule)
            })
        );

        cy.waitUntil(() => cy.updateDeliveryRule(storeID,updatedDeliveryRule.id ,updatedDeliveryRule).then((response) => {
            console.log(response);
            console.log("Updated Delivery Rule response: ", response)
            expect(response).to.have.property('status', updatedDeliveryRule.status);
            expect(response).to.have.property('name', updatedDeliveryRule.name);
            expect(response).to.have.property('price', updatedDeliveryRule.price);
            expect(response).to.have.property('distance', updatedDeliveryRule.distance);
            expect(response).to.have.property('minAmount', updatedDeliveryRule.minAmount);
            expect(response.taxConfigIds).to.deep.equal(updatedDeliveryRule.taxConfigIds);
        }));

        cy.waitUntil(() => cy.updateDeliveryRuleStatus(storeID,updatedDeliveryRule.id ,"INACTIVE").then((response) => {
            console.log(response);
            console.log("Updated Delivery Rule response: ", response)
            expect(response).to.have.property('status', "INACTIVE");
            expect(response).to.have.property('name', updatedDeliveryRule.name);
            expect(response).to.have.property('price', updatedDeliveryRule.price);
            expect(response).to.have.property('distance', updatedDeliveryRule.distance);
            expect(response).to.have.property('minAmount', updatedDeliveryRule.minAmount);
            expect(response.taxConfigIds).to.deep.equal(updatedDeliveryRule.taxConfigIds);
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        var body = {
            "totalAmount": 10,
            "distance": 5
        }

        cy.waitUntil(() => cy.getDeliveryPriveByMerchantStoreAllowFail(storeID, body).then((response) => {
            console.log(response);
            expect(response).to.have.property('status', 404);
            expect(response.body.message).to.contain("No matching deliveryRule found");
        }));

        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.updateDeliveryRuleStatus(storeID,updatedDeliveryRule.id ,"ACTIVE").then((response) => {
            console.log(response);
            console.log("Updated Delivery Rule response: ", response)
            expect(response).to.have.property('status', "ACTIVE");
            expect(response).to.have.property('name', updatedDeliveryRule.name);
            expect(response).to.have.property('price', updatedDeliveryRule.price);
            expect(response).to.have.property('distance', updatedDeliveryRule.distance);
            expect(response).to.have.property('minAmount', updatedDeliveryRule.minAmount);
            expect(response.taxConfigIds).to.deep.equal(updatedDeliveryRule.taxConfigIds);
        }));

        cy.waitUntil(() => cy.getDeliveryRuleByID(storeID,updatedDeliveryRule.id).then((response) => {
            console.log(response);
            console.log("Get Delivery Rule response: ", response)
            expect(response).to.have.property('name', updatedDeliveryRule.name);
            expect(response).to.have.property('price', updatedDeliveryRule.price);
            expect(response).to.have.property('distance', updatedDeliveryRule.distance);
            expect(response).to.have.property('minAmount', updatedDeliveryRule.minAmount);
            expect(response.taxConfigIds).to.deep.equal(updatedDeliveryRule.taxConfigIds);
        }));


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        var body = {
            "totalAmount": 10,
            "distance": 5
        }

        cy.waitUntil(() => cy.getDeliveryPriveByMerchantStore(storeID, body).then((deliveryPrice) => {
            console.log(deliveryPrice.body);
            expect(deliveryPrice.body).to.not.be.empty;


        }));

        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.deleteDeliveryRule(storeID,updatedDeliveryRule.id).then((response) => {
            console.log(response);
            console.log("Delete Delivery Rule response: ", response)
            expect(response).to.have.property('status', 200);
        }));


        cy.waitUntil(() => cy.deleteMerchantStore(storeID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));
    });
})
