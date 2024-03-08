describe('API006e - Add Addon to Addon Group using API', function () {
    it('Business Category: should allow you to add Addons to Prodduct Group', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('aoInfo1')
        cy.fixture('test-data/addonGroup.json').as('aoInfo2')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/addon.json').as('addonInfo1')
        cy.fixture('test-data/addon.json').as('addonInfo2')


        var aoInfo1
        var aoInfo2
        var aoID1;
        var aoID2;
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
        cy.waitUntil(() => cy.get('@aoInfo1').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'ao1, Created date: ' + today;            
            info.description = 'Created date: ' + today;            
            aoInfo1 = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(aoInfo1).then((createdAO)=>{
            expect(createdAO).to.have.property('name', aoInfo1.name);
            expect(createdAO).to.have.property('description', aoInfo1.description);
            aoID1 = createdAO.id
            console.log(aoID1);
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
            info.groups.push(aoID1)
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
        cy.waitUntil(() => cy.get('@aoInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'ao2, Created date: ' + today;            
            info.description = 'Created date: ' + today;
            info.productTaxConfigs = productTaxConfigs;            
            aoInfo2 = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(aoInfo2).then((createdAO)=>{
            expect(createdAO).to.have.property('name', aoInfo2.name);
            expect(createdAO).to.have.property('description', aoInfo2.description);
            aoID2 = createdAO.id
            console.log(aoID2);
            })        
        );    
        
        // Creating 2nd Addon
        cy.waitUntil(() => cy.get('@addonInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'P2, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(aoID2)
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

        cy.waitUntil(()=> cy.addOrDeleteAddonsToAddonGroup('PUT',body, aoID1).then((info)=>{
            console.log(info);
        }))

        cy.waitUntil(()=> cy.getAddonGroupByID(aoID1).then((ao)=>{
            expect(ao).to.have.property('name', aoInfo1.name);
            expect(ao).to.have.property('description', aoInfo1.description);
            expect(ao.products).to.contains(addonID2);
        }));  

        cy.waitUntil(() => cy.deleteAddon(addonID1).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddonGroup(aoID1).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddon(addonID2).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteAddonGroup(aoID2).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
