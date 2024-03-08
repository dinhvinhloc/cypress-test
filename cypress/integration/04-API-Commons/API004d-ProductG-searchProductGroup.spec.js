describe('API004d - Search Product Group using API', function () {
    it('Business Category: should allow you to search for Product Group by matching name or description using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productGroup.json').as('pgInfo')

        var pgInfo
        var pgID;
        
        cy.waitUntil(() => cy.get('@pgInfo').then((info)=>{ 
            const today = Cypress.dayjs();

            info.description = 'Desc' + today;
            info.name = 'Name' + today;
            pgInfo = info
        }));

        cy.waitUntil(()=> cy.createProductGroup(pgInfo).then((createdPG)=>{
            expect(createdPG).to.have.property('name', pgInfo.name);
            expect(createdPG).to.have.property('description', pgInfo.description);
            pgID = createdPG.id
            console.log(pgID);
            })
        
        );    

        cy.waitUntil(()=> cy.searchProductGroup(pgInfo.name).then((pg)=>{
            expect(pg[0]).to.have.property('name', pgInfo.name);
            expect(pg[0]).to.have.property('description', pgInfo.description);
            console.log(pg);
            })        
        );
        
        cy.waitUntil(()=> cy.searchProductGroup(pgInfo.description).then((pg)=>{
            expect(pg[0]).to.have.property('name', pgInfo.name);
            expect(pg[0]).to.have.property('description', pgInfo.description);
            console.log(pg);
            })        
        ); 

        cy.waitUntil(() => cy.deleteProductGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
