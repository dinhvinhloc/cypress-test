describe("API013b - CRUD Delivery Address of the User using API", () => {
    it("Business Category: should allow to Create/Read/Update/Delete the Delivery Address of the User profile", () => {

        const email = Cypress.env('enduser0001');
        const password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // User Profile Fixture
        cy.fixture('test-data/userProfile.json').as('userProfileInfo')

        // Supporting Variables 
        var address;
        var address2;
        var addressId;
        var totalLength;

        // Getting User Profile Details
        cy.waitUntil(() => cy.getUserProfile().then((data) => {
            expect(data).to.have.keys('avatarURL', 'dob', 'deliveryAddresses', 'referralUserId','userFullName','receivedRegistrationReward','phone');
            totalLength = data.deliveryAddresses.length;
        }));

        cy.waitUntil(() => cy.get('@userProfileInfo').then((info) => {
            address = info.deliveryAddresses[0];
        }));

        // Adding the Delivery Address to the User Profile
        cy.waitUntil(() => cy.addDeliveryAddress(address).then((userProfile) => {
            console.log("adding started");
            // Note: Newly inserted address is always at the index of 0 instead of last in the array
            addressId = 0;
            const lastAddress = userProfile.deliveryAddresses[addressId];
            console.log(lastAddress);
            expect(lastAddress).to.have.property('streetNumber', address.streetNumber);
            expect(lastAddress).to.have.property('unit', address.unit);
            expect(lastAddress).to.have.property('streetName', address.streetName);
            expect(lastAddress).to.have.property('postalCode', address.postalCode);
            expect(lastAddress).to.have.property('city', address.city);
            expect(lastAddress).to.have.property('province', address.province);
            expect(lastAddress).to.have.property('country', address.country);
            expect(lastAddress.location).deep.equal(address.location);
            console.log("adding ended");
        }));

        cy.waitUntil(() => cy.get('@userProfileInfo').then((info) => {
            address2 = info.deliveryAddresses[0];
            address2.streetName = "Updated";
            address2.city = "Updated";
        }));

        //Updating the Delivery Address in the User Profile
        cy.waitUntil(() => cy.updateDeliveryAddress(addressId, address2).then((userProfile) => {
            console.log("update started");
            let updatedAddress = userProfile.deliveryAddresses[addressId];
            expect(updatedAddress).to.have.property('streetName', address2.streetName);
            expect(updatedAddress).to.have.property('city', address2.city);
            console.log("update ended");
        }));

        cy.waitUntil(() => cy.deleteDeliveryAddress(addressId).then((userProfile) => {
            expect(userProfile.deliveryAddresses.length).to.equal(totalLength);
        }));
    })
})
