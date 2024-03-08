const { stringify } = require("json-bigint");

describe('API002c - Update store status', function () {
    it('Business Category: should allow you to update store to difference statues from API and then delete', function () {
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
        
        cy.waitUntil(()=> cy.updateMerchantStoreStatus(status = 'INACTIVE',storeID).then((store)=>{
            expect(store).to.have.property('status', status);
            console.log(store.status);
        }));

        cy.waitUntil(()=> cy.updateMerchantStoreStatus(status = 'ACTIVE',storeID).then((store)=>{
            expect(store).to.have.property('status', status);
            console.log(store.status);
        }));
        cy.waitUntil(()=> cy.updateMerchantStoreStatus(status = 'REDEEMED',storeID).then((store)=>{
            expect(store).to.have.property('status', status);
            console.log(store.status);
        }));
        cy.waitUntil(()=> cy.updateMerchantStoreStatus(status = 'REDEEMABLE',storeID).then((store)=>{
            expect(store).to.have.property('status', status);
            console.log(store.status);
        }));
        cy.waitUntil(()=> cy.updateMerchantStoreStatus(status = 'DELETED',storeID).then((store)=>{
            expect(store).to.have.property('status', status);
            console.log(store.status);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        // Negative Test
        cy.waitUntil(() => cy.get('@storeInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.description = 'Created date ' + today;            
            storeInfo = info;
            storeInfo.name = "Negative Status Store";
        }));

        cy.waitUntil(()=> cy.createMerchantStore(storeInfo).then((createdStore)=>{
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);
                       
            console.log("Negative Test Store ID:: "+storeID);
            storeID = createdStore.id
        }));

        cy.waitUntil(()=> cy.updateMerchantStoreStatusClone(status = 'IMPROPER',storeID).then((response)=>{
            // Status IMPROPER is not valid
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));




    });
})
