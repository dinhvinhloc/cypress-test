## Installation

```
npm install
or
npm ci
```

## Usage

Run the tests using:
-- From UI:
    run "./node_modules/.bin/cypress open"
    Then run tests from the UI

-- From CLI:
    npx cypress run

-- Run and publish to Cypress Dashboard

    cypress run --record --key xxxxxxxxxxxxxxxx
    
-- Run using custom test runner that generate mochawesome report
    node cypress_runner -b electron
    node cypress_runner -b chrome

    Report generated will be under ./merchant-web-auto-test/cypress/report/mochawesome-report

## More Details

### Folder Structure

Tests go in the `cypress\integration` folder.

Support commands: `cypress\support\commands.js` 
