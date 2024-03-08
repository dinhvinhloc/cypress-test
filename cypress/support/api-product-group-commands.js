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


Cypress.Commands.add('createProductGroup',(body) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups";
    
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
        },'CREATE PRODUCT GROUP ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/createdProductGroup-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('deleteProductGroup',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups";
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
        },'DELETE PRODUCT GROUP ' + id).then((response) =>{
            return response;
        })
    })
})

Cypress.Commands.add('getAllProductGroupsOfMerchant',() => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups";
    
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
        },'GET MERCHANT\'S PRODUCT GROUPS ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/productGroups.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getProductGroupByID',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups/" + id;
    
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
        },'GET PRODUCT GROUP BY ID '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotProductGroup-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('updateProductGroup',(body,id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups/" + id;
    
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
        },'UPDATE PRODUCT GROUP INFORMATION '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedProductGroupDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('updateProductGroupStatus',(status,id) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups/status/" + id + "/" + status;
    
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
        },status + ' PRODUCT GROUP '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedProductGroupDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})


Cypress.Commands.add('searchProductGroup',(text) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups/search?searchText=" + text;
    
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
        },'SEARCH PRODUCT GROUP '+text).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/searchedProductGroups.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('addOrDeleteProductsToProductGroup',(method,body,pgID) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups/" + pgID + "/products";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: method,
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding:"hex"                
        },method +' PRODUCTS TO PRODUCT GROUP '+pgID).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedProductGroupDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('updateProductsGroupRank',(body) => {
    const endpoint = Cypress.env('apiHost') + "/api/product-groups/rank";
    
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
        },'UPDATE PRODUCT GROUP RANK ').then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedProductGroupsRanks-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})