describe('000 - Setup Test data', function () {
    it('Setup: Store, Products, Addons, Promotions', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var stores = [];
        var storeItems = {};
        var storeDataFile = 'cypress/fixtures/test-data/created-data/stores.json';
        var taxDataFile = 'cypress/fixtures/test-data/created-data/tax_config.json';

        cy.fixture('test-data/productGroup.json').as('pgInfo1')
        cy.fixture('test-data/productGroup.json').as('pgInfo2')
        cy.fixture('test-data/storeInfo.json').as('storeInfo')
        cy.fixture('test-data/product.json').as('productInfo1')
        cy.fixture('test-data/product.json').as('productInfo2')
        cy.fixture('test-data/addonGroup.json').as('agInfo1')
        cy.fixture('test-data/addonGroup.json').as('agInfo2')
        cy.fixture('test-data/addon.json').as('addonInfo1')
        cy.fixture('test-data/addon.json').as('addonInfo2')
        cy.fixture('test-data/pointPerk.json').as('pointPerkInfo')
        cy.fixture('test-data/punchCard.json').as('punchCardInfo')
        cy.fixture('test-data/deal.json').as('dealInfo')
        cy.fixture('test-data/reward.json').as('rewardItemInfo')
        cy.fixture('test-data/delivery-rule.json').as('deliveryRule')


        var pgInfo1
        var pgInfo2
        var storeInfo
        var productInfo1
        var productInfo2
        var agInfo1
        var addonInfo1
        var agInfo2
        var addonInfo2
        var pointPerkInfo
        var punchCardInfo
        var dealInfo
        var rewardItemInfo
        var taxInfo
        var defaultTaxIds = []
        var gstHstTaxIds = []
        var taxExempt = []
        var productTaxConfigs = []
        var productTaxConfigsHstAndGstOnly = []
        const yesterday = Cypress.dayjs().add(-1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
        const nextMonth = Cypress.dayjs().add(1, 'months').format('YYYY-MM-DDTHH:mm:ssZ')


        //Get all tax config of the system
        cy.waitUntil(() => cy.getTaxConfig().then((taxInfoResponse) => {
            taxInfo = taxInfoResponse
        }));

        // cy.waitUntil(() => 
        cy.wrap(taxInfo).then(() => {
            cy.writeFile(taxDataFile, taxInfo)
        })
        // );

        cy.waitUntil(() => cy.get('@storeInfo').then((info) => {

            info.name = 'Merchant ' + email + ' Store'
            info.description = 'Created: ' + yesterday;
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
            storeItems.storeID = createdStore

            // Delivery Rule is no longer created along with store creation
            // To maintain the compatibility of test, created an offline deliveryRules array to store delivery rules info.
            storeItems.storeID.deliveryRules = [];
            console.log("Created store: ", createdStore)
        }));


        // Create productTaxConfigs of default tax Ids
        cy.waitUntil(() =>
            cy.wrap(defaultTaxIds).then(() => {

                var taxConfig1 = {
                    "isDefaultStoreTax": true,
                    "storeId": storeItems.storeID.id,
                    "taxConfigIds": defaultTaxIds
                };
                productTaxConfigs.push(taxConfig1);
            })
        );

        // Create productTaxConfigs of custom tax Ids
        cy.waitUntil(() =>
            cy.wrap(gstHstTaxIds).then(() => {

                var taxConfig1 = {
                    "isDefaultStoreTax": false,
                    "storeId": storeItems.storeID.id,
                    "taxConfigIds": gstHstTaxIds
                };
                productTaxConfigsHstAndGstOnly.push(taxConfig1);
            })
        );


        // Create productTaxConfigs of exempt tax
        // cy.waitUntil(() => 
        cy.wrap().then(() => {

            var taxConfig1 = {
                "isDefaultStoreTax": false,
                "storeId": storeItems.storeID.id,
                "taxConfigIds": []
            };
            taxExempt.push(taxConfig1);
        })
        // );

        // ------------- CREATE DELIVERY RULES


        var deliveryRule;
        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '1 km - Default Tax';
            info.price = 1;
            info.distance = 1;
            info.minAmount = 0;
            info.taxConfigIds = defaultTaxIds
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));

        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '5 km - HST and GST';
            info.price = 10;
            info.distance = 5;
            info.minAmount = 0;
            info.taxConfigIds = gstHstTaxIds
            info.isDefaultStoreTax = false
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));


        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '10 km - Tax exempt';
            info.price = 10.11;
            info.distance = 10;
            info.minAmount = 0;
            info.taxConfigIds = []
            info.isDefaultStoreTax = false
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));

        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '15 km - Default Tax';
            info.price = 15;
            info.distance = 15;
            info.minAmount = 0;
            info.taxConfigIds = defaultTaxIds
            info.isDefaultStoreTax = true
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));

        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '20 km - Default Tax';
            info.price = 20;
            info.distance = 20;
            info.minAmount = 0;
            info.taxConfigIds = defaultTaxIds
            info.isDefaultStoreTax = true
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));

        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '25 km - Default Tax';
            info.price = 25;
            info.distance = 25;
            info.minAmount = 0;
            info.taxConfigIds = defaultTaxIds
            info.isDefaultStoreTax = true
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));

        cy.waitUntil(() => cy.get('@deliveryRule').then((info) => {

            info.name = '30 km - Default Tax';
            info.price = 30;
            info.distance = 30;
            info.minAmount = 0;
            info.taxConfigIds = defaultTaxIds
            info.isDefaultStoreTax = true
            deliveryRule = info
        }));

        cy.waitUntil(() => cy.createDeliveryRule(storeItems.storeID.id, deliveryRule).then((response) => {
            storeItems.storeID.deliveryRules.push(response);
        }));

        //-------------- CREATE ADDONS
        // ADDON GROUP 1, ADDON 1 and 2
        // ADDON GROUP 1 -> TAX EXEMPT
        cy.waitUntil(() => cy.get('@agInfo1').then((info) => {

            info.name = 'AG1 - Tax Exempt';
            info.description = 'AG1 - Tax Exempt' + yesterday;
            agInfo1 = info
        }));

        cy.waitUntil(() => cy.createAddonGroup(agInfo1).then((createdAG) => {
            storeItems.AG1 = createdAG
        }));

        cy.waitUntil(() => cy.get('@addonInfo1').then((info) => {

            info.price = 0.556
            info.name = 'AG1AO1 - Tax Exempt';
            info.description = '$' + info.price + '-AG1AO1-' + yesterday;
            info.stores.push(storeItems.storeID.id)
            info.groups.push(storeItems.AG1.id)
            info.productTaxConfigs = taxExempt;

            addonInfo1 = info
        }));

        cy.waitUntil(() => cy.createAddon(addonInfo1).then((createdAddon) => {
            storeItems.AG1AO1 = createdAddon
        }));

        cy.waitUntil(() => cy.get('@addonInfo1').then((info) => {

            info.price = 1.99
            info.name = 'AG1AO2 - Tax Exempt';
            info.description = '$' + info.price + '-AG1AO2-' + yesterday;
            info.productTaxConfigs = taxExempt;

            addonInfo1 = info
        }));

        cy.waitUntil(() => cy.createAddon(addonInfo1).then((createdAddon) => {
            storeItems.AG1AO2 = createdAddon
        }));

        // ADDON GROUP 2, ADDON 1 and 2
        // ADDON GROUP 2 -> CUSTOM TAX
        cy.waitUntil(() => cy.get('@agInfo2').then((info) => {

            info.name = 'AG2 - HST and GST';
            info.description = 'AG2' + yesterday;
            agInfo2 = info
        }));

        cy.waitUntil(() => cy.createAddonGroup(agInfo2).then((createdAG) => {
            storeItems.AG2 = createdAG
        }));

        cy.waitUntil(() => cy.get('@addonInfo2').then((info) => {

            info.price = 3.05
            info.name = 'AG2AO1 - HST and GST';
            info.description = '$' + info.price + '-AG2AO1-' + yesterday;
            info.stores.push(storeItems.storeID.id)
            info.groups.push(storeItems.AG2.id)
            info.productTaxConfigs = productTaxConfigsHstAndGstOnly;

            addonInfo2 = info
        }));

        cy.waitUntil(() => cy.createAddon(addonInfo2).then((createdAddon) => {
            storeItems.AG2AO1 = createdAddon
        }));

        cy.waitUntil(() => cy.get('@addonInfo2').then((info) => {

            info.price = 3.9
            info.name = 'AG2AO2 - HST and GST';
            info.description = '$' + info.price + '-AG2AO2-' + yesterday;
            info.productTaxConfigs = productTaxConfigsHstAndGstOnly;

            addonInfo2 = info
        }));

        cy.waitUntil(() => cy.createAddon(addonInfo2).then((createdAddon) => {
            storeItems.AG2AO2 = createdAddon
        }));

        // ADDON GROUP 3, ADDON 1 and 2
        // ADDON GROUP 3 -> DEFAULT TAX
        cy.waitUntil(() => cy.get('@agInfo2').then((info) => {

            info.name = 'AG3 - Default Tax';
            info.description = 'AG3' + yesterday;
            info.forcedMax = 99;

            agInfo2 = info
        }));

        cy.waitUntil(() => cy.createAddonGroup(agInfo2).then((createdAG) => {
            storeItems.AG3 = createdAG
        }));

        cy.waitUntil(() => cy.get('@addonInfo2').then((info) => {

            info.price = 4.954
            info.name = 'AG3AO1 - Default Tax';
            info.description = '$' + info.price + '-AG3AO1-' + yesterday;
            info.stores = []
            info.groups = []
            info.stores.push(storeItems.storeID.id)
            info.groups.push(storeItems.AG3.id)
            info.productTaxConfigs = productTaxConfigs;

            addonInfo2 = info
        }));

        cy.waitUntil(() => cy.createAddon(addonInfo2).then((createdAddon) => {
            storeItems.AG3AO1 = createdAddon
        }));

        cy.waitUntil(() => cy.get('@addonInfo2').then((info) => {

            info.price = 6
            info.name = 'AG3AO2 - Default Tax';
            info.description = '$' + info.price + '-AG3AO2-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            addonInfo2 = info
        }));

        cy.waitUntil(() => cy.createAddon(addonInfo2).then((createdAddon) => {
            storeItems.AG3AO2 = createdAddon
        }));

        // Creating 1st Product Group
        // PRODUCT GROUP 1 -> TAX EXEMPT

        cy.waitUntil(() => cy.get('@pgInfo1').then((info) => {

            info.name = 'PG1 - Tax Exempt';
            info.description = 'PG1, ' + yesterday;
            pgInfo1 = info
        }));

        cy.waitUntil(() => cy.createProductGroup(pgInfo1).then((createdPG) => {
            storeItems.PG1 = createdPG
        }));

        // Creating 3 Products in the 1st group
        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 14.555
            info.name = 'PG1P1 - Tax Exempt';
            info.description = '$' + info.price + '-PG1P1-' + yesterday;
            info.stores.push(storeItems.storeID.id)
            info.groups.push(storeItems.PG1.id)
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.productTaxConfigs = taxExempt;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG1P1 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 19.99
            info.name = 'PG1P2 - Tax Exempt';
            info.description = '$' + info.price + '-PG1P2-' + yesterday;
            info.productTaxConfigs = taxExempt;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG1P2 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 25.1
            info.name = 'PG1P3 - Tax Exempt';
            info.description = '$' + info.price + '-PG1P3-' + yesterday;
            info.productTaxConfigs = taxExempt;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG1P3 = createdProduct
        }));

        // Creating 2nd Product Group
        // PRODUCT GROUP 2 -> HST AND GST 
        cy.waitUntil(() => cy.get('@pgInfo2').then((info) => {

            info.name = 'PG2 - HST and GST';
            info.description = 'PG2' + yesterday;
            pgInfo2 = info
        }));

        cy.waitUntil(() => cy.createProductGroup(pgInfo2).then((createdPG) => {
            storeItems.PG2 = createdPG
        }));

        // Creating 2 Products in Group 2
        cy.waitUntil(() => cy.get('@productInfo2').then((info) => {

            info.price = 30.5
            info.name = 'PG2P1 - HST and GST';
            info.description = '$' + info.price + '-PG2P1-' + yesterday;
            info.stores.push(storeItems.storeID.id)
            info.groups.push(storeItems.PG2.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.productTaxConfigs = productTaxConfigsHstAndGstOnly;

            productInfo2 = info
            console.log(productInfo2)
        }));

        cy.waitUntil(() => cy.createProduct(productInfo2).then((createdProduct) => {
            storeItems.PG2P1 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo2').then((info) => {

            info.price = 34.9
            info.name = 'PG2P2 - HST and GST';
            info.description = '$' + info.price + '-PG2P2-' + yesterday;
            info.productTaxConfigs = productTaxConfigsHstAndGstOnly;

            productInfo2 = info
            console.log(productInfo2)
        }));

        cy.waitUntil(() => cy.createProduct(productInfo2).then((createdProduct) => {
            storeItems.PG2P2 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo2').then((info) => {

            info.price = 39.99
            info.name = 'PG2P3 - HST and GST';
            info.description = '$' + info.price + '-PG2P3-' + yesterday;
            info.productTaxConfigs = productTaxConfigsHstAndGstOnly;

            productInfo2 = info
            console.log(productInfo2)
        }));

        cy.waitUntil(() => cy.createProduct(productInfo2).then((createdProduct) => {
            storeItems.PG2P3 = createdProduct
        }));


        // Creating 3rd Product Group
        // PRODUCT GROUP 3 -> DEFAULT TAX
        cy.waitUntil(() => cy.get('@pgInfo1').then((info) => {

            info.name = 'PG3 - Default Tax';
            info.description = 'PG3, ' + yesterday;
            pgInfo1 = info
        }));

        cy.waitUntil(() => cy.createProductGroup(pgInfo1).then((createdPG) => {
            storeItems.PG3 = createdPG
        }));

        // Creating 2 Products in the 3rd group
        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 44.959
            info.name = 'PG3P1 - Default Tax';
            info.description = '$' + info.price + '-PG3P1-' + yesterday;
            info.groups = [];
            info.addonGroups = [];
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.addonGroups.push(storeItems.AG3.id)
            info.groups.push(storeItems.PG3.id)
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P1 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 49.95
            info.name = 'PG3P2 - Default Tax';
            info.description = '$' + info.price + '-PG3P2-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P2 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 54.996
            info.name = 'PG3P3 - Default Tax';
            info.description = '$' + info.price + '-PG3P3-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P3 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 60.014
            info.name = 'PG3P4 - Default Tax';
            info.description = '$' + info.price + '-PG3P4-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P4 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 70.09
            info.name = 'PG3P5 - Default Tax';
            info.description = '$' + info.price + '-PG3P5-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P5 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 80.01
            info.name = 'PG3P6 - Default Tax';
            info.description = '$' + info.price + '-PG3P6-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P6 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 90
            info.name = 'PG3P7 - Default Tax';
            info.description = '$' + info.price + '-PG3P7-' + yesterday;
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG3P7 = createdProduct
        }));

        // Creating 4th Product Group
        // PRODUCT GROUP 4 -> DEFAULT TAX
        cy.waitUntil(() => cy.get('@pgInfo1').then((info) => {

            info.name = 'PG4 - Default Tax';
            info.description = 'PG4, ' + yesterday;
            pgInfo1 = info
        }));

        cy.waitUntil(() => cy.createProductGroup(pgInfo1).then((createdPG) => {
            storeItems.PG4 = createdPG
        }));

        // Creating Products in the 4th group
        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 0.2
            info.name = 'PG4P1 - Default Tax';
            info.description = '$' + info.price + '-PG4P1-' + yesterday;
            info.groups = [];
            info.addonGroups = [];
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.addonGroups.push(storeItems.AG3.id)
            info.groups.push(storeItems.PG4.id)
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG4P1 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 4.9
            info.name = 'PG4P2 - Default Tax';
            info.description = '$' + info.price + '-PG4P2-' + yesterday;
            info.groups = [];
            info.addonGroups = [];
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.addonGroups.push(storeItems.AG3.id)
            info.groups.push(storeItems.PG4.id)
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG4P2 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 5.9
            info.name = 'PG4P3 - Default Tax';
            info.description = '$' + info.price + '-PG4P3-' + yesterday;
            info.groups = [];
            info.addonGroups = [];
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.addonGroups.push(storeItems.AG3.id)
            info.groups.push(storeItems.PG4.id)
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG4P3 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 6.9
            info.name = 'PG4P4 - Default Tax';
            info.description = '$' + info.price + '-PG4P4-' + yesterday;
            info.groups = [];
            info.addonGroups = [];
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.addonGroups.push(storeItems.AG3.id)
            info.groups.push(storeItems.PG4.id)
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG4P4 = createdProduct
        }));

        cy.waitUntil(() => cy.get('@productInfo1').then((info) => {

            info.price = 7.9
            info.name = 'PG4P5 - Default Tax';
            info.description = '$' + info.price + '-PG4P5-' + yesterday;
            info.groups = [];
            info.addonGroups = [];
            info.addonGroups.push(storeItems.AG1.id)
            info.addonGroups.push(storeItems.AG2.id)
            info.addonGroups.push(storeItems.AG3.id)
            info.groups.push(storeItems.PG4.id)
            info.productTaxConfigs = productTaxConfigs;

            productInfo1 = info
        }));

        cy.waitUntil(() => cy.createProduct(productInfo1).then((createdProduct) => {
            storeItems.PG4P5 = createdProduct
        }));


        // Create a Combo Deal

        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.discountAmount = 10;
            info.requiredAmount = 20;
            info.couponCode = "APICOMBO"
            info.name = 'DIS $10 COMBO PG1P1PG2P1PG3P1';
            info.description = 'DIS $10 COMBO PG1P1PG2P1PG3P1; CODE: ' + info.couponCode + "; " + yesterday;
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList.push({
                "id": storeItems.PG1P1.id,
                "groupIndex": 0,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG2P1.id,
                "groupIndex": 1,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG3P1.id,
                "groupIndex": 2,
                "quantity": 2
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;


            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.deal10CADPG1P1PG2P1PG3P1 = createdDeal
            console.log("********** COMBO DEAL **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_MULTI_COMBO');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** COMBO DEAL **********")

        }));

        // Create a Bundle Deal
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "100CADBIG";
            info.name = 'BUNDLE $100';
            info.description = 'BUNDLE $100 PG1P3 PG2P3 PG3P3; CODE: ' + info.couponCode + "; " + yesterday;
            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.requiredAmount = 0;

            info.requiredProductList.push({
                "id": storeItems.PG1P3.id,
                "groupIndex": 0,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG2P3.id,
                "groupIndex": 1,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG3P3.id,
                "groupIndex": 2,
                "quantity": 1
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.fixedAmount = 100
            info.discountAmount = null
            info.isPublicAvailable = true;
            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.bundle100CADP3ALLGROUP = createdDeal
            console.log("********** BUNDLE DEAL **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_MULTI_BUNDLE');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** BUNDLE DEAL **********")
        }));

        // Create a Point Perk

        cy.waitUntil(() => cy.get('@pointPerkInfo').then((info) => {

            info.rewardPoints = 7000
            info.couponCode = "APIPOINT"
            info.name = 'PP PG3P6 or PG3P7';
            info.description = 'PP PG3P6 or PG3P7 7000 POINTS: ' + yesterday;
            info.description = 'PP 7000 POINTS PER 1xPG3P6 or 1xPG3P7 PURCHASE; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores.push(storeItems.storeID.id)
            info.requiredProductList.push({
                "id": storeItems.PG3P6.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG3P7.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;

            pointPerkInfo = info
            console.log(pointPerkInfo)
        }));


        cy.waitUntil(() => cy.createPointPerk(pointPerkInfo).then((createdPointPerk) => {
            storeItems.pointPerkPG3P5 = createdPointPerk
            console.log("********** POINT PERK **********")
            console.log(createdPointPerk)
            expect(createdPointPerk).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(createdPointPerk).to.have.property('type', 'POINT_PERK');
            console.log("********** POINT PERK **********")
        }));

        // Create a Punch Card
        cy.waitUntil(() => cy.get('@punchCardInfo').then((info) => {

            info.couponCode = "APIPUNCH"
            info.name = 'PC 3xPG1P2 or 3xPG1P3';
            info.description = 'PC 3xPG1P2 or 3xPG1P3 - PG1P1PG1P2; CODE: ' + info.couponCode + "; " + yesterday;
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList.push({
                "id": storeItems.PG1P2.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG1P3.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": storeItems.PG1P1.id,
                "groupIndex": null,
                "quantity": 2
            });
            info.rewardProductList.push({
                "id": storeItems.PG1P2.id,
                "groupIndex": null,
                "quantity": 2
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.requiredPunches = 3;
            info.rewardItems = 2;
            info.rewardPoints = 1
            punchCardInfo = info
            console.log(punchCardInfo)
        }));

        cy.waitUntil(() => cy.createPunchCard(punchCardInfo).then((createdPunchCard) => {
            storeItems.punchCardPG1P2 = createdPunchCard

            console.log("********** PUNCH CARD **********")
            console.log(createdPunchCard)
            expect(createdPunchCard).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(createdPunchCard).to.have.property('type', 'PUNCH_CARD');

            console.log("********** PUNCH CARD **********")
        }));

        // Create a Free item
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "APIFREE";
            info.name = 'FREE PG3P1 AT $250 BILL';
            info.description = 'FREE PG3P1 FOR $250 BILL; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.isMaster = true
            info.rewardProductList.push({
                "id": storeItems.PG3P1.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.discountPercent = 100;
            info.requiredAmount = 250;

            info.availableFrom = yesterday;
            info.availableTo = nextMonth;

            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.freePG3P1At250 = createdDeal
            console.log("********** FREE ITEM **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_FREE_ITEM');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** FREE ITEM **********")
        }));

        // Create a Free item
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "APIFREE300";
            info.name = 'FREE PG3P2 AT $300 BILL';
            info.description = 'FREE PG3P2 FOR $300 BILL; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.isMaster = true
            info.rewardProductList.push({
                "id": storeItems.PG3P2.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.discountPercent = 100;
            info.requiredAmount = 250;

            info.availableFrom = yesterday;
            info.availableTo = nextMonth;

            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.freePG3P2At250 = createdDeal
            console.log("********** FREE ITEM 300 **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_FREE_ITEM');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** FREE ITEM 300 **********")
        }));

        // Create another Free item Deal
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "APIFREE600";
            info.name = 'FREE PG3P3 AT $600 BILL';
            info.description = 'FREE PG3P3 FOR $600 BILL; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.isMaster = true
            info.rewardProductList.push({
                "id": storeItems.PG3P3.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.discountPercent = 100;
            info.requiredAmount = 600;

            info.availableFrom = yesterday;
            info.availableTo = nextMonth;

            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.freePG3P3At600 = createdDeal
            console.log("********** FREE ITEM @ $600 **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_FREE_ITEM');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** FREE ITEM @ $600 **********")
        }));

        // Create a Buy one Free One
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "BOFOAPI";
            info.name = 'BUY PG3P4 FREE PG1P1';
            info.description = 'BUY PG3P4 FREE PG1P1; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.requiredProductList.push({
                "id": storeItems.PG3P4.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": storeItems.PG1P1.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.discountPercent = 100;
            info.requiredAmount = 0;

            info.availableFrom = yesterday;
            info.availableTo = nextMonth;

            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.boPG3P4foPG1P1 = createdDeal
            console.log("********** BUY ONE GET ONE **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_BUY_ONE_GET_ONE');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** BUY ONE GET ONE **********")
        }));

        // Create a Discount on Item
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "10PERCENT";
            info.name = 'DISCOUNT10%PG2P2';
            info.description = 'DISCOUNT10%PG2P2; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.rewardProductList.push({
                "id": storeItems.PG2P2.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.discountPercent = 10;
            info.requiredAmount = 0;

            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.isPublicAvailable = true;
            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.dis10PerPG2P2 = createdDeal
            console.log("********** DISCOUNT ITEM **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_DISCOUNT_ITEMS_P');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** DISCOUNT ITEM **********")
        }));

        // Create a Fixed Discount on Cart
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "20CADON200";
            info.name = 'DISCOUNT 20CAD CART $200';
            info.description = 'DISCOUNT 20CAD CART $200; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.requiredAmount = 200;
            info.discountAmount = 20;
            info.discountPercent = null;
            info.fixedAmount = null;


            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.isPublicAvailable = true;
            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.dis20CADONCART200CAD = createdDeal
            console.log("********** DISCOUNT CART FIXED **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_DISCOUNT_CART_F');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** DISCOUNT CART FIXED **********")
        }));

        // Create a Hidden Fixed Discount on Cart
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "HIDDEN";
            info.name = 'HIDDEN 20CAD DISCOUNT';
            info.description = 'HIDDEN 20CAD DISCOUNT; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.requiredAmount = 30;
            info.discountAmount = 20;
            info.discountPercent = null;
            info.fixedAmount = null;


            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.isPublicAvailable = false;
            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.hiddenDiscount20CAD = createdDeal
            console.log("********** DISCOUNT CART FIXED HIDDEN **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_DISCOUNT_CART_F');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** DISCOUNT CART FIXED HIDDEN **********")
        }));

        // Create a Percent Discount on Cart
        cy.waitUntil(() => cy.get('@dealInfo').then((info) => {

            info.couponCode = "10PERON300";
            info.name = 'DISCOUNT 10% CART $300';
            info.description = 'DISCOUNT 10% CART $300; CODE: ' + info.couponCode + "; " + yesterday;

            info.stores = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList = []
            info.rewardProductList = [];
            info.discountAmount = null;
            info.requiredAmount = 300;
            info.discountPercent = 10;
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.isPublicAvailable = true;

            dealInfo = info
            console.log(dealInfo)
        }));

        cy.waitUntil(() => cy.createDeal(dealInfo).then((createdDeal) => {
            storeItems.dis10PERONCART300CAD = createdDeal
            console.log("********** DISCOUNT CART PERCENT **********")
            console.log(createdDeal)
            expect(createdDeal).to.have.property('dealType', 'DEAL_DISCOUNT_CART_P');
            expect(createdDeal).to.have.property('type', 'DEAL');
            console.log("********** DISCOUNT CART PERCENT **********")
        }));


        // Create a Reward Item

        cy.waitUntil(() => cy.get('@rewardItemInfo').then((info) => {

            info.name = 'REWARD PG1P2';
            info.description = 'REWARD PG1P2 FOR 20000 POINTS: ' + yesterday;

            info.requiredProductList = []
            info.rewardProductList = []
            info.stores.push(storeItems.storeID.id)

            info.rewardProductList.push({
                "id": storeItems.PG1P2.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.requiredPoints = 20000
            rewardItemInfo = info
            console.log(rewardItemInfo)
        }));

        cy.waitUntil(() => cy.createRewardItem(rewardItemInfo).then((createdRewardItem) => {
            storeItems.rewardPG1P2 = createdRewardItem
            console.log("********** REWARD ITEM **********")
            console.log(createdRewardItem)
            expect(createdRewardItem).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(createdRewardItem).to.have.property('type', 'REWARD_ITEM');
            console.log("********** REWARD ITEM **********")
        }));


        // Create a Punch Card
        cy.waitUntil(() => cy.get('@punchCardInfo').then((info) => {

            info.couponCode = "APIPUNCH2"
            info.name = 'PC PG4P2 or PG4P3';
            info.description = 'PC PG4P2 or PG4P3; CODE: ' + info.couponCode + "; " + yesterday;
            info.stores = []
            info.requiredProductList = []
            info.rewardProductList = []
            info.stores.push(storeItems.storeID.id)
            info.requiredProductList.push({
                "id": storeItems.PG4P2.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.requiredProductList.push({
                "id": storeItems.PG4P3.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": storeItems.PG4P2.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": storeItems.PG4P3.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.requiredPunches = 5;
            info.rewardItems = 1;
            info.rewardPoints = 1
            punchCardInfo = info
            console.log(punchCardInfo)
        }));

        cy.waitUntil(() => cy.createPunchCard(punchCardInfo).then((createdPunchCard) => {
            storeItems.punchCardPG4P2PG4P3 = createdPunchCard

            console.log("********** PUNCH CARD **********", createdPunchCard.name)
            console.log(createdPunchCard)
            expect(createdPunchCard).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(createdPunchCard).to.have.property('type', 'PUNCH_CARD');

            console.log("********** PUNCH CARD **********", createdPunchCard.name)
        }));


        // Create a Reward Item

        cy.waitUntil(() => cy.get('@rewardItemInfo').then((info) => {

            info.name = 'REWARD PG4P4/PG4P5';
            info.description = 'REWARD PG4P4/PG4P5 FOR 10000 POINTS: ' + yesterday;
            info.stores = []
            info.requiredProductList = []
            info.rewardProductList = []
            info.stores.push(storeItems.storeID.id)

            info.rewardProductList.push({
                "id": storeItems.PG4P4.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.rewardProductList.push({
                "id": storeItems.PG4P5.id,
                "groupIndex": null,
                "quantity": 1
            });
            info.availableFrom = yesterday;
            info.availableTo = nextMonth;
            info.requiredPoints = 10000
            rewardItemInfo = info
            console.log(rewardItemInfo)
        }));

        cy.waitUntil(() => cy.createRewardItem(rewardItemInfo).then((createdRewardItem) => {
            storeItems.rewardPG4P4 = createdRewardItem
            console.log("********** REWARD ITEM **********")
            console.log(createdRewardItem)
            expect(createdRewardItem).to.have.property('dealType', 'DEAL_UNKNOWN');
            expect(createdRewardItem).to.have.property('type', 'REWARD_ITEM');
            console.log("********** REWARD ITEM **********")
        }));

        var productGroupsRank

        cy.wrap(storeItems).then(() => {
            productGroupsRank = {
                "productGroups": [
                    {
                        "id": storeItems.PG1.id,
                        "rank": 1
                    },
                    {
                        "id": storeItems.PG2.id,
                        "rank": 2
                    },
                    {
                        "id": storeItems.PG3.id,
                        "rank": 3
                    },
                    {
                        "id": storeItems.PG4.id,
                        "rank": 4
                    }
                ]
            }
        })


        cy.waitUntil(() => cy.updateProductsGroupRank(productGroupsRank).then((response) => {
            console.log("********** PRODUCT GROUPS RANKS **********")
            console.log(response)
            expect(response[0].id).to.equal(storeItems.PG1.id);
            expect(response[0].rank).to.equal(1);
            expect(response[1].id).to.equal(storeItems.PG2.id);
            expect(response[1].rank).to.equal(2);
            expect(response[2].id).to.equal(storeItems.PG3.id);
            expect(response[2].rank).to.equal(3);
            expect(response[3].id).to.equal(storeItems.PG4.id);
            expect(response[3].rank).to.equal(4);
            console.log("********** PRODUCT GROUPS RANKS **********")
        }));


        cy.waitUntil(() => cy.getAllProductGroupsOfMerchant().then((response) => {
            console.log("********** PRODUCT GROUPS RANKS **********")
            console.log(response)
            expect(response[0].id).to.equal(storeItems.PG1.id);
            expect(response[0].rank).to.equal(1);
            expect(response[1].id).to.equal(storeItems.PG2.id);
            expect(response[1].rank).to.equal(2);
            expect(response[2].id).to.equal(storeItems.PG3.id);
            expect(response[2].rank).to.equal(3);
            expect(response[3].id).to.equal(storeItems.PG4.id);
            expect(response[3].rank).to.equal(4);
            console.log("********** PRODUCT GROUPS RANKS **********")
        }));

        // cy.waitUntil(()=>{
        cy.wrap(stores.push(storeItems)).then(() => {
            cy.writeFile(storeDataFile, stores)
        })
        // })
    });
})
