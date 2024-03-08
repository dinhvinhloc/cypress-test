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
import { upperCase } from 'lodash';

const logging = Cypress.env('fileLogging');

// End-user's commands
// Checkout the cart (storeId)
// {
//     "storeId": 0,
//     "toBeAppliedItems": [
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
//     ]
//   }

Cypress.Commands.add('checkout',(storeID,toBeAppliedItems) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/checkout";
    const body = {
        "storeId": storeID,
        "toBeAppliedItems": toBeAppliedItems
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
            failOnStatusCode: false,
            encoding:"hex"                
        },'CHECKOUT CART ' + storeID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('checkoutWithGlobalPoint',(storeID,toBeAppliedItems,pointUsed) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/checkout";
    const body = {
        "globalPoints": pointUsed,
        "storeId": storeID,
        "toBeAppliedItems": toBeAppliedItems
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
            failOnStatusCode: false,
            encoding:"hex"                
        },'CHECKOUT CART ' + storeID + " USES " + pointUsed + " POINTS").then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Confirm an order
Cypress.Commands.add('confirmOrder',(orderID,body) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/"+ orderID +"/confirm"
    
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
            failOnStatusCode: false,
            encoding:"hex"                
        },'CONFIRM ORDER ' + orderID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Cancel an order
Cypress.Commands.add('cancelOrder',(orderID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID + "/cancel";
    
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
            encoding:"hex"                
        },'CANCEL ORDER ' + orderID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Forcefully Cancel an order
Cypress.Commands.add('forceCancelOrder',(orderID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID + "/cancel";
    
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
            encoding:"hex"                
        },'CANCEL ORDER ' + orderID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Confirm to pay order's paymentIntent using Card
Cypress.Commands.add('payOrder',(clientSecret,cardID) => {
    const endpoint = Cypress.env('apiHost') + "/api/testing-support/payment-intent/confirm/" + clientSecret + "/" + cardID;
    
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'stripe-payment-service',
                'Authorization': `Bearer ${token}`
            }
        },'PAY TO INTENT ' + clientSecret + " WITH CARD " + cardID).then((response) => {
            return response.body;
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }
        })
    })
})

// Confirm with merchant that the Order is paid with ChargeID
Cypress.Commands.add('confirmPaid',(orderID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID + "/paid";
    
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
            encoding:"hex"                
        },'CONFIRM ORDER ' + orderID + " PAID ").then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get all orders (applicable for both merchant and end-user)
Cypress.Commands.add('getOrders',() => {
    const endpoint = Cypress.env('apiHost') + "/api/orders";
    
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
        },'GET ALL ORDERS ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get orders by Date
// {{server}}/api/orders?startDate=2020-09-22T00:00:00.000-00:00&endDate=2020-09-22T23:59:59.999-00:00
Cypress.Commands.add('getOrdersByDates',(startDate, endDate) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders?startDate="+ startDate + "&endDate=" + endDate;
    
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
        },'GET ORDERS FROM '+ startDate + ' TO ' + endDate).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Check order's validity
Cypress.Commands.add('checkOrderValidity',(orderID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/"+ orderID +"/is-valid"
    
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
            failOnStatusCode: false,
            encoding:"hex"                
        },'CHECK VALIDITY OF ORDER ' + orderID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Merchant's Commands

// Action on an Order: accept, reject, preparing, ready, pickup, delivering, complete
// Narrative: reject reason, preparing/delivering duration
Cypress.Commands.add('merchantOrderCommand',(orderID,storeID,action, body) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID + "/"+action+"/" + storeID;
    // const body = "\""+narrative+"\"";
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
        },upperCase(action) + ' ORDER ' + orderID + " OF STORE " + storeID ).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('merchantOrderCommandAllowFail',(orderID,storeID,action, narrative) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID + "/"+action+"/" + storeID;
    const body = "\""+narrative+"\"";
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
        },upperCase(action) + ' ORDER ' + orderID + " OF STORE " + storeID + " WITH " + narrative).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})


