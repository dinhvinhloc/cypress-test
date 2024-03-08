describe('API006c - Update Addon Group from API', function () {
    it('Business Category: should allow you to Update Addon Group using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/addonGroup.json').as('aoInfo')

        var aoInfo
        var aoID;
        var imageURL;

        cy.waitUntil(()=>
        cy.uploadMerchantImage('images/logo.jpg').then((response)=>{
            console.log(response);
            expect(response[0]).to.contains('http');
            return imageURL = response;
        }))

        
        cy.waitUntil(() => cy.get('@aoInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.description = 'Created date: ' + today;            
            aoInfo = info
        }));

        cy.waitUntil(()=> cy.createAddonGroup(aoInfo).then((createdao)=>{
            expect(createdao).to.have.property('name', aoInfo.name);
            expect(createdao).to.have.property('description', aoInfo.description);
            aoID = createdao.id
            console.log(aoID);
            })
        
        );    

        cy.waitUntil(() => cy.get('@aoInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

            info.description += '; Updated date: ' + today;
            info.name += ' - Updated';    
            info.changedImages=imageURL;        
            aoInfo = info
        }));

        cy.waitUntil(()=> cy.updateAddonGroup(aoInfo, aoID).then((ao)=>{
            expect(ao).to.have.property('name', aoInfo.name);
            expect(ao).to.have.property('description', aoInfo.description);
            console.log(aoID);
            })
        
        );   

        cy.waitUntil(() => cy.deleteAddonGroup(aoID).then((response)=>{
            expect(response).to.have.property('status', 200);
        }));

        cy.waitUntil(() => cy.deleteMerchantImage(imageURL).then((response)=>{
            console.log(response)
            // expect(response.headers).to.have.property('Status Code', 200);
        }));

    });
})
