describe('API007e - Get all Merchant\'s Addons by Status using API', function () {
    it('Business Category: should allow you to Get Merchant\'s Addons by Status using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('agInfo')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/addon.json').as('addonInfo')

        //Store Variables
        var storeInfo;
        var storeID;

        //Addon Group variables
        var agInfo;
        var agID;

        //Addon Variables
        var aoInfo;
        var aoID;

        //Status
        var status;
        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []

        // Get all tax config of the system
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

        // Creating the store
        cy.waitUntil(() => cy.createMerchantStore(storeInfo).then((createdStore) => {
            console.log(createdStore);
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);

            storeID = createdStore.id;
            console.log("Store ID:: ", storeID);
        }));

        // Getting the Addon Group Info from the fixture
        cy.waitUntil(() => cy.get('@agInfo').then((info) => {
            const today = Cypress.dayjs().format('MMM DD, YYYY HH:mm:ss');
            info.description = 'Created date: ' + today;
            agInfo = info
        }));

        // Creating the Addon Group
        cy.waitUntil(() => cy.createAddonGroup(agInfo).then((createdAG) => {
            expect(createdAG).to.have.property('name', agInfo.name);
            expect(createdAG).to.have.property('description', agInfo.description);
            agID = createdAG.id
            console.log("Addon Group Id:: ", agID);
        })
        );

        var productTaxConfigs = []
        
        // Create productTaxConfigs of default tax Ids
        cy.waitUntil(() => 
            cy.wrap(defaultTaxIds).then(()=>{

                var taxConfig1 = {
                    "isDefaultStoreTax": true,
                    "storeId": storeID,
                    "taxConfigIds": defaultTaxIds
                };
                productTaxConfigs.push(taxConfig1);
            })
        );

        // Getting the Addon Information from the fixture
        cy.waitUntil(() => cy.get('@addonInfo').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.hideUntil = today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(agID)
            info.productTaxConfigs = productTaxConfigs;
            aoInfo = info;
            console.log(aoInfo)
        }));

        // Creating the Addon in the Database.
        cy.waitUntil(() => cy.createAddon(aoInfo).then((createdAddon) => {
            expect(createdAddon).to.have.property('name', aoInfo.name);
            expect(createdAddon).to.have.property('description', aoInfo.description);
            aoID = createdAddon.id
            console.log("Addon Id:: ", aoID);
        })
        );

        // Status Updating and Getting Addons By Status
        cy.waitUntil(() => cy.updateAddonStatus(status = 'INACTIVE', aoID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.getAddonsByStatus(status).then((addons) => {
            expect(addons[addons.length - 1]).to.have.property('name', aoInfo.name);
            expect(addons[addons.length - 1]).to.have.property('description', aoInfo.description);
            expect(addons[addons.length - 1]).to.have.property('status', status);
        })
        );

        cy.waitUntil(() => cy.updateAddonStatus(status = 'ACTIVE', aoID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.getAddonsByStatus(status).then((addons) => {
            expect(addons[addons.length - 1]).to.have.property('name', aoInfo.name);
            expect(addons[addons.length - 1]).to.have.property('description', aoInfo.description);
            expect(addons[addons.length - 1]).to.have.property('status', status);
        })
        );

        cy.waitUntil(() => cy.updateAddonStatusAllowFail('REDEEMED', aoID).then((response) => {
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(() => cy.getAddonsByStatus(status).then((addons) => {
            expect(addons[addons.length - 1]).to.have.property('name', aoInfo.name);
            expect(addons[addons.length - 1]).to.have.property('description', aoInfo.description);
            expect(addons[addons.length - 1]).to.have.property('status', status);
        })
        );

        cy.waitUntil(() => cy.updateAddonStatusAllowFail('REDEEMABLE', aoID).then((response) => {
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(() => cy.getAddonsByStatus(status).then((addons) => {
            expect(addons[addons.length - 1]).to.have.property('name', aoInfo.name);
            expect(addons[addons.length - 1]).to.have.property('description', aoInfo.description);
            expect(addons[addons.length - 1]).to.have.property('status', status);
        })
        );

        // Update add-on status to DELETED has been removed
        // cy.waitUntil(() => cy.updateAddonStatus(status = 'DELETED', aoID).then((response) => {
        //     expect(response).to.have.property('status', 200);
        // }));

        cy.waitUntil(() => cy.getAddonsByStatus(status).then((addons) => {
            expect(addons[addons.length - 1]).to.have.property('name', aoInfo.name);
            expect(addons[addons.length - 1]).to.have.property('description', aoInfo.description);
            expect(addons[addons.length - 1]).to.have.property('status', status);
        })
        );

        cy.waitUntil(() => cy.deleteAddon(aoID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddonGroup(agID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore(storeID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));
    });
})
