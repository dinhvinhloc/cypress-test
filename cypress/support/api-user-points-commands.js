/*
 * Login to a specific user
 * @param {string} username
 * @param {string} password
 * @returns {string} - returns auth token cookie string when chained with .then()
 */
import 'cypress-file-upload';
import '@bahmutov/cy-api/support';
import 'cypress-localstorage-commands';
const JSONbig = require('json-bigint')({ 'storeAsString': true });
import { hex2ascii } from 'hex2ascii';
import 'cypress-wait-until';

const logging = Cypress.env('fileLogging');


// Get all user's point
Cypress.Commands.add('getUserPoints',() => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.wait(1000);
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET ALL USER\'S POINTS ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/points.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get point by ID
Cypress.Commands.add('getPointHistoryByMerchantID',(merchantID) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points/history/" + merchantID;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.wait(1000);
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET POINTS HISTORY OF MERCHANT ' + merchantID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/pointOfMerchant'+merchantID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get global point configuration
Cypress.Commands.add('getGlobalPointConfig',() => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points/config";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            }
        },'GET GLOBAL POINT CONFIGURATION ').then((response) => {
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/points.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }
            return response.body
        })
    })
})

// Get global point
Cypress.Commands.add('getGlobalPoint',() => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points/global";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.wait(1000);
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            }              
        },'GET ALL USER\'S GLOBAL POINT ').then((response) => {
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/globalPoint.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }
            return response.body
        })
    })
})

// Get global point history
Cypress.Commands.add('getGlobalPointHistory',() => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points/history/global/0/20";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.wait(1000);
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET GLOBAL POINTS HISTORY').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/globalPointHistory.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get global point history
Cypress.Commands.add('getGlobalPointHistorySummary',() => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points/history/global/summary";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.wait(1000);
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET GLOBAL POINTS HISTORY SUMMARY').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/globalPointHistorySummary.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// THIS COMMAND IS NOW OBSOLETE. REFER TO api-user-punch-card-commands.js FOR THE COMMON REDEEM COMMAND.
Cypress.Commands.add('redeemPoint',(storeID,promotionID,pointID,redeemProductList) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-points/" + pointID + "/redeem";
    const body = {
        "storeId": storeID,
        "redeemProductList": redeemProductList,
        "promotionId": promotionID
    }
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "PUT",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding:"hex"                
        },'REDEEM CART ' + storeID + ' WITH PROMOTION '+promotionID + ' AND POINT ID ' + pointID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/redeem-order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})