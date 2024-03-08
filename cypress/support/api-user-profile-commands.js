import 'cypress-file-upload';
import '@bahmutov/cy-api/support';
import 'cypress-localstorage-commands';
import 'cypress-wait-until';

// Custom Command to get referral history
Cypress.Commands.add("getReferHistory", () => {
    const endpoint = Cypress.env('apiHost') + "/api/user/user-refer-history/0/0";
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            }
        }, "Get friend invite history").then(response => {
            console.log(response);
            return response.body;
        })
    })
})

// Custom Command to get the User Profile
Cypress.Commands.add("getUserProfile", () => {
    const endpoint = Cypress.env('apiHost') + "/api/user/profile";
    console.log("Endpoint", endpoint);
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            }
        }, "Get Logged In User Profile").then(response => {
            console.log(response);
            return response.body;
        })
    })
})

// Custom Command check if user can add a referrer
Cypress.Commands.add("checkUserReferred", () => {
    const endpoint = Cypress.env('apiHost') + "/api/user/referral";
    console.log("Endpoint", endpoint);
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            }
        }, "Check if user can add a referrer").then(response => {
            console.log(response);
            return response.body;
        })
    })
})

// Custom Command to update the user profile
Cypress.Commands.add("updateUserProfile", (body) => {
    const endpoint = Cypress.env('apiHost') + "/api/user/profile";
    console.log("Endpoint", endpoint);
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            },
            body
        }, "Update User Profile").then(response => {
            console.log(response);
            return response.body;
        })
    })
})

// Custom Command to Add the Delivery Address
Cypress.Commands.add("addDeliveryAddress", (body) => {
    const endpoint = Cypress.env('apiHost') + "/api/user/profile/delivery-address";
    console.log("Endpoint", endpoint);
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            },
            body
            // encoding: "hex"
        }, "Adding the Delivery Address").then(response => {
            return response.body;
        })
    })
})


// Custom Command to Update the Delivery Address
Cypress.Commands.add("updateDeliveryAddress", (id, body) => {
     
    const endpoint = Cypress.env('apiHost') + "/api/user/profile/delivery-address/" + id;
    console.log("Endpoint", endpoint);
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "PUT",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            },
            body,
        }, "Update the Delivery Address").then(response => {
            return response.body;
        })
    })
})

// Custom Command to Delete the Delivery Address
Cypress.Commands.add("deleteDeliveryAddress", (id) => {
     
    const endpoint = Cypress.env('apiHost') + "/api/user/profile/delivery-address/" + id;
    console.log("Endpoint", endpoint);
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "DELETE",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'intra-service-name': 'core-deal-service',
            },
        }, "Delete the Delivery Address").then(response => {
            return response.body;
        })
    })
});

Cypress.Commands.add('uploadUserProfileAvatar', function(fixtureName) {
    const endpoint = Cypress.env('apiHost') + "/api/user/profile/avatar";
    return cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const headers = [{ name: 'Authorization', value: `Bearer ${token}` },
        { name: 'intra-service-name', value: 'core-deal-service' }];
        return cy.fixture(fixtureName, 'binary').then(function(binary) {
            const blob = Cypress.Blob.binaryStringToBlob(binary, 'image/jpeg')
                const formData = new FormData();
                formData.set('file', blob, 'tmpFile.jpg');
                const request = new XMLHttpRequest();
                request.open('POST', endpoint, false);
                if (headers) {
                    headers.forEach(function(header) {
                    request.setRequestHeader(header.name, header.value);
                });
                }
                request.send(formData);
                console.log(request.response)
                return request.response;
            
        });

    })    
});