describe('API002a - Create store from API', function () {
    it('Business Category: should allow you to create store from API and then delete', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        var taxDataFile = 'cypress/fixtures/test-data/created-data/tax_config.json';

        var storeInfo
        var storeID;
        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []

        //Get all tax config of the system
        cy.waitUntil(()=> cy.getTaxConfig().then((taxInfoResponse)=>{
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

        // Set all Delivery Rules to have default tax
        cy.waitUntil(() =>
            cy.wrap(storeInfo.deliveryRules).each((deliveryRule) => {
                deliveryRule.taxConfigIds = defaultTaxIds;
                deliveryRule.isDefaultStoreTax = true;
            })
        );
        cy.waitUntil(() => cy.createMerchantStore(storeInfo).then((createdStore) => {
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);
            // 
            expect(createdStore.serveOptions).deep.equal(storeInfo.serveOptions);
            console.log(storeID);
            storeID = createdStore.id
        }));

        cy.waitUntil(() => cy.deleteMerchantStore(storeID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        // Negative Test
        cy.waitUntil(() => cy.get('@storeInfo').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.description = 'Created date: ' + today;
            storeInfo = info;
            storeInfo.name = "Negative Test Store";
            // improper email format
            storeInfo.email = "sample_text";
            // improper phone format
            storeInfo.phone = "sample_text";
        }));

        cy.waitUntil(() => cy.createMerchantStoreClone(storeInfo).then((response) => {
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 400);
            expect(response.message).to.contain("Please enter valid email address");
            expect(response.message).to.contain("Please enter valid phone number format +xxxxxxxxxxx");
        }));



    });
})
