const { stringify } = require("json-bigint");

describe('API002b - Update store information from API', function () {
    it('Business Category: should allow you to update store from API and then delete', function () {
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
                       
            expect(createdStore.serveOptions).deep.equal(storeInfo.serveOptions);           
            console.log(storeID);
            storeID = createdStore.id
        })).wait(2000);
        
        cy.waitUntil(() => cy.get('@storeInfo').then((info)=>{ 
            const updatedDate = Cypress.dayjs().format('MMM DD, YYYY HH:mm:ss');

            info.description += '; Update date: ' + updatedDate;
            info.name += ' - Updated';
            info.serveOptions = [
                "PICKUP",
                "DELIVERY"
            ]
            // info.deliveryRules.push({"name":"Rule 2","distance":5,"price":10,"minAmount":100,"status": "INACTIVE"});;
            console.log(stringify(info));
            storeInfo = info
        }));

        cy.waitUntil(()=> cy.updateMerchantStore(storeInfo,storeID).then((createdStore)=>{
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);
            
            expect(createdStore.serveOptions).deep.equal(["PICKUP","DELIVERY"]);            
            console.log(storeID);
            // storeID = createdStore.id
        }));


        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
