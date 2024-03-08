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

Cypress.Commands.add('createAddon',(body) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons";
    
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
        },'CREATE ADDON ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/createdAddon-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('updateAddon',(body,id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/" + id;
    
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
        },'UPDATE ADDON '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/updatedAddon-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('updateAddonStatus',(status,id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/status/" + id;
    
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
            body:stringify(status),
            encoding:"hex"                
        },'UPDATE ADDON: '+id+ ' STATUS: '+ status).then((response) => {return response;})
    })
})


Cypress.Commands.add('updateAddonStatusAllowFail',(status,id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/status/" + id;
    
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
            failOnStatusCode:false,
            body:stringify(status),
            encoding:"hex"                
        },'UPDATE ADDON: '+id+ ' STATUS: '+ status).then((response) => {return response;})
    })
})

Cypress.Commands.add('deleteAddon',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons";
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');

        cy.api({
            method: "DELETE",
                url: `${endpoint}/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'intra-service-name': 'core-deal-service',
                    'Authorization': `Bearer ${token}`
                }
        },'DELETE ADDON '+id).then((response) =>{
            return response;
        })
    })
})

Cypress.Commands.add('purgeAddon',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/purge/"+id;
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
            failOnStatusCode: false
        },'PURGE ADDON '+id).then((response) =>{
            return response;
        })
    })
})

Cypress.Commands.add('getAllAddonsOfMerchant',() => {
    const endpoint = Cypress.env('apiHost') + "/api/addons";
    
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
            encoding: "hex"             
        },'GET MERCHANT\'S ADDON ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/addons.json';            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getAddonsByStore',(storeID) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/store/" + storeID;
    
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
            encoding: "hex"             
        },'GET MERCHANT\'S ADDONS OF STORE: '+storeID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/addons-store-'+storeID+'.json';            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getAddonsByAddonGroup',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/group/" + id;
    
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
            encoding: "hex"             
        },'GET MERCHANT\'S ADDONS OF ADDON GROUP: '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/addons-AddonGroup-'+id+'.json';            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getAddonsByStatus',(status) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/status/"+status;
    
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
            encoding: "hex"             
        },'GET MERCHANT\'S ADDONS BY STATUS: '+status).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/addons-'+status+'.json';            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getAddonByID',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/addons/" + id;
    
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
        },'GET ADDON BY ID: '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotaddon-'+jsonBody.id+'.json';

            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

