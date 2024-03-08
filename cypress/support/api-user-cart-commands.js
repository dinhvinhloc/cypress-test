/*
 * Login to a specific user
 * @param {string} username
 * @param {string} password
 * @returns {string} - returns auth token cookie string when chained with .then()
 */
import 'cypress-file-upload';
import '@bahmutov/cy-api/support';
import 'cypress-localstorage-commands';
import { hex2ascii } from 'hex2ascii';
import 'cypress-wait-until';
const JSONbig = require('json-bigint')({ 'storeAsString': true });
const logging = Cypress.env('fileLogging');

// Empty the User Cart against a store.
// Input: storeID
Cypress.Commands.add('clearUserCart',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + id;
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
            encoding: "hex"
        },'CLEAR USER CART: '+id).then((response) => {
            const responseText = hex2ascii(response.body);
            // // console.log(responseText);
            const jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/emptyCart.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('getCart',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + id;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            body: {
                'requestAt': today
            },
            encoding:"hex"
        },'GET CART: ' + id).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/cart-'+id+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('countCartItems',(id) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + id + "/cart-item-count";

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
        },'COUNT NUMBER OF ITEMS IN CART: ' + id).then((response) => {
            return response;
        })
    })
})


Cypress.Commands.add('addItemToCart',(storeID,productID,prdQty,addonID,addonQty) => {
    // const endpoint = Cypress.env('apiHost') + "/api/user-cart/cart-item";
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/"+storeID+"/item";
    const thisMoment = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
    var addons =[];
    if (addonID !== null || addonQty !== null ){
        addons.push({
            "quantity": addonQty,
            "instruction": "Addon instruction",
            "productId": addonID,
            "addon": true
        })
    }
    var body = {
        "storeId": storeID,
        "item": {
          "quantity": prdQty,
          "instruction": "Product instruction",
          "productId": productID,
          addons,
          "addon": false
        }
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
        },'ADD '+prdQty+' PRODUCT '+productID+' and '+ addonQty + ' ADDON ' + addonID + ' TO CART '+ storeID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/cartItems-'+storeID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

// Command to add Free Item into cart for temporary cart calculation
Cypress.Commands.add('addFreeItemToCart',(promotionID,storeID,productID,prdQty,addonID,addonQty) => {
    // const endpoint = Cypress.env('apiHost') + "/api/user-cart/cart-item";
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/"+storeID+"/item-to-be-applied/"+promotionID;
    const thisMoment = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
    var addons =[];
    if (addonID !== null || addonQty !== null ){
        addons.push({
            "quantity": addonQty,
            "instruction": "Addon of Free Item",
            "productId": addonID,
            "addon": true
        })
    }
    var body = {
        "storeId": storeID,
        "item": {
          "quantity": prdQty,
          "instruction": "This is a Free Item",
          "productId": productID,
          addons,
          "addon": false
        }
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
        },'ADD '+prdQty+' FREE PRODUCT '+productID+' and '+ addonQty + ' ADDON ' + addonID + ' TO CART '+ storeID).then((response) => {
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
// Remove Free Item from cart
Cypress.Commands.add('removeFreeItemFromCart',(promotionID,storeID) => {
    // const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID +"/"+itemID;
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID +"/item-to-be-applied/"+promotionID;

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
        },'REMOVE FREE ITEM OF PROMO#: ' + promotionID +' OF CART: ' + storeID).then((response) => {
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



Cypress.Commands.add('updateItemInCart',(itemNo,storeID,productID,prdQty,addonID,addonQty) => {
    // const endpoint = Cypress.env('apiHost') + "/api/user-cart/cart-item/" + itemNo;
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/"+storeID+"/item/" + itemNo;
    const thisMoment = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
    var addons =[];
    if (addonID !== null || addonQty !== null ){
        addons.push({
            "quantity": addonQty,
            "instruction": "Addon instruction",
            "productId": addonID,
            "addon": true
        })
    }
    var body = {
        "storeId": storeID,
        "item": {
          "quantity": prdQty,
          "instruction": "Product instruction",
          "productId": productID,
          addons,
          "addon": false
        }
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
        },'UPDATE ITEM '+itemNo+' WITH '+prdQty+' PRODUCT '+productID+' and '+ addonQty + ' ADDON ' + addonID + ' TO CART '+ storeID).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/cartItems-'+storeID+'.json';
            if (logging == 'Y'){
                cy.writeFile(fileName, jsonBody).then(() =>{return jsonBody;});
            } else {
                return jsonBody;
            }
        })
    })
})

Cypress.Commands.add('removeItemFromCart',(storeID,itemID) => {
    // const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID +"/"+itemID;
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID +"/item/"+itemID;

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
        },'REMOVE FROM CART ITEM #: ' + itemID+' OF CART: ' + storeID).then((response) => {
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

Cypress.Commands.add('addCoupon',(storeID, coupon) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID + "/coupon/" + coupon;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"
        },'ADD COUPON: '+coupon +' TO CART: ' + storeID).then((response) => {
            var responseText = hex2ascii(response.body);
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

Cypress.Commands.add('removeCoupon',(storeID, coupon) => {
    const endpoint = Cypress.env('apiHost') + "/api/user-cart/" + storeID + "/coupon/" + coupon;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        const today = Cypress.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
        cy.api({
            method: "DELETE",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'core-deal-service',
                'Authorization': `Bearer ${token}`
            },
            encoding:"hex"
        },'REMOVE COUPON: '+coupon +' OUT OF CART: ' + storeID).then((response) => {
            var responseText = hex2ascii(response.body);
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