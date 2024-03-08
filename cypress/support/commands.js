/*
 * Login to a specific user
 * @param {string} username
 * @param {string} password
 * @returns {string} - returns auth token cookie string when chained with .then()
 */
import 'cypress-file-upload';
import '@bahmutov/cy-api/support';
import 'cypress-localstorage-commands';
import 'cypress-wait-until';


Cypress.Commands.add('Login',(username, password) => {
    const loginEndpoint = Cypress.env('apiHost') + "/login";
    return cy.api({
            method: "POST",
            url: `${loginEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'intra-service-name': 'user-management'
            },
            body:
                JSON.stringify({"username":username,"password":password}),
        },'Login: '+ username)
        .then ((response) => {
            window.localStorage.setItem('merchantAuth','{"access_token":"'+ response.body.access_token+'"}')
            window.localStorage.setItem('isStripeConnected',true)
            cy.setLocalStorage('authToken', response.body.access_token).then(()=>{return response.body})
        })
})

/*
 * Logout from a user
 * @param {void}
 * @returns {void} - will not return anything but you can chain it with .then()
 */
Cypress.Commands.add("Logout", () => cy.clearCookies());


Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName, fileType = '') => {
    cy.fixture(fileName,'binary').then(content => {
        const blob = Cypress.Blob.binaryStringToBlob(content, fileType)

        const el = subject[0];
        const testFile = new File([blob], fileName, {type: fileType});
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        cy.wrap(subject).trigger('change', { force: true });
    });
});

// cypress/support/commands.js
// example usage: cy.get('#selectID input[role="slider"]').clickVSlider(0.25)

Cypress.Commands.add('clickVSlider', {prevSubject: true}, (subject, percentFromLeft) => {
    const sliderWidth = subject.width()
    const sliderHeight = subject.height()
    const pixelsFromLeft = percentFromLeft * sliderWidth
    const pixelsFromTop = 0.5 * sliderHeight
    cy.wrap(subject).click(pixelsFromLeft, pixelsFromTop)
  })

  export function checkIfEleExists(ele){
    return new Promise((resolve,reject)=>{
        /// here if  ele exists or not
        cy.get('body').find( ele ).its('length').then(res=>{
            if(res > 0){
                //// do task that you want to perform
                cy.get(ele).select('100').wait(2000);
                resolve();
            }else{
                reject();
            }
        });
    })
}