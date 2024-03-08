describe('API002g2 - Get the TimeZone of different locations', function () {
    it('Verify that the API response contains the correct TimeZone when location is provided in request', function () {
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        
//Verify the Timezone of 5 different locations in Canada
        cy.waitUntil(()=> 
            cy.getTimeZone(43.5675989,-79.6358427).then((response)=>{
            expect(response).to.have.property('zoneName','America/Toronto');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
            cy.getTimeZone(51.5546094,-108.0075602).then((response)=>{
            expect(response).to.have.property('zoneName', 'America/Regina');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
            cy.getTimeZone(54.791116,-127.2292334).then((response)=>{
            expect(response).to.have.property('zoneName','America/Vancouver');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
            cy.getTimeZone(63.6025218,-135.9292137).then((response)=>{
            expect(response).to.have.property('zoneName', 'America/Whitehorse');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
            cy.getTimeZone(53.5558749,-113.772901).then((response)=>{
            expect(response).to.have.property('zoneName', 'America/Edmonton');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

//Verify the Timezone of 5 different locations in US

        cy.waitUntil(()=> 
            cy.getTimeZone(40.6722019,-73.9593254).then((response)=>{
            expect(response).to.have.property('zoneName', 'America/New_York');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
        cy.getTimeZone(44.0695689,-103.2526198).then((response)=>{
        expect(response).to.have.property('zoneName', 'America/Denver');
        console.log("TimeZone verified : " + (response.zoneName))
        }))

         cy.waitUntil(()=> 
         cy.getTimeZone(37.757815,-122.5076401).then((response)=>{
         expect(response).to.have.property('zoneName', 'America/Los_Angeles');
         console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
         cy.getTimeZone(31.4322684,-100.5170777).then((response)=>{
         expect(response).to.have.property('zoneName', 'America/Chicago');
         console.log("TimeZone verified : " + (response.zoneName))
        }))

        cy.waitUntil(()=> 
            cy.getTimeZone(25.7825453,-80.2994988).then((response)=>{
            expect(response).to.have.property('zoneName', 'America/New_York');
            console.log("TimeZone verified : " + (response.zoneName))
        }))

    });
})

