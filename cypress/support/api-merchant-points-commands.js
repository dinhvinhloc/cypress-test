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
Cypress.Commands.add('getMerchantPoints',() => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-points";
    
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
        },'GET MERCHANT\'S POINTS ').then((response) => {
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/merchantPoints.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }

            return response.body
        })
    })
})

// Get point by ID
Cypress.Commands.add('getMerchantPointsHistory',() => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-points/history/";
    
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
        },'GET ALL MERCHANT POINTS HISTORY').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/currentMerchantPointsHistory.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})


Cypress.Commands.add('redeemMerchantPoint',(points) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-points/redeem";
    const body = {
        "globalPoints": points
    }
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.wait(1000);
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body              
        },'MERCHANT REDEEM ' + points + ' POINTS ').then((response) => {
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/merchantPoints.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }

            return response.body
        })
    })
})