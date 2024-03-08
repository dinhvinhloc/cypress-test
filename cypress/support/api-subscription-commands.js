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



Cypress.Commands.add('getAllSubscriptions', () => {
    const endpoint = Cypress.env('apiHost') + "/api/subscriptions";

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'notification-service',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex"
        }, 'GET ALL SUBSCRIPTIONS ').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/subscriptions.json';

            if (logging == 'Y') {
                cy.writeFile(fileName, jsonBody).then(() => { return jsonBody; });
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('getSubscriptionsMasterData', (province) => {
    var endpoint = Cypress.env('apiHost') + "/api/subscriptions/master";

    if (province != null){
        endpoint += "?province="+province
    }

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'notification-service',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex"
        }, 'GET SUBSCRIPTIONS MASTER DATA').then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/subscriptions.json';

            if (logging == 'Y') {
                cy.writeFile(fileName, jsonBody).then(() => { return jsonBody; });
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('subscribeTopic', (topic, subscriptionType, city) => {
    const endpoint = Cypress.env('apiHost') + "/api/subscriptions/subscribe";
    const body ={
        "topic": topic,
        "subscriptionType": subscriptionType,
        "city": city
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'notification-service',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex",
            body: body,
        }, 'SUBSCRIBE TO TOPIC: '+ topic + ", TYPE: "+subscriptionType+", CITY: "+ city).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/subscriptions.json';

            if (logging == 'Y') {
                cy.writeFile(fileName, jsonBody).then(() => { return jsonBody; });
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('subscribeTopicAllowFail', (topic, subscriptionType, city) => {
    const endpoint = Cypress.env('apiHost') + "/api/subscriptions/subscribe";
    const body ={
        "topic": topic,
        "subscriptionType": subscriptionType,
        "city": city
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'notification-service',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex",
            body: body,
            failOnStatusCode: false,
        }, 'SUBSCRIBE TO TOPIC: '+ topic + ", TYPE: "+subscriptionType+", CITY: "+ city).then((response) => {
            var responseText = hex2ascii(response.body);
            // // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/subscriptions.json';

            if (logging == 'Y') {
                cy.writeFile(fileName, jsonBody).then(() => { return jsonBody; });
            } else {
                return jsonBody;
            }

        })
    })
})

Cypress.Commands.add('unsubscribeTopic', (topic,subscriptionType, city) => {
    
    var endpoint = Cypress.env('apiHost') + "/api/subscriptions/unsubscribe";
    
    const body ={
        "topic": topic,
        "subscriptionType": subscriptionType,
        "city": city
    }

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'notification-service',
                'Authorization': `Bearer ${token}`
            },
            body: body,
        }, 'UNSUBSCRIBE TO TOPIC: '+ topic + ", CITY: "+ city).then((response) => {

            return response
        })
    })
})