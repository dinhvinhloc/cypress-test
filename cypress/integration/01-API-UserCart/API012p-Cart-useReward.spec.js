describe('API012p - Use Reward Item Redeem', function () {
    it('Business Category: Checking Redeem Item Functionality', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1;

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Login as merchant to get the coupon code
        var merchantID;
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password).then((response)=>{
            merchantID = response.merchantID
        });

        cy.waitUntil(() => cy.updateRewardItem(store1.rewardPG1P2, store1.rewardPG1P2.id));
        cy.waitUntil(() => cy.updatePointPerk(store1.pointPerkPG3P5, store1.pointPerkPG3P5.id));

        var deal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.rewardPG1P2.id).then((response) => {
                console.log(response);
                return deal = response;
            })
        );

        var pointPerkDeal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.pointPerkPG3P5.id).then((response) => {
                console.log(response);
                return pointPerkDeal = response
            }));

        // INACTIVATE ALL OTHER DEALS TO NARROW DOWN THE CONDITION
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.pointPerkPG3P5.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.punchCardPG1P2.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.freePG3P1At250.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.freePG3P2At250.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.freePG3P3At600.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.boPG3P4foPG1P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.dis10PerPG2P2.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.dis20CADONCART200CAD.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.hiddenDiscount20CAD.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE", store1.dis10PERONCART300CAD.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.rewardPG1P2.id));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        // Get all user points specific to this store.
        var userPointIDOfThisStore;
        cy.waitUntil(() => cy.getUserPoints().then((response) => {
            console.log(JSON.stringify(response));
           // debugger;
            cy.wrap(response).each((userPoint) => {
                if (userPoint.merchantId == merchantID) {
                    userPointIDOfThisStore = userPoint
                    console.log(userPointIDOfThisStore)
                }
            })
        }));

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Make an Order to get 21000 points specific to the merchant store.
        var rewardItem = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P6.id, 2, store1.AG3AO2.id, 3).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P7.id, 1, store1.AG3AO2.id, 3).then((response) => {
            console.log(response);
            rewardItem = response.toBeAppliedPromotion
            console.log(rewardItem);
        }));

        var toBeAppliedItems = []

        // Construct the toBeAppliedItems json
        cy.waitUntil(() =>
            cy.wrap(rewardItem).each((item) => {

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
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems).then((response) => {
            console.log(response);
            order = response;
        }));

        var confirmationInfo = { "isPickUp": true, }
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id, confirmationInfo).then((response) => {
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
        cy.waitUntil(() => cy.confirmPaid(order.id));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"accept",""));
        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"preparing",{ processingTime: 20 }));
        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"ready",""));
        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"complete","").then((response)=>{
            expect(response).to.have.property('status', 'COMPLETED');
        }));        

        //----------------------------- REDEEM REWARD ITEM -------------------------------
        // Login back as end user and REDEEM the REWARD ITEM
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Rate the order
        cy.waitUntil(() => cy.eventRate(order.id, 0))

        // Get User Point again and expect it to increase 3 x 7000 points
        cy.waitUntil(() => cy.getUserPoints().then((response)=>{
            cy.wrap(response).each((userPoint)=>{
                if (userPoint.merchantId == merchantID){
                    expect(userPoint.point).to.equal(3*pointPerkDeal.rewardPoints + userPointIDOfThisStore.point);
                } 
            })
        }));

        var redeemProductList = []
        // Construct the redeemProductList json
        cy.waitUntil(() => 
            cy.wrap(deal.rewardProductList).each((item)=>{
                redeemProductList.push(
                    {
                    "quantity": item.quantity,
                    "instruction": "This is Redeem Item",
                    "productId": item.id,
                    "addons": [
                        {
                        "quantity": 1,
                        "instruction": "Addon For Redeem Item",
                        "productId": store1.AG1AO1.id,
                        "addon": true
                        },
                        {
                        "quantity": 1,
                        "instruction": "Addon For Redeem Item",
                        "productId": store1.AG1AO2.id,
                        "addon": true
                        }
                    ],
                    "addon": true
                    })
                
            })
        );
        
        // Redeem the Order using Point
        // var redeemOrder
        // cy.waitUntil(() => cy.redeemPoint(store1.storeID.id,deal.id,userPointIDOfThisStore.id,redeemProductList).then((response)=>{
        //     console.log(JSON.stringify(response));
        //    // debugger;
        //     // Checking if the discount amount is equal to the totalAmount of the item because addons are chargeable.
        //     let totalAmnt = response.items[0].totalAmount;
        //     expect(response).to.have.property("discountAmount",totalAmnt);
        //     redeemOrder = response;
        // }));

        // cy.waitUntil(() => cy.confirmOrder(redeemOrder.id,confirmationInfo).then((response)=>{
        //     confirmResponse = response
        // }));
        
        //////////////////////////////
        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id,deal.id,redeemProductList).then((response)=>{
            console.log("Redeem Cart: ",response);
        }));
        
        cy.waitUntil(() => cy.removeRedeemItemFromCart(store1.storeID.id,deal.id).then((response)=>{
            console.log("Redeem Cart: ",response);
        }));

        cy.waitUntil(() => cy.addRedeemItemToCart(store1.storeID.id,deal.id,redeemProductList).then((response)=>{
            console.log("Redeem Cart: ",response);
        }));

        // Check out the order
        var toBeAppliedItems1 = []
        var redeemOrder
        cy.waitUntil(() => cy.checkout(store1.storeID.id,toBeAppliedItems1).then((response)=>{
            console.log(response);
            redeemOrder = response;
        }));



        cy.waitUntil(() => cy.confirmOrder(redeemOrder.id,confirmationInfo).then((response)=>{
            confirmResponse = response
        }));
        


        //////////////////////////////

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
        cy.waitUntil(() => cy.confirmPaid(redeemOrder.id)); 

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Merchant Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"accept",""));
        // Merchant preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"preparing",{ processingTime: 15 }));
        // Merchant make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"ready",""));
        // Merchant complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(redeemOrder.id, store1.storeID.id,"complete","").then((response)=>{
            expect(response).to.have.property('status', 'COMPLETED');
        })); 


        // CHANGE BACK THE DEALS -------------------------------------------------
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);



        // Update reward item and point perk to normal state.
        cy.waitUntil(() => cy.updateRewardItem(store1.rewardPG1P2, store1.rewardPG1P2.id));
        cy.waitUntil(() => cy.updatePointPerk(store1.pointPerkPG3P5, store1.pointPerkPG3P5.id));

        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.pointPerkPG3P5.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.punchCardPG1P2.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.freePG3P1At250.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.freePG3P2At250.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.freePG3P3At600.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.boPG3P4foPG1P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.dis10PerPG2P2.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.dis20CADONCART200CAD.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.hiddenDiscount20CAD.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.dis10PERONCART300CAD.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE", store1.rewardPG1P2.id));


    });
})
