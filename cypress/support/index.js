// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './api-merchant-commands'
import './api-product-group-commands'
import './api-product-commands'
import './api-product-attribute-commands'
import './api-product-category-commands'
import './api-product-unit-commands'
import './api-addon-group-commands'
import './api-addon-commands'
import './api-promotion-commands'
import './api-user-cart-commands'
import './api-user-profile-commands'
import './api-dashboard-commands'
import './api-order-commands'
import './api-user-punch-card-commands'
import './api-user-points-commands'
import './api-merchant-points-commands'
import './api-delivery-rules-commands'
import './api-tax-commands'
import './api-subscription-commands'
import './api-assert-commands'
import '@bahmutov/cy-api/support'
import 'cypress-promise/register'
const dayjs = require('dayjs')
const dayOfYear = require('dayjs/plugin/dayOfYear')
const utc = require('dayjs/plugin/utc')
dayjs.extend(dayOfYear)
dayjs.extend(utc)

Cypress.dayjs = dayjs

// Alternatively you can use CommonJS syntax:
// require('./commands')
const addContext = require('mochawesome/addContext')

Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
        const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`
        addContext({ test }, `assets/${Cypress.spec.name}/${screenshotFileName}`)
    }
})
