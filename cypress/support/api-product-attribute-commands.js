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


Cypress.Commands.add('createProductAttribute',(body) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-attributes";
    
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
        },'CREATE PRODUCT ATTRIBUTE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            console.log(jsonBody);
            var fileName = 'cypress/responses/createdProductAttribute-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('deleteProductAttribute',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-attributes";
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
        },'DELETE PRODUCT ATTRIBUTE ' + id).then((response) =>{
            return response;
        })
    })
})

Cypress.Commands.add('getAllProductAttributesOfMerchant',() => {
    const endpoint = Cypress.env('apiHost') + "/api/product-attributes";
    
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
        },'GET MERCHANT\'S PRODUCT ATTRIBUTES ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            console.log(jsonBody);
            var fileName = 'cypress/responses/ProductAttributes.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getProductAttributeByID',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-attributes/" + id;
    
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
        },'GET PRODUCT ATTRIBUTE BY ID '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotProductAttribute-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('updateProductAttribute',(body,id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-attributes/" + id;
    
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
        },'UPDATE PRODUCT ATTRIBUTE INFORMATION '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            console.log(jsonBody);
            var fileName = 'cypress/responses/updatedProductAttributeDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

