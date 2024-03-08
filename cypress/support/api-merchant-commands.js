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
import axios, { AxiosResponse } from 'axios'
const logging = Cypress.env('fileLogging');


Cypress.Commands.add('createMerchantStore',(body) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding:"hex"                
        },'CREATE STORE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/createdMerchantStore-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

// Clone for Testing the Negative Scenario.
Cypress.Commands.add('createMerchantStoreClone',(body) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            failOnStatusCode: false,
            encoding:"hex"                
        },'CREATE STORE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/createdMerchantStore-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('updateMerchantStore',(body,id) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "PUT",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding:"hex"                
        },'UPDATE STORE INFORMATION: '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedMerchantStoreDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('updateMerchantStoreStatus',(status,id) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id +"/" +status;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "PUT",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'UPDATE STORE: '+id+ ' STATUS: '+status).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedMerchantStoreDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

// Negative Test Clone for Merchant Status
Cypress.Commands.add('updateMerchantStoreStatusClone',(status,id) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id +"/" +status;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "PUT",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,
            encoding:"hex"                
        },'UPDATE STORE: '+id+ ' STATUS: '+status).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedMerchantStoreDetails-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getMerchantStoreByID',(id) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET MERCHANT STORE: '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotMerchantStore-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})


Cypress.Commands.add('getAllMerchantStore',() => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${merchantEndpoint}`,
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
            var fileName = 'cypress/responses/merchantStore.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getMerchantStoreDetailByID',(id) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id +"/detail";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET MERCHANT STORE DETAILTS: '+ id).then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotMerchantStoreDetails-'+jsonBody.store.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})


// body: {
//     "totalAmount": 100,
//     "distance": 5
// } 

Cypress.Commands.add('getDeliveryPriveByMerchantStore',(id, body) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id +"/delivery-price";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body: body             
        },'GET DELIVERY PRICE OF STORE: '+id).then((response) => {
            // var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            
            if (logging == 'Y'){
                cy.writeFile('cypress/responses/deliveryPrice.json', response).then(() =>{return response;});
            } else {
                return response;
            }
                                    
        })
    })
})

Cypress.Commands.add('getDeliveryPriveByMerchantStoreAllowFail',(id, body) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/" + id +"/delivery-price";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false,
            body: body             
        },'GET DELIVERY PRICE OF STORE: '+id).then((response) => {
            // var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            
            if (logging == 'Y'){
                cy.writeFile('cypress/responses/deliveryPrice.json', response).then(() =>{return response;});
            } else {
                return response;
            }
                                    
        })
    })
})

Cypress.Commands.add('deleteMerchantStore',(id) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/";
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');

        cy.api({
            method: "DELETE",
                url: `${merchantEndpoint}/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'intra-service-name': 'core-deal-service',
                    'Authorization': `Bearer ${token}`
                }
        },'DELETE STORE: '+id).then((response) =>{
            return response;
        })
    })
})

Cypress.Commands.add('getStoresAround',(longitude, latitude, distance) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchant-stores/locations?latitude=" + latitude +"&longitude="+ longitude +"&distance="+distance;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET STORES NEARBY ').then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            
            var fileName = 'cypress/responses/nearbyStores.json';

            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }            
        })
    })
})


Cypress.Commands.add('uploadImage', function(fixtureName) {
    const imageUploadEndpoint = Cypress.env('apiHost') + "/api/upload/multi";
    return cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const headers = [{ name: 'Authorization', value: `Bearer ${token}` },
        { name: 'intra-service-name', value: 'core-deal-service' }];
        return cy.fixture(fixtureName, 'binary').then(function(binary) {
            const blob = Cypress.Blob.binaryStringToBlob(binary, 'image/jpeg')
                const formData = new FormData();
                formData.set('file', blob, 'tmpFile.jpg');
                const request = new XMLHttpRequest();
                request.open('POST', imageUploadEndpoint, false);
                if (headers) {
                    headers.forEach(function(header) {
                    request.setRequestHeader(header.name, header.value);
                });
                }
                request.send(formData);
                console.log(request.response)
                return JSON.parse(request.response);

        });

    })    
});

