describe('API006b - Get Addon Group by its ID from API', function () {
    it('Business Category: should allow you to Get as Addon Group by its ID from API and then delete', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('aoInfo')

        var aoInfo
        var aoID;
        
        cy.waitUntil(() => cy.get('@aoInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.description = 'Created date: ' + today;            
            aoInfo = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(aoInfo).then((createdAO)=>{
            expect(createdAO).to.have.property('name', aoInfo.name);
            expect(createdAO).to.have.property('description', aoInfo.description);
            aoID = createdAO.id
            console.log(aoID);
            })
        
        );    

        cy.waitUntil(()=> cy.getAddonGroupByID(aoID).then((ao)=>{
            expect(ao).to.have.property('name', aoInfo.name);
            expect(ao).to.have.property('description', aoInfo.description);
            console.log(aoID);
            })
        
        );   

        cy.waitUntil(() => cy.deleteAddonGroup(aoID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));
    });
})
