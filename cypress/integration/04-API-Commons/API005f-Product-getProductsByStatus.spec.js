describe('API005f - Get Merchant\'s Products by Status using API', function () {
    it('Business Category: should allow you to Get Merchant\'s Products by Status using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productGroup.json').as('pgInfo')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/product.json').as('productInfo')

        var pgInfo
        var pgID;
        var storeInfo
        var storeID;
        var productInfo
        var productID;
        var status

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
            info.description = 'Created date: ' + today;
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

        cy.waitUntil(()=> cy.updateProductStatus(status = 'INACTIVE',productID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(()=> cy.getProductsByStatus(status).then((products)=>{
            expect(products[products.length-1]).to.have.property('name', productInfo.name);
            expect(products[products.length-1]).to.have.property('description', productInfo.description);
            expect(products[products.length-1]).to.have.property('status', status);
        })        
        );

        cy.waitUntil(()=> cy.updateProductStatus(status = 'ACTIVE',productID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(()=> cy.getProductsByStatus(status).then((products)=>{
            expect(products[products.length-1]).to.have.property('name', productInfo.name);
            expect(products[products.length-1]).to.have.property('description', productInfo.description);
            expect(products[products.length-1]).to.have.property('status', status);
        })        
        );

        cy.waitUntil(()=> cy.updateProductStatusAllowFail('REDEEMED',productID).then((response)=>{
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(()=> cy.getProductsByStatus(status).then((products)=>{
            expect(products[products.length-1]).to.have.property('name', productInfo.name);
            expect(products[products.length-1]).to.have.property('description', productInfo.description);
            expect(products[products.length-1]).to.have.property('status', status);
        })        
        );

        cy.waitUntil(()=> cy.updateProductStatusAllowFail('REDEEMABLE',productID).then((response)=>{
            expect(response).to.have.property('status', 400);
        }));

        cy.waitUntil(()=> cy.getProductsByStatus(status).then((products)=>{
            expect(products[products.length-1]).to.have.property('name', productInfo.name);
            expect(products[products.length-1]).to.have.property('description', productInfo.description);
            expect(products[products.length-1]).to.have.property('status', status);
        })        
        );

        // Update product status to DELETED was removed
        // cy.waitUntil(()=> cy.updateProductStatus(status = 'DELETED',productID).then((response)=>{
        //     expect(response).to.have.property('status', 200);
        // }));
        
        cy.waitUntil(()=> cy.getProductsByStatus(status).then((products)=>{
            expect(products[products.length-1]).to.have.property('name', productInfo.name);
            expect(products[products.length-1]).to.have.property('description', productInfo.description);
            expect(products[products.length-1]).to.have.property('status', status);
        })        
        );

        cy.waitUntil(() => cy.deleteProduct(productID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProductGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore (storeID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        // Negative Test - Getting Products with the wrong status string.
        cy.waitUntil(()=> cy.getProductsByStatusClone('Improper').then((response)=>{
            if(Array.isArray(response)){
                expect(response).to.be.an('array').that.is.empty;
            }
            else{
                expect(response).to.have.property('status',400);
            }
        })        
        );

    });
})