// Force Complete order
Cypress.Commands.add('forceCompleteOrder',(orderID,storeID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID + "/complete/" + storeID;
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
            encoding:"hex"                
        },"COMPLETE ORDER "+ orderID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+jsonBody.id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get all Orders by Store

Cypress.Commands.add('getOrdersByStore',(storeID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/store/" + storeID;
    
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
        },'GET ALL ORDERS OF STORE ' + storeID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/ordersOfStore-'+storeID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getOrdersByStoreAllowFail',(storeID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/store/" + storeID;
    
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
            failOnStatusCode: false,
            encoding:"hex"                
        },'GET ALL ORDERS OF STORE ' + storeID).then((response) => {

            return response
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/ordersOfStore-'+storeID+'.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }
        })
    })
})

// Get orders by storeId and Dates
// {{server}}/api/orders/store/29408141397593275487936870686?startDate=2020-09-22T00:00:00.000-00:00&endDate=2020-09-22T23:59:59.999-00:00
Cypress.Commands.add('getOrdersByStoreAndDates',(storeID, startDate, endDate) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/store/"+storeID+"?startDate="+ startDate + "&endDate=" + endDate;
    
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
        },'GET ORDERS OF STORE ' +storeID+ ' FROM '+ startDate + ' TO ' + endDate).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getOrdersByStoreAndDatesAllowFail',(storeID, startDate, endDate) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/store/"+storeID+"?startDate="+ startDate + "&endDate=" + endDate;
    
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
            failOnStatusCode: false,
            encoding:"hex"                
        },'GET ORDERS OF STORE ' +storeID+ ' FROM '+ startDate + ' TO ' + endDate).then((response) => {
            return response
        })
    })
})


Cypress.Commands.add('getOrderByID',(orderID) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/" + orderID;
    
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
        },'GET ORDER DETAILS ' + orderID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/order-'+orderID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get orders from Archive 

Cypress.Commands.add('getArchivedOrders',(storeId, startDate, endDate, pageNumber, pageSize, serveOptions, orderType, orderStatus) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/archived?startDate="+ startDate + "&endDate=" + endDate+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"&serveOptions="+serveOptions+"&orderType="+orderType+"&orderStatus="+orderStatus+"&storeId="+storeId;
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
        },'GET ARCHIVED ORDERS FROM '+ startDate + ' TO ' + endDate).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Search orders from Archive 
Cypress.Commands.add('searchArchivedOrdersByText',(storeId, startDate, endDate, pageNumber, pageSize, serveOptions, searchText) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/archived?startDate="+ startDate + "&endDate=" + endDate+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"&serveOptions="+serveOptions+"&searchText="+searchText+"&storeId="+storeId;
    
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
        },'SEARCH ARCHIVED ORDERS FROM '+ startDate + ' TO ' + endDate + ' WITH TEXT: ' + searchText).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Query archived orders: custom response fields
Cypress.Commands.add('getArchivedOrdersCustomFields',(fields) => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/archived?responseFields="+ fields;
    
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
        },'QUERY ARCHIVED ORDERS RESPONSE IN CUSTOM FIELDS: ' + fields).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Get ACTIVE orders (orders with status between PAID and COMPLETED )
Cypress.Commands.add('getActiveOrders',() => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/active";
    
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
        },'GET ACTIVE ORDES ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Count number of ACTIVE orders (orders with status between PAID and COMPLETED )
Cypress.Commands.add('countActiveOrders',() => {
    const endpoint = Cypress.env('apiHost') + "/api/orders/active/count";
    
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
            // encoding:"hex"                
        },'COUNT NUMBER OF ACTIVE ORDES ').then((response) => {
            return response
            // var responseText = hex2ascii(response.body);
            // // // console.log(responseText);
            // var jsonBody = JSONbig.parse(responseText);
            // // console.log(jsonBody);
            // var fileName = 'cypress/responses/orders.json';
            // if (logging == 'Y'){
            //     cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            // } else {
            //     return jsonBody;
            // }
        })
    })
})