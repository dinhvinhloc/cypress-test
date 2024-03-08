describe('API012m - Test toBeAppliedItems in the cart', function () {
    it('Test the calculation of cart for adding toBeAppliedItems ', function () {

        cy.fixture('test-data/created-data/stores.json').as('stores')
        cy.fixture('test-data/confirmOrder.json').as('confirmTemplate')


        var store1
        const now = Cypress.dayjs().add(5, 'minutes').toISOString();
        const then = Cypress.dayjs().add(-1, 'minutes').toISOString()

        // Get information of created store1 into variable.
        cy.waitUntil(() => cy.get('@stores').then((info) => {
            store1 = info[0]
        }));

        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);



        var deal
        cy.waitUntil(() =>
            cy.getPromotionByID(store1.freePG3P1At250.id).then((response) => {
                console.log(response);
                return deal = response
            })
        );

        cy.wrap(deal).then(() => {
            deal.isAddonCharged = false
            cy.updateDeal(deal, deal.id).then((response) => {
                expect(response).to.have.property("isAddonCharged", false)
            })
        })

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response) => {
            expect(response).to.have.property('isCartEmpty', true);
        }));
        let userCart
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG1P1.id, 10, store1.AG2AO1.id, 2).then((response) => {
            console.log(response);
            userCart = response
        }));


        // Adding 10 X PG1P1 and expect to get a Free Reward as the Free Item promotion condition

        var rewardItems = [];
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id, store1.PG3P4.id, 10, null, null).then((response) => {
            console.log(response);
            cy.assertAmount(response.appliedTaxes, response.subAmount, response.discountAmount, response.totalAmount, response.serviceFee)
            rewardItems = response.toBeAppliedPromotion
            console.log(rewardItems);
            let IDList = rewardItems.map(a => a.id);
            // Check that the cart has 3 Free Items
            expect(IDList).to.contain(store1.freePG3P3At600.id);
            expect(IDList).to.contain(store1.freePG3P2At250.id);
            expect(IDList).to.contain(store1.freePG3P1At250.id);
            userCart = response
        }));


        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(() =>
            cy.wrap(rewardItems).each((item) => {
                cy.getProductByID(item.rewardProductList[0].id).then((response) => {
                    item.rewardProductList[0].info = response
                })
            })
        );

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);


        var toBeAppliedItems = []
        // Construct the toBeAppliedItems json
        var i = 1;
        cy.waitUntil(() =>

            cy.wrap(rewardItems).each((item) => {
                console.log(item)
                cy.addFreeItemToCart(item.id, store1.storeID.id, item.rewardProductList[0].id, 1, store1.AG3AO1.id, 1).then((response) => {
                    console.log(response)
                    expect(response.toBeAppliedItems[item.id]).to.not.null
                    // Check that the increment in subAmountProducts equal to the free item's price added
                    expect(response.subAmountProducts).to.equal(parseFloat((userCart.subAmountProducts + response.toBeAppliedItems[item.id].price).toFixed(3)));
                    // Check that the increment in subAmount equal to the free item's price + free item's addon's price added
                    expect(response.subAmount).to.equal(parseFloat((userCart.subAmount + response.toBeAppliedItems[item.id].price + store1.AG3AO1.price).toFixed(3)));
                    expect(response.toBeAppliedItems[item.id].totalDiscountAmount).to.equal(response.toBeAppliedItems[item.id].price);
                    // Check that the increment in discountAmount equal to the free item's price added
                    if (!item.isAddonCharged) {
                        expect(response.discountAmount, "Assert discountAmount").to.equal(parseFloat((userCart.discountAmount + item.rewardProductList[0].info.price + i * store1.AG3AO1.price).toFixed(3)));
                        i++
                    } else {
                        expect(response.discountAmount, "Assert discountAmount").to.equal(parseFloat((userCart.discountAmount + item.rewardProductList[0].info.price).toFixed(3)));
                    }
                    userCart = response
                    toBeAppliedItems = response.toBeAppliedItems
                })
            })
        );

        // Removing Free Item one by one
        var j = 1
        cy.waitUntil(() =>
            cy.wrap(rewardItems).each((item) => {
                // console.log(item)
                cy.removeFreeItemFromCart(item.id, store1.storeID.id, item.rewardProductList[0].id, 1, store1.AG3AO1.id, 1).then((response) => {
                    console.log(response)
                    expect(response.toBeAppliedItems[item.id]).to.equal(undefined)
                    // Check that the decrement in subAmountProducts equal to the free item's price added
                    expect(response.subAmountProducts).to.equal(parseFloat((userCart.subAmountProducts - toBeAppliedItems[item.id].price).toFixed(3)));
                    // Check that the decrement in subAmount equal to the free item's price + free item's addon's price added
                    expect(response.subAmount).to.equal(parseFloat((userCart.subAmount - toBeAppliedItems[item.id].price - store1.AG3AO1.price).toFixed(3)));
                    // Check that the decrement in discountAmount equal to the free item's price added
                    // expect(response.discountAmount).to.equal(parseFloat((userCart.discountAmount - toBeAppliedItems[item.id].price - store1.AG3AO1.price).toFixed(3)));

                    if (!item.isAddonCharged) {
                        expect(response.discountAmount, "Assert discountAmount").to.equal(parseFloat((userCart.discountAmount - toBeAppliedItems[item.id].price - j * store1.AG3AO1.price).toFixed(3)));
                        j++
                    } else {
                        expect(response.discountAmount, "Assert discountAmount").to.equal(parseFloat((userCart.discountAmount - toBeAppliedItems[item.id].price).toFixed(3)));
                    }

                    userCart = response
                })
            }));

        // Adding back Free Items
        var k = 1
        cy.waitUntil(() =>
            cy.wrap(rewardItems).each((item) => {
                // console.log(item)
                cy.addFreeItemToCart(item.id, store1.storeID.id, item.rewardProductList[0].id, 1, store1.AG3AO1.id, 1).then((response) => {
                    console.log(response)
                    expect(response.toBeAppliedItems[item.id]).to.not.null
                    // Check that the increment in subAmountProducts equal to the free item's price added
                    expect(response.subAmountProducts).to.equal(parseFloat((userCart.subAmountProducts + response.toBeAppliedItems[item.id].price).toFixed(3)));
                    // Check that the increment in subAmount equal to the free item's price + free item's addon's price added
                    expect(response.subAmount).to.equal(parseFloat((userCart.subAmount + response.toBeAppliedItems[item.id].price + store1.AG3AO1.price).toFixed(3)));
                    // Check that the increment in discountAmount equal to the free item's price added
                    if (!item.isAddonCharged) {
                        expect(response.discountAmount, "Assert discountAmount").to.equal(parseFloat((userCart.discountAmount + response.toBeAppliedItems[item.id].price + k * store1.AG3AO1.price).toFixed(3)));
                        k++
                    } else {
                        expect(response.discountAmount, "Assert discountAmount").to.equal(parseFloat((userCart.discountAmount + response.toBeAppliedItems[item.id].price).toFixed(3)));
                    }
                    userCart = response
                    toBeAppliedItems = response.toBeAppliedItems
                    console.log(toBeAppliedItems)
                })
            }));

        // Update the Cart item #2 and check that 1 Free Item has been removed

        cy.waitUntil(() => cy.updateItemInCart(2, store1.storeID.id, store1.PG3P4.id, 5, null, null).then((response) => {
            console.log(response);
            // expect(response).to.have.property('discountAmount', 245);
            rewardItems = response.toBeAppliedPromotion
            console.log(rewardItems);
            let IDList = rewardItems.map(a => a.id);
            // Check that the cart has 3 Free Items
            expect(IDList).to.not.contain(store1.freePG3P3At600.id);
            expect(IDList).to.contain(store1.freePG3P2At250.id);
            expect(IDList).to.contain(store1.freePG3P1At250.id);
            expect(response.toBeAppliedItems[store1.freePG3P3At600.id]).to.equal(undefined)

        }));

        // Update the Cart item #2 back to origin and start to checkout

        cy.waitUntil(() => cy.updateItemInCart(2, store1.storeID.id, store1.PG3P4.id, 10, null, null).then((response) => {
            console.log(response);
            // expect(response).to.have.property('discountAmount', 245);
            rewardItems = response.toBeAppliedPromotion
            console.log(rewardItems);
            let IDList = rewardItems.map(a => a.id);
            // Check that the cart has 3 Free Items
            expect(IDList).to.contain(store1.freePG3P3At600.id);
            expect(IDList).to.contain(store1.freePG3P2At250.id);
            expect(IDList).to.contain(store1.freePG3P1At250.id);

        }));


        var toBeAppliedItems1 = []
        // Construct the toBeAppliedItems json
        cy.waitUntil(() =>
            cy.wrap(rewardItems).each((item) => {

                toBeAppliedItems1.push(
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
                    }
                )

            })
        );


        // Check out the order
        var order
        cy.waitUntil(() => cy.checkout(store1.storeID.id, toBeAppliedItems1).then((response) => {
            cy.assertFreeItemsInCartVSTheirPromotionsApplied(response)
            console.log(response);
            order = response;
        }));


        var confirmationInfo
        cy.waitUntil(() => cy.get('@confirmTemplate').then((info) => { confirmationInfo = info }));
        // Confirm the order
        var confirmResponse
        cy.waitUntil(() => cy.confirmOrder(order.id, confirmationInfo).then((response) => {
            console.log(response);
            confirmResponse = response
            order = response;
        }));

        // Pay with the cardID

        email = Cypress.env('adminUser');
        password = Cypress.env('adminPass');
        cy.Login(email, password);

        var cardID = Cypress.env('enduser0001Card');
        var chargeID;
        cy.waitUntil(() => cy.payOrder(confirmResponse.clientSecret, cardID).then((response) => {
            console.log(response);
            chargeID = response;
        }));

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        // Confirm order is paid
        cy.waitUntil(() => cy.confirmPaid(order.id).then((response) => {
            console.log(response);
        }));

        // Login as merchant
        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        // Accept the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "accept", "").then((response) => {
            // console.log(response);
        }));

        // preparing the order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "preparing", { processingTime: 20 }).then((response) => {
            // console.log(response);
        }));

        // make the order ready
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "ready", "").then((response) => {
            // console.log(response);
        }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"pickup","").then((response)=>{
        //     console.log(response);
        // }));

        // delivering order
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "delivering", { processingTime: 60 }).then((response) => {
            // console.log(response);
        }));

        // cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id,"delivered","").then((response)=>{
        //     console.log(response);
        // }));

        // complete the oder
        cy.waitUntil(() => cy.merchantOrderCommand(order.id, store1.storeID.id, "complete", "").then((response) => {
            // console.log(response);
        }));



        email = Cypress.env('merchant1');
        password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        cy.waitUntil(() => cy.updateDeal(store1.freePG3P1At250, store1.freePG3P1At250.id));

    });
})
