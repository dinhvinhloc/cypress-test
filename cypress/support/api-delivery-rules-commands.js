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


Cypress.Commands.add('createDeliveryRule',(storeId,body) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/"+ storeId +"/delivery-rules";
    
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
        },'CREATE DELIVERY RULE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/createdRule-'+jsonBody.name+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('createDeliveryRuleAllowFail',(storeId,body) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/"+ storeId +"/delivery-rules";
    
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
            encoding:"hex",
            failOnStatusCode: false                
        },'CREATE DELIVERY RULE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/createdRule-'+jsonBody.name+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('updateDeliveryRule',(storeId,ruleId,body) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + storeId + "/delivery-rules/"+ruleId;
    
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
        },'UPDATE DELIVERY RULE: '+ruleId).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/createdRule-'+jsonBody.name+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('updateDeliveryRuleStatus',(storeId,ruleId,status) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + storeId + "/delivery-rules/"+ruleId+"/status/"+status;
    
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
            encoding:"hex"                
        },'UPDATE DELIVERY RULE: '+ruleId +" TO "+status).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/createdRule-'+jsonBody.name+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getDeliverRules',(storeId) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/"+storeId+"/delivery-rules";
    
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
        },'GET MERCHANT STORES ').then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/deliveryRules.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getDeliveryRuleByID',(storeId, ruleId) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + storeId +"/delivery-rules/" + ruleId;
    
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
        },'GET DELIVERY RULE '+ ruleId).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/deliveryRuls-'+jsonBody.name+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})


Cypress.Commands.add('deleteDeliveryRule',(storeId, ruleId) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + storeId +"/delivery-rules/" + ruleId;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');

        cy.api({
            method: "DELETE",
                url: `${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'intra-service-name': 'core-deal-service',
                    'Authorization': `Bearer ${token}`
                }
        },'DELETE DELIVERY RULE: '+ruleId).then((response) =>{
            return response;
        })
    })
})


