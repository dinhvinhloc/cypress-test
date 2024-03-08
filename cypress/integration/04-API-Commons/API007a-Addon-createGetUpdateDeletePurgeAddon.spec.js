describe('API007a - Create/Get/Update/Update Status/Delete/Purge Addon using API', function () {
    it('Business Category: should allow you to Create/Get/Update/Update Status/Delete/Purge Addon using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('agInfo')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/addon.json').as('addonInfo')

        var agInfo
        var aoID;
        var storeInfo;
        var storeID;
        var addonInfo;
        var addonID;
        var status;

        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []

        var body = {
            "addons": [
              
            ]
          };

        // Get all tax config of the system
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
        
        cy.waitUntil(() => cy.get('@agInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('MMM DD, YYYY HH:mm:ss');

            info.description = 'Created date: ' + today;            
            agInfo = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(agInfo).then((createdPG)=>{
            expect(createdPG).to.have.property('name', agInfo.name);
            expect(createdPG).to.have.property('description', agInfo.description);
            aoID = createdPG.id
            console.log(aoID);
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

        cy.waitUntil(() => cy.get('@addonInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.hideUntil = today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(aoID)
            info.productTaxConfigs = productTaxConfigs;
            addonInfo = info
            console.log(addonInfo)
        }));

        cy.waitUntil(()=> cy.createAddon(addonInfo).then((createdAddon)=>{
            expect(createdAddon).to.have.property('name', addonInfo.name);
            expect(createdAddon).to.have.property('description', addonInfo.description);
            addonID = createdAddon.id
            console.log(addonID);
        })        
        ); 

        cy.waitUntil(() => cy.get('@addonInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.hideUntil = today;
            info.name += '; Updated date: ' + today;
            info.description += '; Updated date: ' + today;
            info.productTaxConfigs = productTaxConfigs;
            addonInfo = info
            console.log(addonInfo)
        }));

        cy.waitUntil(()=> cy.updateAddon(addonInfo, addonID).then((updatedAddon)=>{
            expect(updatedAddon).to.have.property('name', addonInfo.name);
            expect(updatedAddon).to.have.property('description', addonInfo.description);
            console.log(addonID);
        })        
        );
        
        cy.waitUntil(()=> cy.getAddonByID(addonID).then((addon)=>{
            expect(addon).to.have.property('name', addonInfo.name);
            expect(addon).to.have.property('description', addonInfo.description);
            console.log(addonID);
        })        
        ); 

        cy.waitUntil(()=> cy.updateAddonStatus(status = 'INACTIVE',addonID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(()=> cy.getAddonByID(addonID).then((addon)=>{
            expect(addon).to.have.property('status', status);
        })); 

        cy.waitUntil(()=> cy.updateAddonStatus(status = 'ACTIVE',addonID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(()=> cy.getAddonByID(addonID).then((addon)=>{
            expect(addon).to.have.property('status', status);
        })); 

        cy.waitUntil(()=> cy.updateAddonStatusAllowFail('REDEEMED',addonID).then((response)=>{
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(()=> cy.getAddonByID(addonID).then((addon)=>{
            expect(addon).to.have.property('status', status);
        })); 

        cy.waitUntil(()=> cy.updateAddonStatusAllowFail('REDEEMABLE',addonID).then((response)=>{
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(()=> cy.getAddonByID(addonID).then((addon)=>{
            expect(addon).to.have.property('status', status);
        })); 

        // Update add-on status to DELETED has been removed
        // cy.waitUntil(()=> cy.updateAddonStatus(status = 'DELETED',addonID).then((response)=>{
        //     expect(response).to.have.property('status', 200);
        // }));
        
        cy.waitUntil(()=> cy.getAddonByID(addonID).then((addon)=>{
            expect(addon).to.have.property('status', status);
        }));

        cy.waitUntil(() => cy.deleteAddon(addonID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddonGroup(aoID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        // Purge Add-on has been removed.
        // cy.waitUntil(() => cy.purgeAddon(addonID).then((response)=>{
        //     expect(response).to.have.property('status', 200);
        // }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
