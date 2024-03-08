
import 'cypress-file-upload';
import '@bahmutov/cy-api/support';
import 'cypress-localstorage-commands';
const JSONbig = require('json-bigint')({ 'storeAsString': true });
import { hex2ascii } from 'hex2ascii';
import 'cypress-wait-until';
const logging = Cypress.env('fileLogging');

// End User Commands
Cypress.Commands.add('eventClick', (body) => {
    const endpoint = Cypress.env('apiHost') + "/api/event/click";

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'user-activity-collector',
                'Authorization': `Bearer ${token}`
            },
            body,
            // encoding: "hex"
        }, 'EVENT CLICK').then((response) => {

            return response;
        })
    })
})

Cypress.Commands.add('eventVisit', (body) => {
    const endpoint = Cypress.env('apiHost') + "/api/event/visit";

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'user-activity-collector',
                'Authorization': `Bearer ${token}`
            },
            body,
            // encoding: "hex"
        }, 'EVENT VISIT').then((response) => {

            return response.body;
        })
    })
})

Cypress.Commands.add('eventRate', (orderId, rateScore) => {
    const endpoint = Cypress.env('apiHost') + `/api/event/rate`;
    var rate;
    var body = {
        "orderId": "orderId",
        "rating": 4,
        "comment": "string"
    };

    if (rateScore == 0) {
        const min = Math.ceil(1);
        const max = Math.floor(5);
        rate = Math.floor(Math.random() * (max - min + 1) + min);
    } else {
        rate = rateScore
    }

    cy.wrap(body).then(() => {

        body.rating = rate;
        body.orderId = orderId;

        switch (rate) {
            case 1:
                body.comment = "1 star, Very Bad food. Unsatisfied";
                break;
            case 2:
                body.comment = "2 stars, Bad food. Unsatisfied";
                break;
            case 3:
                body.comment = "3 stars, Food is okay. No opinion";
                break;
            case 4:
                body.comment = "4 stars, Good food. Satisfied";
                break;
            case 5:
                body.comment = "5 stars, Great food. Highly satisfied";
                break;
            default:
                body.comment = "Great food. Highly satisfied";
        }

    })

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');

        cy.wrap(body).then(() => {
            cy.api({
                method: "POST",
                url: `${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'intra-service-name': 'user-activity-collector',
                    'Authorization': `Bearer ${token}`
                },
                body,
                encoding: "hex"
            }, 'EVENT RATE').then((response) => {

                return response;
            })
        })
    })
})

Cypress.Commands.add('getRatingByOrderId', (orderId) => {
    const endpoint = Cypress.env('apiHost') + "/api/merchant-dashboard/user-rating/order/" + orderId;

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex"
        }, "GET RATING VALUE OF ORDER" + orderId).then((response) => {

            var responseText = hex2ascii(response.body);

            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y') {
                cy.writeFile(fileName, jsonBody).then(() => { return jsonBody; });
            } else {
                return jsonBody;
            }
        })
    })
})

// Merchant User Commands
// merchant dashboard popular time
Cypress.Commands.add('getRatingByTime', (startDate, endDate, merchantId, pageNumber, pageSize, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        // without store Id endpoint 
        endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/user-rating/list/${startDate}/${endDate}/${merchantId}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }
    else {
        // with storeId endpoint 
        endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/user-rating/list/${startDate}/${endDate}/${merchantId}/${storeId}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            encoding: "hex"
        }, 'GET RATING INFO BY TIME').then((response) => {

            var responseText = hex2ascii(response.body);

            // console.log(responseText);
            var jsonBody = JSONbig.parse(responseText);
            // console.log(jsonBody);
            var fileName = 'cypress/responses/orders.json';
            if (logging == 'Y') {
                cy.writeFile(fileName, jsonBody).then(() => { return jsonBody; });
            } else {
                return jsonBody;
            }
        })
    })
})


Cypress.Commands.add('eventView', (body) => {

    const endpoint = Cypress.env('apiHost') + "/api/event/view";

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "POST",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'user-activity-collector',
                'Authorization': `Bearer ${token}`
            },
            body,
            encoding: "hex"
        }, 'EVENT VIEW').then((response) => {

            return response;
        })
    })
})

// Merchant User Commands
// merchant dashboard popular time
Cypress.Commands.add('getDashboardTime', (startDate, endDate, weekDay, merchantId, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        // without store Id endpoint 
        endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/popular-time/${startDate}/${endDate}/${weekDay}/${merchantId}`;
    }
    else {
        // with storeId endpoint 
        endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/popular-time/${startDate}/${endDate}/${weekDay}/${merchantId}/${storeId}`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET DASHBOARD POPULAR TIME').then((response) => {

            console.log("Response:: ", response);
            return response;
        })
    })
})


Cypress.Commands.add('getDashboardInit', (startDate, endDate, merchantId) => {
    const endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/init/${startDate}/${endDate}/${merchantId}`;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET DASHBOARD INIT').then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})

Cypress.Commands.add('getDashboardInitWithStore', (startDate, endDate, merchantId, storeId) => {
    const endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/init/${startDate}/${endDate}/${merchantId}/${storeId}`;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET DASHBOARD INIT WITH STORE').then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})

Cypress.Commands.add('getDashboardPlatform', (startDate, endDate, merchantId, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        // without store Id endpoint 
        endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/platform/${startDate}/${endDate}/${merchantId}`;
    }
    else {
        // with storeId endpoint 
        endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/platform/${startDate}/${endDate}/${merchantId}/${storeId}`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET DASHBOARD PLATFORM').then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})


Cypress.Commands.add('getDashboardRating', (startDate, endDate, merchantId) => {
    const endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/user-rating/${startDate}/${endDate}/${merchantId}`;
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET DASHBOARD RATING').then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})

Cypress.Commands.add('getDashboardRatingWithStore', (startDate, endDate, merchantId, storeId) => {
    const endpoint = `${Cypress.env('apiHost')}/api/merchant-dashboard/user-rating/${startDate}/${endDate}/${merchantId}/${storeId}`;

    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET DASHBOARD RATING WITH STOREID').then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})

// Sales Dashboards Commands
Cypress.Commands.add('getSalesDashboardInit', (startDate, endDate, merchantId, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/init/${startDate}/${endDate}/${merchantId}`;
    }
    else {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/init/${startDate}/${endDate}/${merchantId}/${storeId}`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, 'GET SALES DASHBOARD INIT').then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})

Cypress.Commands.add('getMetric', (startDate, endDate, metric, viewMode, merchantId, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/${metric}/${viewMode}/${startDate}/${endDate}/${merchantId}`;
    }
    else {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/${metric}/${viewMode}/${startDate}/${endDate}/${merchantId}/${storeId}`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, `GET METRIC ${metric} FOR ${viewMode}`).then((response) => {

            console.log("Response:: ", response);
            return response.body;
        })
    })
})

Cypress.Commands.add('getRealTime', (metric, viewMode, merchantId, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/realtime/${metric}/${viewMode}/${merchantId}`;
    }
    else {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/realtime/${metric}/${viewMode}/${merchantId}/${storeId}`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, `GET REALTIME ${metric} FOR ${viewMode}`).then((response) => {

            console.log("Response:: ", response);
            return response;
        })
    })
})

Cypress.Commands.add('getBestSeller', (startDate, endDate, merchantId, storeId) => {
    var endpoint;
    if (storeId == undefined) {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/bestseller/${startDate}/${endDate}/${merchantId}?sort=&page_number=1&page_size=5`;
    }
    else {
        endpoint = `${Cypress.env('apiHost')}/api/sales-dashboard/bestseller/${startDate}/${endDate}/${merchantId}/${storeId}?sort=&page_number=1&page_size=5`;
    }
    cy.getLocalStorage("authToken").then(token => {
        var token = localStorage.getItem('authToken');
        cy.api({
            method: "GET",
            url: `${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'merchant-dashboard',
                'Authorization': `Bearer ${token}`
            },
            // encoding: "hex"
        }, `GET BESTSELLER`).then((response) => {

            console.log("Response:: ", response);
            return response;
        })
    })
})





