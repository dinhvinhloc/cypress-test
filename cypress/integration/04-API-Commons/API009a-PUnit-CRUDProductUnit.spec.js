describe('API009a - Create Product Unit from API', function () {
    it('Business Category: should allow you to create Product Unit from API and then delete', function () {
        const email = Cypress.env('merchant1');
        const pussword = Cypress.env('merchant1Pass');
        cy.Login(email, pussword);
        cy.fixture('test-data/productUnit.json').as('puInfo')

        var puInfo
        var puID;
        
        cy.waitUntil(() => cy.get('@puInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Name: Created date: ' + today;
            info.description = 'Description: Created date: ' + today;            
            puInfo = info
        }));

        cy.waitUntil(()=> cy.createProductUnit(puInfo).then((createdPU)=>{
            expect(createdPU).to.have.property('name', puInfo.name);
            expect(createdPU).to.have.property('description', puInfo.description);
            puID = createdPU.id
            console.log(puID);
        }));    

        cy.waitUntil(()=> cy.getAllProductUnitsOfMerchant().then((pus)=>{
            expect(pus[pus.length-1]).to.have.property('name', puInfo.name);
            expect(pus[pus.length-1]).to.have.property('description', puInfo.description);
            console.log(puID);
        }));
        
        cy.waitUntil(() => cy.get('@puInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Name: Updated date: ' + today;
            info.description = 'Description: Updated date: ' + today;            
            puInfo = info
        }));

        cy.waitUntil(()=> cy.updateProductUnit(puInfo,puID).then((updatedpu)=>{
            expect(updatedpu).to.have.property('name', puInfo.name);
            expect(updatedpu).to.have.property('description', puInfo.description);
            console.log(puID);
        }));
        
        cy.waitUntil(()=> cy.getProductUnitByID(puID).then((pu)=>{
            console.log(pu);
            expect(pu).to.have.property('name', puInfo.name);
            expect(pu).to.have.property('description', puInfo.description);
        }));

        cy.waitUntil(() => cy.deleteProductUnit(puID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
