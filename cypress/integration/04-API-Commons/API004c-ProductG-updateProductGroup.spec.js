describe('API004c - Update Product Group from API', function () {
    it('Business Category: should allow you to Update Product Group using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/productGroup.json').as('pgInfo')

        var pgInfo
        var pgID;
        
        cy.waitUntil(() => cy.get('@pgInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

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

        cy.waitUntil(() => cy.get('@pgInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.description += '; Updated date: ' + today;
            info.name += ' - Updated';            
            pgInfo = info
        }));

        cy.waitUntil(()=> cy.updateProductGroup(pgInfo, pgID).then((pg)=>{
            expect(pg).to.have.property('name', pgInfo.name);
            expect(pg).to.have.property('description', pgInfo.description);
            console.log(pgID);
            })
        
        );   

        cy.waitUntil(() => cy.deleteProductGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
