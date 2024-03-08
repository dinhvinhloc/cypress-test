describe('API011f - Get All Promotions of Merchant', function () {
    it('Business Category: should allow you to Get All Promotions of Merchant', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productGroup.json').as('pgInfo1')
        cy.fixture('test-data/productGroup.json').as('pgInfo2')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/product.json').as('productInfo1')
        cy.fixture('test-data/product.json').as('productInfo2')
        cy.fixture('test-data/pointPerk.json').as('pointPerkInfo')
        cy.fixture('test-data/punchCard.json').as('punchCardInfo')
        cy.fixture('test-data/deal.json').as('dealInfo')
        cy.fixture('test-data/reward.json').as('rewardItemInfo')


        var pgInfo1
        var pgInfo2
        var pgID1;
        var pgID2;
        var storeInfo
        var storeID;
        var productInfo1
        var productInfo2
        var productID1;
        var productID2;
        var pointPerkInfo
        var pointPerkID;
        var punchCardInfo
        var punchCardID;
        var dealInfo
        var dealID;
        // Reward Item Variables
        var rewardItemInfo
        var rewardItemID;


        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []
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
        // Creating 1st Product Group
        cy.waitUntil(() => cy.get('@pgInfo1').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PG1, Created date: ' + today;            
            info.description = 'Created date: ' + today;            
            pgInfo1 = info
        }));

        cy.waitUntil(()=> cy.createProductGroup(pgInfo1).then((createdPG)=>{
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
        cy.waitUntil(() => cy.get('@productInfo1').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'P1, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(pgID1)
            info.productTaxConfigs = productTaxConfigs;
            productInfo1 = info
            console.log(productInfo1)
        }));

        cy.waitUntil(()=> cy.createProduct(productInfo1).then((createdProduct)=>{
            expect(createdProduct).to.have.property('name', productInfo1.name);
            expect(createdProduct).to.have.property('description', productInfo1.description);
            productID1 = createdProduct.id
            console.log(productID1);
            })        
        ); 

        // Creating 2nd Product Group
        cy.waitUntil(() => cy.get('@pgInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PG2, Created date: ' + today;            
            info.description = 'Created date: ' + today;            
            pgInfo2 = info
        }));

        cy.waitUntil(()=> cy.createProductGroup(pgInfo2).then((createdPG)=>{
            expect(createdPG).to.have.property('name', pgInfo2.name);
            expect(createdPG).to.have.property('description', pgInfo2.description);
            pgID2 = createdPG.id
            console.log(pgID2);
            })        
        );    
        
        // Creating 2nd Product
        cy.waitUntil(() => cy.get('@productInfo2').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'P2, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.groups.push(pgID2)
            info.productTaxConfigs = productTaxConfigs;
            productInfo2 = info
            console.log(productInfo2)
        }));

        cy.waitUntil(()=> cy.createProduct(productInfo2).then((createdProduct)=>{
            expect(createdProduct).to.have.property('name', productInfo2.name);
            expect(createdProduct).to.have.property('description', productInfo2.description);
            productID2 = createdProduct.id
            console.log(productID2);
        })); 
        
        
        // Create a Point Perk
        
        cy.waitUntil(() => cy.get('@pointPerkInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PointPerk, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.requiredProductList.push({
                "id": productID1,
                "groupIndex": null,
                "quantity": 1
            });
            info.availableFrom = today;
            info.availableTo = Cypress.dayjs().add(1,'months').format('YYYY-MM-DDTHH:mm:ssZ');
            pointPerkInfo = info
            console.log(pointPerkInfo)
        }));

        
        cy.waitUntil(()=> cy.createPointPerk(pointPerkInfo).then((createdPointPerk)=>{
            expect(createdPointPerk).to.have.property('name', pointPerkInfo.name);
            expect(createdPointPerk).to.have.property('description', pointPerkInfo.description);
            pointPerkID = createdPointPerk.id
        }));

        
        // Create a Punch Card
        cy.waitUntil(() => cy.get('@punchCardInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'PunchCard, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.requiredProductList.push({
                "id": productID1,
                "groupIndex": 0,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": productID2,
                "groupIndex": 0,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": productID1,
                "groupIndex": 0,
                "quantity": 1
            });
            info.availableFrom = today;
            info.availableTo = Cypress.dayjs().add(1,'months').format('YYYY-MM-DDTHH:mm:ssZ');
            punchCardInfo = info
            console.log(punchCardInfo)
        }));

        cy.waitUntil(()=> cy.createPunchCard(punchCardInfo).then((createdPunchCard)=>{
            expect(createdPunchCard).to.have.property('name', punchCardInfo.name);
            expect(createdPunchCard).to.have.property('description', punchCardInfo.description);
            punchCardID = createdPunchCard.id
        }));

        
        // Create a Deal
        cy.waitUntil(() => cy.get('@dealInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Deal, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.requiredProductList.push({
                "id": productID1,
                "groupIndex": 0,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": productID2,
                "groupIndex": 1,
                "quantity": 1
            });
            info.availableFrom = today;
            info.availableTo = Cypress.dayjs().add(1,'months').format('YYYY-MM-DDTHH:mm:ssZ');

            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(()=> cy.createDeal(dealInfo).then((createdDeal)=>{
            expect(createdDeal).to.have.property('name', dealInfo.name);
            expect(createdDeal).to.have.property('description', dealInfo.description);
            dealID = createdDeal.id
        }));

        // Create a Reward Item

        cy.waitUntil(() => cy.get('@rewardItemInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Reward Item, Created date: ' + today;
            info.description = 'Created date: ' + today;
            info.stores.push(storeID)
            info.requiredProductList.push({
                "id": productID1,
                "groupIndex": 0,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": productID2,
                "groupIndex": 0,
                "quantity": 1
            });
            info.availableFrom = today;
            info.availableTo = Cypress.dayjs().add(1,'months').format('YYYY-MM-DDTHH:mm:ssZ');
            rewardItemInfo = info
            console.log(rewardItemInfo)
        }));

        cy.waitUntil(()=> cy.createRewardItem(rewardItemInfo).then((createdRewardItem)=>{
            expect(createdRewardItem).to.have.property('name', rewardItemInfo.name);
            expect(createdRewardItem).to.have.property('description', rewardItemInfo.description);
            rewardItemID = createdRewardItem.id
        }));

        cy.waitUntil(()=> cy.getAllPromotionsOfMerchant().then((promotions)=>{
            
            console.log(promotions);
            expect(promotions[promotions.length-1]).to.have.property('name', rewardItemInfo.name);
            expect(promotions[promotions.length-1]).to.have.property('description', rewardItemInfo.description);

            expect(promotions[promotions.length-2]).to.have.property('name', dealInfo.name);
            expect(promotions[promotions.length-2]).to.have.property('description', dealInfo.description);

            expect(promotions[promotions.length-3]).to.have.property('name', punchCardInfo.name);
            expect(promotions[promotions.length-3]).to.have.property('description', punchCardInfo.description);

            expect(promotions[promotions.length-4]).to.have.property('name', pointPerkInfo.name);
            expect(promotions[promotions.length-4]).to.have.property('description', pointPerkInfo.description);

        }));

        // Deleting area
        cy.waitUntil(() => cy.deletePromotion(rewardItemID));
        cy.waitUntil(() => cy.deletePromotion(dealID));
        cy.waitUntil(() => cy.deletePromotion(pointPerkID));
        cy.waitUntil(() => cy.deletePromotion(punchCardID));
        cy.waitUntil(() => cy.deleteProduct(productID1));
        cy.waitUntil(() => cy.deleteProductGroup(pgID1));
        cy.waitUntil(() => cy.deleteProduct(productID2));
        cy.waitUntil(() => cy.deleteProductGroup(pgID2));
        cy.waitUntil(() => cy.deleteMerchantStore (storeID));
    });
})
