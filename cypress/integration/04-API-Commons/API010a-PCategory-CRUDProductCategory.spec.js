describe('API010a - Create Product Category from API', function () {
    it('Business Category: should allow you to create Product Categoryd from API and then delete', function () {
        const email = Cypress.env('merchant1');
        const pcssword = Cypress.env('merchant1Pass');
        cy.Login(email, pcssword);
        cy.fixture('test-data/productCategory.json').as('pcInfo')

        var pcInfo
        var pcID;
        
        cy.waitUntil(() => cy.get('@pcInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Name: Created date: ' + today;
            info.description = 'Description: Created date: ' + today;            
            pcInfo = info
        }));

        cy.waitUntil(()=> cy.createProductCategory(pcInfo).then((response)=>{
            expect(response).to.have.property('businessType', "Food/Beverage");
            expect(response).to.have.property('name', pcInfo.name);
            expect(response).to.have.property('description', pcInfo.description);
            pcID = response.id
            console.log(pcID);
        }));    

        cy.waitUntil(()=> cy.createProductCategoryAllowFail(pcInfo).then((response)=>{
            expect(response).to.have.property('status', 400);
            console.log(response);
        })); 

        cy.waitUntil(()=> cy.getAllProductCategoriesOfMerchant().then((pcs)=>{
            console.log(pcs)
            let names = pcs.map(a => a.name);
            let descriptions = pcs.map(a => a.description);
            expect(names).to.have.contains(pcInfo.name);
            expect(descriptions).to.have.contains(pcInfo.description);
            // console.log(pcID);
        }));
        
        cy.waitUntil(() => cy.get('@pcInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Name: Updated date: ' + today;
            info.description = 'Description: Updated date: ' + today;            
            pcInfo = info
        }));

        cy.waitUntil(()=> cy.updateProductCategory(pcInfo,pcID).then((response)=>{
            expect(response).to.have.property('businessType', "Food/Beverage");
            expect(response).to.have.property('name', pcInfo.name);
            expect(response).to.have.property('description', pcInfo.description);
            console.log(pcID);
        }));
        

        cy.waitUntil(()=> cy.getProductCategoryByID(pcID).then((pc)=>{
            console.log(pc);
            expect(pc).to.have.property('name', pcInfo.name);
            expect(pc).to.have.property('description', pcInfo.description);
        }));

        cy.waitUntil(()=> cy.updateProductCategoryAllowFail(pcInfo,pcID).then((response)=>{
            expect(response).to.have.property('status', 400);
            console.log(response);
        }));

        cy.waitUntil(() => cy.deleteProductCategory(pcID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
