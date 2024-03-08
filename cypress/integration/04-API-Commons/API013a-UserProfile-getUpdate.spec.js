describe("API013a - Get User Profile and Update User Profile", () => {
    it("Business Category: should allow to get and update the user profile", () => {

        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // To store the user profile data
        let userData;

        // Getting User Profile Details
        cy.waitUntil(()=> cy.getUserProfile().then((data)=>{
            expect(data).to.have.keys('avatarURL', 'dob', 'deliveryAddresses', 'referralUserId','userFullName','receivedRegistrationReward','phone');
            userData = data;
            const today = Cypress.dayjs().subtract('10','years').format('YYYY-MM-DDTHH:mm:ssZ');
            userData.dob = today;
            userData.phone = "+19876543212"
        })); 

        // Updating User Profile Details
        cy.waitUntil(()=> cy.updateUserProfile(userData).then((data)=>{
            // expect(data).to.have.property('dob',userData.dob);
            var originalDate = Cypress.dayjs(userData.dob).format('L');
            console.log("Original Date:: "+originalDate);
            var uploadedDate = Cypress.dayjs(data.dob).format('L');
            console.log("Uploaded Date:: "+uploadedDate);
            expect(originalDate).to.equal(uploadedDate);

        }));
        
        
    })
})
