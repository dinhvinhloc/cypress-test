describe('API004a - Create Product Group from API', function () {
    it('Business Category: should allow you to create Product Groupd from API and then delete', function () {
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
            expect(createdPG).to.have.property('rank', 1);
            pgID = createdPG.id
            console.log(pgID);
            })
        
        );    

        cy.waitUntil(()=> cy.getAllProductGroupsOfMerchant().then((PGs)=>{
            console.log(PGs);
            expect(PGs[0]).to.have.property('name', pgInfo.name);
            expect(PGs[0]).to.have.property('description', pgInfo.description);
            expect(PGs[0]).to.have.property('rank', 1);
            console.log(pgID);
            })
        
        );   

        cy.waitUntil(() => cy.deleteProductGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
