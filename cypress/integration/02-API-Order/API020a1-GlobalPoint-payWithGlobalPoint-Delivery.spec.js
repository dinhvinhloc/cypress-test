describe('API020a1 - Global Point test - Success case - Delivery', function () {
    it('Test that the Global Point rewarded to client should not include Delivery Fee', function () {
        
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
        
        var merchantID
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password).then((response)=>{
            merchantID = response.merchantID
            console.log(merchantID)
        });

        var userId

        email = Cypress.env('enduser0004');
        password = Cypress.env('enduser0004Pass');
        cy.Login(email, password).then((response)=>{
            userId = response.id;
            // Delete all user's GLobal Point

            cy.task('deleteGlobalPoint',{userId: userId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('deleteGlobalPointHistory',{userId: userId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })
        })

        // Get all user punch points, extract to User Point of the store and his Global Point
        var userGlobalPoint
        // cy.waitUntil(() => 
        
        cy.getGlobalPoint().then((response)=>{
            console.log("OLD GLOBAL POINT")
            console.log(response)
            userGlobalPoint = response
        })
        // );

        // CREATE AN ORDER OF 18 x PG3P6 WHICH GIVE USER ~ 22760 global points
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id));
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P7.id,30,store1.AG3AO2.id,1).then((response)=>{
            console.log("CART")
            console.log(response);
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
            // order = response;
        }));

        // Pay with the cardID
        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);
        
        var cardID = Cypress.env('enduser0004Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret,cardID).then((response)=>{
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0004');
        password = Cypress.env('enduser0004Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id)); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept",""));

        
        // Login as user and check for Global Point increment right after merchant accept the order.
        
        email = Cypress.env('enduser0004');
        password = Cypress.env('enduser0004Pass');
        cy.Login(email, password);

        var totalTaxAmount = 0;

        cy.waitUntil(() => 
            cy.wrap(order.appliedTaxes).each((taxObj) => {
                totalTaxAmount += taxObj.taxAmount
            })        
        );

        cy.waitUntil(() => cy.getGlobalPoint().then((response)=>{            
            console.log("NEW GLOBAL POINT")
            console.log(response)
            expect(response).to.equal(userGlobalPoint + Math.trunc(10 * (order.subAmount-order.discountAmount)));
            userGlobalPoint = response            
        }));


        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }));
        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready",""));
        // delivering order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivering",{ processingTime: 60 }).then((response)=>{
            // console.log(response);
        }));
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            expect(response).to.have.property('status', 'COMPLETED');
        }));        

        
        

    });
})
