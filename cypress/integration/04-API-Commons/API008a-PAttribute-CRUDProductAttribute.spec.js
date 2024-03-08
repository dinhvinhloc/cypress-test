describe('API008a - Create Product Attribute from API', function () {
    it('Business Category: should allow you to create Product Attributed from API and then delete', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productAttribute.json').as('paInfo')

        var paInfo
        var paID;
        
        cy.waitUntil(() => cy.get('@paInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Name: Created date: ' + today;
            info.description = 'Description: Created date: ' + today;            
            paInfo = info
        }));

        cy.waitUntil(()=> cy.createProductAttribute(paInfo).then((createdPA)=>{
            expect(createdPA).to.have.property('name', paInfo.name);
            expect(createdPA).to.have.property('description', paInfo.description);
            paID = createdPA.id
            console.log(paID);
        }));    

        cy.waitUntil(()=> cy.getAllProductAttributesOfMerchant().then((PAs)=>{
            expect(PAs[PAs.length-1]).to.have.property('name', paInfo.name);
            expect(PAs[PAs.length-1]).to.have.property('description', paInfo.description);
            console.log(paID);
        }));
        
        cy.waitUntil(() => cy.get('@paInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Name: Updated date: ' + today;
            info.description = 'Description: Updated date: ' + today;            
            paInfo = info
        }));

        cy.waitUntil(()=> cy.updateProductAttribute(paInfo,paID).then((updatedPA)=>{
            expect(updatedPA).to.have.property('name', paInfo.name);
            expect(updatedPA).to.have.property('description', paInfo.description);
            console.log(paID);
        }));
        
        cy.waitUntil(()=> cy.getProductAttributeByID(paID).then((pa)=>{
            console.log(pa);
            expect(pa).to.have.property('name', paInfo.name);
            expect(pa).to.have.property('description', paInfo.description);
        }));

        cy.waitUntil(() => cy.deleteProductAttribute(paID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
