describe('API005e - Get Merchant\'s Products by Product Group using API', function () {
    it('Business Category: should allow you to Get Merchant\'s Products by Product Group using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productGroup.json').as('pgInfo')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/product.json').as('productInfo')
        cy.fixture('test-data/product.json').as('productInfo2')


        var pgInfo
        var pgID;
        var storeInfo
        var storeID;
        var productInfo
        var productID;
        var productInfo2
        var productID2;

        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []

        var body = {
            "productList": [
              
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
        
        cy.waitUntil(() => cy.get('@pgInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('MMM DD, YYYY HH:mm:ss');

            info.description = 'Created date: ' + today;            
            pgInfo = info
        }));

        cy.waitUntil(()=> cy.createProductGroup(pgInfo).then((createdPG)=>{
            expect(createdPG).to.have.property('name', pgInfo.name);
            expect(createdPG).to.have.property('description', pgInfo.description);
            pgID = createdPG.id
            console.log(pgID);
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

        cy.waitUntil(() => cy.get('@productInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.hideUntil = today;
            info.name = 'Name 1: Created date: ' + today;
            info.description = 'Desc 1: Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(pgID)
            info.productTaxConfigs = productTaxConfigs;
            productInfo = info
            console.log(productInfo)
        }));

        cy.waitUntil(()=> cy.createProduct(productInfo).then((createdProduct)=>{
            expect(createdProduct).to.have.property('name', productInfo.name);
            expect(createdProduct).to.have.property('description', productInfo.description);
            productID = createdProduct.id
            console.log(productID);
            })        
        );        
        
        cy.waitUntil(() => cy.get('@productInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.hideUntil = today;
            info.name = 'Name 2: Created date: ' + today;
            info.description = 'Desc 2: Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(pgID)
            info.productTaxConfigs = productTaxConfigs;
            productInfo2 = info
            console.log(productInfo)
        }));

        cy.waitUntil(()=> cy.createProduct(productInfo2).then((createdProduct)=>{
            expect(createdProduct).to.have.property('name', productInfo2.name);
            expect(createdProduct).to.have.property('description', productInfo2.description);
            productID2 = createdProduct.id
            console.log(productID);
            })        
        );  

        cy.waitUntil(()=> cy.getProductsByProductGroup(pgID).then((products)=>{
            expect(products[0]).to.have.property('name', productInfo.name);
            expect(products[0]).to.have.property('description', productInfo.description);
            expect(products[1]).to.have.property('name', productInfo2.name);
            expect(products[1]).to.have.property('description', productInfo2.description);
            })        
        ); 

        cy.waitUntil(() => cy.deleteProduct(productID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProduct(productID2).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProductGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
