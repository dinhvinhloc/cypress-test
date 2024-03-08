describe('API002d - Get merchant store information by ID', function () {
    it('Business Category: should allow you to get merchant store information by its id', function () {
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

        cy.waitUntil(()=> cy.createMerchantStore(storeInfo).then((createdStore)=>{
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);
                       
            console.log(storeID);
            storeID = createdStore.id
        }));
        
        cy.waitUntil(()=> cy.getMerchantStoreByID(storeID).then((store)=>{
            expect(store).to.have.property('name', storeInfo.name);
            expect(store).to.have.property('description', storeInfo.description);
            expect(store.address).deep.equal(storeInfo.address);
            expect(store).to.have.property('phone', storeInfo.phone);
            expect(store).to.have.property('email', storeInfo.email);
            expect(store.operationTime).deep.equal(storeInfo.operationTime);
                       
            console.log(storeID);
            // storeID = createdStore.id
        })); 

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
