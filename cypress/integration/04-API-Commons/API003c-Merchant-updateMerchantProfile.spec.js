describe('API003c - Update Merchant Profile using API', function () {
    it('Business Category: should allow you to update merchant profile using API', function () {
        const email = Cypress.env('merchant1');
        const password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.fixture('test-data/merchantProfile.json').as('merchantInfo')

        var merchantInfo
        var merchantID;
        
        cy.waitUntil(() => cy.get('@merchantInfo').then((info)=>{ 
            const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
            info.name = 'Merchant: ' + email
            info.description = 'Updated date: ' + today;            
            merchantInfo = info
        }));

        cy.waitUntil(()=> cy.updateMerchantProfile(merchantInfo).then((merchant)=>{
            expect(merchant).to.have.property('name', merchantInfo.name);
            expect(merchant).to.have.property('description', merchantInfo.description);
            expect(merchant.address).deep.equal(merchantInfo.address);
            expect(merchant).to.have.property('phone', merchantInfo.phone);
            expect(merchant).to.have.property('email', merchantInfo.email);
            expect(merchant.businessLines).deep.equal(merchantInfo.businessLines);
            console.log(merchantID);
            merchantID = merchant.id
        }));    

    });
})
