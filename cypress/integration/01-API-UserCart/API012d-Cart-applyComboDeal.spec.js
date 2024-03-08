describe('API012d - Apply Combo Deal test', function () {
    it('Business Category: the Combo Deal should be automatically apply when meet Combo Deal criteria', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/created-data/tax_config.json').as('taxes')

        var store1
        // var taxConfig

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Get all tax configure of the store created.
        // cy.waitUntil(() => cy.get('@taxes').then((info) => {
        //     taxConfig = info
        // }));


        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var comboDealInfo
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.deal10CADPG1P1PG2P1PG3P1.id).then((response) => {
                console.log(response);
                return comboDealInfo = response
            })
        );



        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P1.id, 1, store1.AG1AO1.id, 1).then((response) => {
            console.log(response);
            expect(response.items[0]).to.have.property('productId', store1.PG1P1.id);
            expect(response.items[0]).to.have.property('quantity', 1);
            expect(response.items[0].addons[0]).to.have.property('productId', store1.AG1AO1.id);
            expect(response.items[0].addons[0]).to.have.property('quantity', 1);
            cy.assertTaxItem("PG1P1",1,response.items[0].totalDiscountAmount, response.items[0].appliedTaxes)
            cy.assertTaxItem("AG1AO1",1,response.items[0].addons[0].totalDiscountAmount, response.items[0].addons[0].appliedTaxes)

            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', comboDealInfo.id);

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG2P1.id, 1, store1.AG2AO1.id, 1).then((response) => {
            console.log(response);
            expect(response.items[1]).to.have.property('productId', store1.PG2P1.id);
            expect(response.items[1]).to.have.property('quantity', 1);
            expect(response.items[1].addons[0]).to.have.property('productId', store1.AG2AO1.id);
            expect(response.items[1].addons[0]).to.have.property('quantity', 1);
            cy.assertTaxItem("PG2P1",1,response.items[1].totalDiscountAmount, response.items[1].appliedTaxes)
            cy.assertTaxItem("AG2AO1",1,response.items[1].addons[0].totalDiscountAmount, response.items[1].addons[0].appliedTaxes)

            // Check suggested Promotion
            expect(response.suggestedPromotion[0]).to.have.property('id', comboDealInfo.id);
            expect(response.suggestedPromotion[0]).to.have.property('dealType', comboDealInfo.dealType);

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P1.id, 2, null, null).then((response) => {
            console.log(response);
            expect(response.items[2]).to.have.property('productId', store1.PG3P1.id);
            expect(response.items[2]).to.have.property('quantity', 2);


            // Assert tax.
            // Input: 1) Item name matched to item in stores.json; 2) quantity; 3) discount
            cy.assertTaxItem("PG3P1",2,response.items[2].totalDiscountAmount, response.items[2].appliedTaxes)

            // Check suggested Promotion
            expect(response.appliedPromotion[0]).to.have.property('id', comboDealInfo.id);
            expect(response).to.have.property('discountAmount', comboDealInfo.discountAmount);

            // Check Tax
            var totalTaxAmount = 0;
            cy.wrap(response.appliedTaxes).each((taxObj) => {
                totalTaxAmount += taxObj.taxAmount
            }).then(() => {
                console.log("Total Tax is: ", totalTaxAmount);
                expect(response).to.have.property('totalAmount', response.subAmount + totalTaxAmount - response.discountAmount);
            })
        }));

    });
})
