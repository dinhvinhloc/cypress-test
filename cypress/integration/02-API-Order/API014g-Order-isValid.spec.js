describe('API014g - Test order validity', function () {
    it('Test order becomes invalid due to product or addon or promotion status change', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1        
        const now = Cypress.dayjs().add(5,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const then = Cypress.dayjs().add(-1,'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        var deal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.boPG3P4foPG1P1.id).then((response)=>{
            console.log(response);
            return deal = response
        })
        );        


        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 10 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,10,null,null).then((response)=>{
            console.log(response);
            expect(response.suggestedPromotion[0]).to.have.property('id', deal.id);
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG1P1.id,10,store1.AG2AO1.id,2).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 240.119);
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));
        
        var toBeAppliedItems = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() => 
            cy.wrap(rewardItem).each((item)=>{

                toBeAppliedItems.push(
                    {
                    "appliedPromotionId": item.id,
                        "quantity": item.rewardProductList[0].quantity,
                    "instruction": "This is a Free Item",
                    "productId": item.rewardProductList[0].id,
                    "addons": [
                        {
                        "quantity": 1,
                        "instruction": "Addon on Free Item is here",
                        "productId": store1.AG3AO1.id,
                        "addon": true
                        },
                        {
                        "quantity": 1,
                        "instruction": "Addon on Free Item is here",
                        "productId": store1.AG2AO1.id,
                        "addon": true
                        }
                    ],
                    "addon": true
                    })
                
            })
        );

        // Check out the order
        var order
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems).then((response)=>{
            console.log(response);
            order = response;
        }));
        
        var confirmationInfo = {   "isPickUp": true,  }

        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
        }));

        // Get orders during a startDate and endDate  (https://intransigense.atlassian.net/browse/BP-1407)
        cy.waitUntil(() => cy.checkOrderValidity(order.id).then((response)=>{
            console.log(response);
            expect(response).to.contain.key('merchantId','storeName','storeImages','clientSecret');
        }));

        

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Set the products to INACTIVE
        cy.waitUntil(()=> cy.updateProductStatus(status = 'INACTIVE',store1.PG3P4.id));
        

        // Check order validity
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.checkOrderValidity(order.id).then((response)=>{
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 400);
            expect(response.message).to.have.string('is no longer available and we have to cancel the order. Please order again!');
        }));


        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Set the addon to INACTIVE
        cy.waitUntil(()=> cy.updateProductStatus(status = 'ACTIVE',store1.PG3P4.id));
        cy.waitUntil(()=> cy.updateAddonStatus(status = 'INACTIVE',store1.AG2AO1.id));
        

        // Check order validity
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.checkOrderValidity(order.id).then((response)=>{
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 400);
            expect(response.message).to.have.string('is no longer available and we have to cancel the order. Please order again!');
        }));
        
        
        
        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Set the Promotion to INACTIVE
        cy.waitUntil(()=> cy.updateProductStatus(status = 'ACTIVE',store1.PG3P4.id));
        cy.waitUntil(()=> cy.updateAddonStatus(status = 'ACTIVE',store1.AG2AO1.id));
        cy.waitUntil(()=> cy.updatePromotionStatus(status = 'INACTIVE',deal.id));
        

        // Check order validity
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.checkOrderValidity(order.id).then((response)=>{
            console.log(response);
            expect(response).to.not.have.key('id');
            expect(response).to.have.property('status', 400);
            expect(response.message).to.have.string('is no longer available and we have to cancel the order. Please order again!');
        }));
        
        
        
        
        
        
        
        
        
        
        
        
        
        // Restore all status
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Set the products to INACTIVE
        cy.waitUntil(()=> cy.updateProductStatus(status = 'ACTIVE',store1.PG3P4.id));
        cy.waitUntil(()=> cy.updateProductStatus(status = 'ACTIVE',store1.PG1P1.id));
        cy.waitUntil(()=> cy.updateAddonStatus(status = 'ACTIVE',store1.AG2AO1.id));
        cy.waitUntil(()=> cy.updatePromotionStatus(status = 'ACTIVE',deal.id));



        // Cancel the order
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        cy.waitUntil(() => cy.cancelOrder(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
        }));

    });
})