Cypress.Commands.add('uploadMerchantImage', function(fixtureName) {
    const imageUploadEndpoint = Cypress.env('apiHost') + "/api/merchants/profile/images";
    return cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const headers = [{ name: 'Authorization', value: `Bearer ${token}` },
        { name: 'intra-service-name', value: 'core-deal-service' }];
        return cy.fixture(fixtureName, 'binary').then(function(binary) {
            const blob = Cypress.Blob.binaryStringToBlob(binary, 'image/jpeg')
                const formData = new FormData();
                formData.set('file', blob, 'tmpFile.jpg');
                const request = new XMLHttpRequest();
                request.open('POST', imageUploadEndpoint, false);
                if (headers) {
                    headers.forEach(function(header) {
                    request.setRequestHeader(header.name, header.value);
                });
                }
                request.send(formData);
                console.log(request.response)
                return JSON.parse(request.response);
        
        });

    })    
});

Cypress.Commands.add('uploadMerchantProfileLogo', function(fixtureName) {
    const endpoint = Cypress.env('apiHost') + "/api/merchants/profile/logo";
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


Cypress.Commands.add('deleteMerchantImage',(imageURL) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchants/profile/images";
    return cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const headers = [{ name: 'Authorization', value: `Bearer ${token}` },
        { name: 'intra-service-name', value: 'core-deal-service' }];
        const formData = new FormData();
        formData.set('urls', imageURL);
        // cy.log('DELETING IMAGE');
        // return cy.wrap(
        //     axios({
        //       method: 'DELETE',
        //       url: deleteMerchantProfileEndpoint,
        //       data: formData,
        //       headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'multipart/form-data',
        //         'intra-service-name': 'core-deal-service'
        //       }
        //     })
        // )

        const request = new XMLHttpRequest();
        request.open('DELETE', endpoint, false);
        if (headers) {
            headers.forEach(function(header) {
            request.setRequestHeader(header.name, header.value);
        });
        }
        request.send(formData);
        console.log(request.response)
        return request.response.headers;
    })
})

Cypress.Commands.add('getMerchantProfile',() => {
    const merchantProfileEndpoint = Cypress.env('apiHost') + "/api/merchants/profile";
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${merchantProfileEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex"             
        },'GET MERCHANT PROFILE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotMerchantProfile-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }   
        })
    })
})

Cypress.Commands.add('updateMerchantProfile',(body) => {
    const merchantEndpoint = Cypress.env('apiHost') + "/api/merchants/profile";    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${merchantEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding:"hex"                
        },'UPDATE MERCHANT PROFILE ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/updatedMerchantProfile-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
            
        })
    })
})

Cypress.Commands.add('getMerchantProfileByID',(id) => {
    const merchantProfileEndpoint = Cypress.env('apiHost') + "/api/merchants/profile/" + id;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${merchantProfileEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex"             
        },'GET MERCHANT PROFILE BY MERCHANT NUMBER: '+id).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            var fileName = 'cypress/responses/gotMerchantProfile-'+jsonBody.id+'.json';
            
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }

        })
    })
})
Cypress.Commands.add('getTimeZone',(latitude, longitude) => {
    const TimeZoneEndpoint = Cypress.env('apiHost') + "/api/timezone?lat=" + latitude +"&lng="+ longitude;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${TimeZoneEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"                
        },'GET TIMEZONE BY LOCATION').then((response) => {
            var responseText = hex2ascii(response.body);
            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // // console.log();
            
            var fileName = 'cypress/responses/TimeZone.json';

            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }            
        })
    })
})

// Cypress.Commands.add('uploadImage', function(fixtureName) {
//     const imageUploadEndpoint = Cypress.env('apiHost') + "/api/upload/multi";
//     cy.getLocalStorage("authToken").then(token => {
//         var token = localStorage.getItem('authToken');
//         cy.fixture(fixtureName, 'binary').then(function(binary) {
//             Cypress.Blob.binaryStringToBlob(binary, 'image/jpeg').then(function(blob) {
//                 const formData = new FormData();
//                 formData.set('file', blob, 'tmpFile.jpg');
//                 return cy.wrap(
//                     axios({
//                       method: 'POST',
//                       url: imageUploadEndpoint,
//                       data: formData,
//                       headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data',
//                         'intra-service-name': 'core-deal-service'
//                       }
//                     })
//                   )
//             });
//         });

//     })    
// });
