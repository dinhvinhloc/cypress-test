describe('API006d - Search Addon Group using API', function () {
    it('Business Category: should allow you to search for Addon Group by matching name or description using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('pgInfo')

        var pgInfo
        var pgID;
        var imageURL;

        cy.waitUntil(()=>
        cy.uploadMerchantImage('images/logo.jpg').then((response)=>{
            console.log(response);
            expect(response[0]).to.contains('http');
            return imageURL = response;
        }))
        
        cy.waitUntil(() => cy.get('@pgInfo').then((info)=>{ 
            const today = Cypress.dayjs();

            info.description = 'Desc' + today;
            info.name = 'Name' + today;
            info.changedImages=imageURL;        
            pgInfo = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(pgInfo).then((createdPG)=>{
            expect(createdPG).to.have.property('name', pgInfo.name);
            expect(createdPG).to.have.property('description', pgInfo.description);
            pgID = createdPG.id
            console.log(pgID);
            })
        
        );    

        cy.waitUntil(()=> cy.searchAddonGroup(pgInfo.name).then((pg)=>{
            expect(pg[0]).to.have.property('name', pgInfo.name);
            expect(pg[0]).to.have.property('description', pgInfo.description);
            console.log(pg);
            })        
        );
        
        cy.waitUntil(()=> cy.searchAddonGroup(pgInfo.description).then((pg)=>{
            expect(pg[0]).to.have.property('name', pgInfo.name);
            expect(pg[0]).to.have.property('description', pgInfo.description);
            console.log(pg);
            })        
        ); 

        cy.waitUntil(() => cy.deleteAddonGroup(pgID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantImage(imageURL).then((response)=>{
            console.log(response)
        }));
    });
})
