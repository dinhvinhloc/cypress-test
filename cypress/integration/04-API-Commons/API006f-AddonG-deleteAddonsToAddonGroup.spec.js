describe('API006f - Delete Addon to Addon Group using API', function () {
    it('Business Category: should allow you to Delete Addons from Prodduct Group', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('agInfo1')
        cy.fixture('test-data/addonGroup.json').as('agInfo2')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/addon.json').as('addonInfo1')
        cy.fixture('test-data/addon.json').as('addonInfo2')


        var agInfo1
        var agInfo2
        var agID1;
        var agID2;
        var storeInfo
        var storeID;
        var addonInfo1
        var addonInfo2
        var addonID1;
        var addonID2;

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
        // Creating 1st Addon Group
        cy.waitUntil(() => cy.get('@agInfo1').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.name = 'AG1, Created date: ' + today;            
            info.description = 'Created date: ' + today;            
            agInfo1 = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(agInfo1).then((createdAG)=>{
            expect(createdAG).to.have.property('name', agInfo1.name);
            expect(createdAG).to.have.property('description', agInfo1.description);
            agID1 = createdAG.id
            console.log(agID1);
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

        // Creating 1st Addon
        cy.waitUntil(() => cy.get('@addonInfo1').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.name = 'P1, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(agID1)
            info.productTaxConfigs = productTaxConfigs;
            addonInfo1 = info
            console.log(addonInfo1)
        }));

        cy.waitUntil(()=> cy.createAddon(addonInfo1).then((createdAddon)=>{
            expect(createdAddon).to.have.property('name', addonInfo1.name);
            expect(createdAddon).to.have.property('description', addonInfo1.description);
            addonID1 = createdAddon.id
            console.log(addonID1);
            })        
        ); 

        // Creating 2nd Addon Group
        cy.waitUntil(() => cy.get('@agInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.name = 'ag2, Created date: ' + today;            
            info.description = 'Created date: ' + today;            
            agInfo2 = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(agInfo2).then((createdag)=>{
            expect(createdag).to.have.property('name', agInfo2.name);
            expect(createdag).to.have.property('description', agInfo2.description);
            agID2 = createdag.id
            console.log(agID2);
            })        
        );    
        
        // Creating 2nd Addon
        cy.waitUntil(() => cy.get('@addonInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.name = 'P2, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(agID2)
            info.productTaxConfigs = productTaxConfigs;
            addonInfo2 = info
            console.log(addonInfo2)
        }));

        cy.waitUntil(()=> cy.createAddon(addonInfo2).then((createdAddon)=>{
            expect(createdAddon).to.have.property('name', addonInfo2.name);
            expect(createdAddon).to.have.property('description', addonInfo2.description);
            addonID2 = createdAddon.id
            console.log(addonID2);
            })        
        ); 
        
        cy.waitUntil(()=>
            body.addons.push(addonID2)
        );

        cy.waitUntil(()=> cy.addOrDeleteAddonsToAddonGroup('PUT',body, agID1).then((info)=>{
            console.log(info);
        }))

        cy.waitUntil(()=> cy.getAddonGroupByID(agID1).then((ag)=>{
            expect(ag).to.have.property('name', agInfo1.name);
            expect(ag).to.have.property('description', agInfo1.description);
            expect(ag.products).to.contains(addonID2);
        }));
        
        cy.waitUntil(()=> cy.addOrDeleteAddonsToAddonGroup('DELETE',body, agID1).then((info)=>{
            console.log(info);
        }))

        cy.waitUntil(()=> cy.getAddonGroupByID(agID1).then((ag)=>{
            expect(ag).to.have.property('name', agInfo1.name);
            expect(ag).to.have.property('description', agInfo1.description);
            expect(ag.products).to.not.contains(addonID2);
        }));  


        cy.waitUntil(() => cy.deleteAddon(addonID1).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddonGroup(agID1).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddon(addonID2).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddonGroup(agID2).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
