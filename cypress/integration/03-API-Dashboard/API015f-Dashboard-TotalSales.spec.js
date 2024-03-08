describe("API015f - Total Sales in the Sales Dashboard Endpoint", () => {
    it("Business Category: Total Sales Endpoint should return the total sales for merchant or specific to store", () => {

        // merchant user login
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        var merchantId;
        var storeId;
        var store1;
        var deal;
        var endDate = Cypress.dayjs().format('YYYY-MM-DD');
        var startDate = Cypress.dayjs().subtract(1, 'months').format('YYYY-MM-DD');
        let day = Cypress.dayjs().utcOffset(-144).dayOfYear();
    
        cy.waitUntil(() => cy.Login(email, password).then((data) => {
            // Comparison only when doing merchantLogin 
            expect(data).to.have.property('isMerchant', true);
            merchantId = data.merchantID;
        }));

        cy.fixture('test-data/created-data/stores.json').as('stores');
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate');
        var sales, salesWithStore, updatedSales, updatedSalesWithStore;
        
        // Getting the store Id from the stores.json
        cy.waitUntil(() => cy.get('@stores').then((info) => {
             
            storeId = info[0].storeID.id;

            store1 = info[0];
        }));

        // Checks the total orders
        cy.waitUntil(() => cy.getMetric(startDate, endDate, 'TOTAL_SALES','DAILY', merchantId).then((response) => {
            
            let arr = response.filter(el => el.day == day);
            sales = arr?.[0]?.total ?? 0;
            console.log(`sales:: ${sales}`);
        }));

        //Checks the total orders with store
        cy.waitUntil(() => cy.getMetric(startDate, endDate, 'TOTAL_SALES','DAILY' ,merchantId, storeId).then((response) => {

            let arr = response.filter(el => el.day == day);
            salesWithStore = arr?.[0]?.total ?? 0;            
            console.log(`salesWithStore:: ${salesWithStore}`);
        }));

       
        // end user orders -- start
        const now = Cypress.dayjs().add(5,'minutes').toISOString();
        const then = Cypress.dayjs().add(-1,'minutes').toISOString();

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

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
        
        var cardID = Cypress.env('enduser0001Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id).then((response)=>{
            console.log(response);
        })); 

        // end user orders -- end
        
        // merchant login 
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept","").then((response)=>{
            console.log(response);
        }));
        
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }).then((response)=>{
            console.log(response);
        })); 

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready","").then((response)=>{
            console.log(response);
        }));
        
        // delivering order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivering",{ processingTime: 60 }).then((response)=>{
            console.log(response);
        }));

        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            console.log(response);
        }));
        cy.wait(1000);

        // compare against the original sales
        // Checks the updated total sales
        cy.waitUntil(() => cy.getMetric(startDate, endDate, 'TOTAL_SALES','DAILY', merchantId).then((response) => {
            
            let arr = response.filter(el => el.day == day);
            updatedSales = arr?.[0]?.total ?? 0;
            
            console.log(`updatedSales:: ${updatedSales}`);
            expect(updatedSales).to.be.greaterThan(sales);
        }));

        //Checks the updated total sales with store
        cy.waitUntil(() => cy.getMetric(startDate, endDate, 'TOTAL_SALES','DAILY', merchantId, storeId).then((response) => {

            let arr = response.filter(el => el.day == day);
            updatedSalesWithStore = arr?.[0]?.total ?? 0;
            
            console.log(`updatedSalesWithStore:: ${updatedSalesWithStore}`);
            expect(updatedSalesWithStore).to.be.greaterThan(salesWithStore);
        }));

        // Checking new clients and returning clients
    
        // Merchant reject order
        // Checking total cancel orders from merchant dashboard
        // Checking User Engagements

        // Checking the total sales

        // Checking the best seller

    })
})