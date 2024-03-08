describe('API006a - Create Addon Group from API', function () {
    it('Business Category: should allow you to create Addon Group from API and then delete', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('aoInfo')

        var aoInfo
        var pgID;
        
        cy.waitUntil(() => cy.get('@aoInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.description = 'Created date: ' + today;            
            aoInfo = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(aoInfo).then((createdAO)=>{
            expect(createdAO).to.have.property('name', aoInfo.name);
            expect(createdAO).to.have.property('description', aoInfo.description);
            pgID = createdAO.id
            console.log(pgID);
            })
        
        );    

        cy.waitUntil(()=> cy.getAllAddonGroupsOfMerchant().then((PGs)=>{
            expect(PGs[PGs.length-1]).to.have.property('name', aoInfo.name);
            expect(PGs[PGs.length-1]).to.have.property('description', aoInfo.description);
            console.log(pgID);
            })
        
        );   

        cy.waitUntil(() => cy.deleteAddonGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
