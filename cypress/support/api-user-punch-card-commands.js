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
import { stringify } from 'json-bigint';

const logging = Cypress.env('fileLogging');


// Get all user's punch card
Cypress.Commands.add('getPunchCards',() => {
    const endpoint = Cypress.env('apiHost') + "/api/user-punch-cards";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET ALL USER\'S PUNCH CARDS ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/punchCards.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get punch card by ID
Cypress.Commands.add('getPunchCardByID',(punchCardID) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-punch-cards/" + punchCardID;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET USER\'S PUNCH CARD ' + punchCardID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/punchCard'+punchCardID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get punch card history by ID
Cypress.Commands.add('getPunchCardHistoryByID',(punchCardID) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-punch-cards/history/" + punchCardID;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET PUNCH CARDS HISTORY OF CARD ' + punchCardID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/punchCard-'+punchCardID+'-history.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Redeem punch card
// {
//     "storeId": 0,
//     "redeemProductList": [
//       {
//         "quantity": 0,
//         "instruction": "string",
//         "productId": 0,
//         "addons": [
//           {
//             "quantity": 0,
//             "instruction": "string",
//             "productId": 0,
//             "addon": true
//           }
//         ],
//         "addon": true
//       }
//     ],
//     "promotionId": 0
// }


// THIS COMMAND IS NOW COMMONLY USED FOR BOTH PUNCH CARD AND REWARD

Cypress.Commands.add('addRedeemItemToCart',(storeID,promotionID,redeemProductList) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/redeem";
    const body = {
        "storeId": storeID,
        "promotionId": promotionID,
        "redeemProductList": redeemProductList
    }
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding:"hex"                
        },'REDEEM CART/STOREID ' + storeID + ' WITH PROMOTION '+promotionID).then((response) => {
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

Cypress.Commands.add('addRedeemItemToCartAllowFail',(storeID,promotionID,redeemProductList) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/redeem";
    const body = {
        "storeId": storeID,
        "promotionId": promotionID,
        "redeemProductList": redeemProductList
    }
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,
            body,
            encoding:"hex"                
        },'REDEEM CART/STOREID ' + storeID + ' WITH PROMOTION '+promotionID).then((response) => {
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

// Remove Redeem Item from cart
Cypress.Commands.add('removeRedeemItemFromCart',(storeID, promotionID) => {
    // const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID +"/"+itemID;
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/redeem/" + storeID +"/promotion/"+promotionID;

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "DELETE",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"
        },'REMOVE REDEEM ITEM OF PROMO#: ' + promotionID +' OUT OF CART: ' + storeID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/cart-'+storeID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})