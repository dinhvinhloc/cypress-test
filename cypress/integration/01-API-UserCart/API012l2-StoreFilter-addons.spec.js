const { upperCase } = require("lodash");

describe('API012l2 - Check the availability of all store items based on configuration - Addon  ', function () {
    it('GET store detail by storeId - filter as Addon configuration', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        
        var email
        var password        
        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        let temp
        let temp2
        cy.wrap(store1).then(()=>{
            temp = Object.assign({}, store1.AG3AO1)
            temp2 = Object.assign({}, store1.AG3AO2)
        })

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE AG3AO1
        cy.waitUntil(() => cy.updateAddonStatus("INACTIVE",temp.id));



        // GET Store detail and check that
        // AG3AO1 is not in the products list
        // AG3 should not contain AG3AO1

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // console.log(storeInfo.addons)
            // let result = objArray.map(a => a.foo);
            let addonIDList = storeInfo.addons.map(a => a.id);
            expect(addonIDList).to.not.contain(temp.id);
            
            cy.wrap(storeInfo.addonGroups).each((group)=>{
                if (group.id == store1.AG3.id){
                    expect(group.products).to.not.contain(temp.id);
                } 
            })
            // console.log(addonIDList)
        })); 


        
        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        //---------------------
        // Set INACTIVE AG3AO2
        cy.waitUntil(() => cy.updateAddonStatus("INACTIVE",temp2.id));



        // GET Store detail and check that
        // AG3AO1/2 is not in the products list
        // AG3 should not in addonGroups

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.getMerchantStoreDetailByID(store1.storeID.id).then((storeInfo)=>{
            // console.log(storeInfo.addons)
            // let result = objArray.map(a => a.foo);
            let addonIDList = storeInfo.addons.map(a => a.id);
            let addonGroupIDList = storeInfo.addonGroups.map(a => a.id);
            expect(addonIDList).to.not.contain(temp2.id);
            expect(addonGroupIDList).to.not.contain(store1.AG3.id);

        })); 
        
        // ---------------------
        // Reset AG3AO1/2 to original
        
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.updateAddon(store1.AG3AO1,store1.AG3AO1.id));
        cy.waitUntil(() => cy.updateAddon(store1.AG3AO2,store1.AG3AO2.id));

    });
})
