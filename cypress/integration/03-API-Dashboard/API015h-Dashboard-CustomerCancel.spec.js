describe("API015h - Cancelled Orders in the Sales Dashboard Orders Chart", () => {
    it("Business Category: On Customer Cancelling the order the total cancelled orders in the order chart should be changed", () => {

        // merchant user login
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        var storeId;
        var store1;
        var deal;
        var endDate = Cypress.dayjs().format('YYYY-MM-DD');
        var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');
    
        cy.waitUntil(() => cy.Login(email, password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));

        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate');
        var cancelO, cancelOWithStore, updatedCancelO, updatedCancelOWithStore;
        
        // Getting the store Id from the stores.json
        cy.waitUntil(() => cy.get('@stores').then((info) => {
             
            storeId = info[0].storeID.id;

            store1 = info[0];
        }));

        // Checks the total orders
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, merchantId).then((response) => {
            let metrics = response;
            cancelO = metrics.filter((el) => { return el.metric == 'TOTAL_CANCELED_ORDERS' })[0].total;
            console.log(`Cancelled Orders:: ${cancelO}`);
        }));

        //Checks the total orders with store
        cy.waitUntil(() => cy.getDashboardInitWithStore(startDate, endDate,merchantId, storeId).then((response) => {
            let metrics = response;
            cancelOWithStore = metrics.filter((el) => { return el.metric == 'TOTAL_CANCELED_ORDERS' })[0].total;
            console.log(`Cancelled Orders With Store:: ${cancelOWithStore}`);
        }));

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
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
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

        var confirmationInfo
        cy.waitUntil(() => cy.get('@confirmTemplate').then((info)=>{confirmationInfo = info}));        
        // Confirm the order
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id,confirmationInfo).then((response)=>{
            console.log(response);
            confirmResponse = response
        }));

        // Cancelling the order
        cy.waitUntil(() => cy.cancelOrder(order.id).then((response)=>{
            console.log(response);
            expect(response).to.have.property('status', 'CANCELED');
        }));
        // end user orders -- end
        
        // merchant login 
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // compare against the original sales
        // Checks the updated total sales
        cy.waitUntil(() => cy.getDashboardInit(startDate, endDate, merchantId).then((response) => {
            let metrics = response;
            updatedCancelO = metrics.filter((el) => { return el.metric == 'TOTAL_CANCELED_ORDERS' })[0].total;
            console.log(`Updated Cancelled Orders:: ${updatedCancelO}`);
            expect(cancelO+1).to.equal(updatedCancelO);
        }));

        //Checks the updated total sales with store
        cy.waitUntil(() => cy.getDashboardInitWithStore(startDate, endDate, merchantId, storeId).then((response) => {
            let metrics = response;
            updatedCancelOWithStore = metrics.filter((el) => { return el.metric == 'TOTAL_CANCELED_ORDERS' })[0].total;
            console.log(`Updated Cancelled Orders with Store:: ${updatedCancelOWithStore}`);
            expect(cancelOWithStore+1).to.equal(updatedCancelOWithStore);
        }));

    })
})