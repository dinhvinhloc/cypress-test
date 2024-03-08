describe('API011b - CRUD PunchCard using API', function () {
    it('Business Category: should allow you to Create/Read/Update/Delete the PunchCard Promotion', function () {
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productGroup.json').as('pgInfo1')
        cy.fixture('test-data/productGroup.json').as('pgInfo2')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/product.json').as('productInfo1')
        cy.fixture('test-data/product.json').as('productInfo2')
        cy.fixture('test-data/punchCard.json').as('punchCardInfo')

        var pgInfo1
        var pgInfo2
        var pgID1;
        var pgID2;
        var storeInfo
        var storeID;
        var productInfo1
        var productInfo2
        var product1;
        var product2;
        var punchCardInfo
        var punchCardID;
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

        cy.waitUntil(() => cy.createMerchantStore(storeInfo).then((createdStore) => {
            expect(createdStore).to.have.property('name', storeInfo.name);
            expect(createdStore).to.have.property('description', storeInfo.description);
            expect(createdStore.address).deep.equal(storeInfo.address);
            expect(createdStore).to.have.property('phone', storeInfo.phone);
            expect(createdStore).to.have.property('email', storeInfo.email);
            expect(createdStore.operationTime).deep.equal(storeInfo.operationTime);

            console.log(storeID);
            storeID = createdStore.id
        }));
        // Creating 1st Product Group
        cy.waitUntil(() => cy.get('@pgInfo1').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PG1, Created date: ' + today;
            info.description = 'Created date: ' + today;
            pgInfo1 = info
        }));

        cy.waitUntil(() => cy.createProductGroup(pgInfo1).then((createdPG) => {
            expect(createdPG).to.have.property('name', pgInfo1.name);
            expect(createdPG).to.have.property('description', pgInfo1.description);
            pgID1 = createdPG.id
            console.log(pgID1);
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

        // Creating 1st Product
        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'P1, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(pgID1)
            info.productTaxConfigs = productTaxConfigs;
            productInfo1 = info
            console.log(productInfo1)
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            expect(createdProduct).to.have.property('name', productInfo1.name);
            expect(createdProduct).to.have.property('description', productInfo1.description);
            product1 = createdProduct
            console.log(product1);
        })
        );

        // Creating 2nd Product Group
        cy.waitUntil(() => cy.get('@pgInfo2').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PG2, Created date: ' + today;
            info.description = 'Created date: ' + today;
            pgInfo2 = info
        }));

        cy.waitUntil(() => cy.createProductGroup(pgInfo2).then((createdPG) => {
            expect(createdPG).to.have.property('name', pgInfo2.name);
            expect(createdPG).to.have.property('description', pgInfo2.description);
            pgID2 = createdPG.id
            console.log(pgID2);
        })
        );

        // Creating 2nd Product
        cy.waitUntil(() => cy.get('@productInfo2').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'P2, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(pgID2)
            info.productTaxConfigs = productTaxConfigs;
            productInfo2 = info
            console.log(productInfo2)
        }));

        cy.waitUntil(() => cy.createProduct(productInfo2).then((createdProduct) => {
            expect(createdProduct).to.have.property('name', productInfo2.name);
            expect(createdProduct).to.have.property('description', productInfo2.description);
            product2 = createdProduct
            console.log(product2);
        }));

        cy.waitUntil(() => cy.get('@punchCardInfo').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PunchCard, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.requiredProductList.push({
                "id": product1.id,
                "groupIndex": 0,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": product2.id,
                "groupIndex": 0,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": product1.id,
                "groupIndex": 0,
                "quantity": 1
            });
            info.availableFrom = today;
            info.availableTo = Cypress.dayjs().add(1, 'months').format('YYYY-MM-DDTHH:mm:ssZ');
            punchCardInfo = info
            console.log(punchCardInfo)
        }));

        cy.waitUntil(() => cy.createPunchCard(punchCardInfo).then((createdPunchCard) => {
            console.log(createdPunchCard)
            expect(createdPunchCard).to.have.property('name', punchCardInfo.name);
            expect(createdPunchCard).to.have.property('description', punchCardInfo.description);
            punchCardID = createdPunchCard.id
        }));

        cy.waitUntil(() => cy.getPromotionByID(punchCardID).then((PunchCard) => {
            expect(PunchCard).to.have.property('name', punchCardInfo.name);
            expect(PunchCard).to.have.property('description', punchCardInfo.description);

        }));

        // Login as end user

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

                // Get promotion by Id and assert the information

        cy.waitUntil(() => cy.getPromotionByID(punchCardID).then((PunchCard) => {
            expect(PunchCard).to.have.property('name', punchCardInfo.name);
            expect(PunchCard).to.have.property('description', punchCardInfo.description);
            expect(PunchCard.requiredProductList[0]).to.have.property('id', product1.id);
            expect(PunchCard.requiredProductList[0]).to.have.property('name', product1.name);
            expect(PunchCard.requiredProductList[0]).to.have.property('price', product1.price);
            expect(PunchCard.rewardProductList[0]).to.have.property('id', product2.id);
            expect(PunchCard.rewardProductList[0]).to.have.property('name', product2.name);
            expect(PunchCard.rewardProductList[0]).to.have.property('price', product2.price);
            expect(PunchCard.rewardProductList[1]).to.have.property('id', product1.id);
            expect(PunchCard.rewardProductList[1]).to.have.property('name', product1.name);
            expect(PunchCard.rewardProductList[1]).to.have.property('price', product1.price);
            expect(PunchCard.stores[0]).to.have.property('id', storeID);
            expect(PunchCard.stores[0]).to.have.property('name', storeInfo.name);
        }));


        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.get('@punchCardInfo').then((info) => {
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PunchCard, Updated date: ' + today;
            info.description = 'Updated date: ' + today;
            // info.changedImages.push(imageURLs.logo);
            punchCardInfo = info
        }));

        cy.waitUntil(() => cy.updatePunchCard(punchCardInfo, punchCardID).then((updatedPunchCard) => {
            expect(updatedPunchCard).to.have.property('name', punchCardInfo.name);
            expect(updatedPunchCard).to.have.property('description', punchCardInfo.description);
        }));

        cy.waitUntil(() => cy.deletePromotion(punchCardID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProduct(product1.id).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProductGroup(pgID1).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProduct(product2.id).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteProductGroup(pgID2).then((response) => {
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantStore(storeID).then((response) => {
            expect(response).to.have.property('status', 200);
        }));
    });
})
