describe('000 - Delete all test data', function () {
    it('Delete all test data', function () {
        var merchantUser
        var merchantId
        var endUser
        var userId
        const password = Cypress.env('merchant1Pass');

        endUser = Cypress.env('enduser0001');

        // Login as the merchant again
        cy.Login(endUser, password).then((response) => {
            userId = response.id
            // Delete all orders using DB connection.
            cy.waitUntil(() => cy.getPunchCards().then((response) => {
                console.log(response)
                cy.wrap(response).each((punch) => {
                    cy.task('deleteUserPunchHistory', { userPunchCardId: punch.id }).then((textOrNull) => {
                        console.log(textOrNull)
                    })
                })
            }));

            cy.task('deleteUserPunchCardByUserId', { userId: userId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteGlobalPoint', { userId: userId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteGlobalPointHistory', { userId: userId }).then((textOrNull) => {
                console.log(textOrNull)
            })


        });


        merchantUser = Cypress.env('merchant1');

        // Login as the merchant again
        cy.Login(merchantUser, password).then((response) => {
            merchantId = response.merchantID
            // Delete all orders using DB connection.
            cy.task('deleteOrders', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deletePromotions', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteProducts', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteProductGroups', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteStores', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteUserPointHistory', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteUserPunchCardByMerchandId', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            // CLEAR DASHBOARD

            cy.task('clearDailyDataActivity', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearDailyTotalPurchasedProducts', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearDailyUserPlatform', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearDailyUserRating', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearHourlyUserEngagement', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearMerchantStoreCustomer', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearMerchantStores', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearMonthlyActivityData', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearUserRatingOrder', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearWeeklyActivityData', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

        });

        merchantUser = Cypress.env('merchant2');

        // Login as the merchant again
        cy.Login(merchantUser, password).then((response) => {
            merchantId = response.merchantID
            // Delete all orders using DB connection.
            cy.task('deleteOrders', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deletePromotions', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteProducts', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteProductGroups', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteStores', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteUserPointHistory', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteUserPunchCardByMerchandId', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            // CLEAR DASHBOARD

            cy.task('clearDailyDataActivity', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearDailyTotalPurchasedProducts', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearDailyUserPlatform', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearDailyUserRating', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearHourlyUserEngagement', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearMerchantStoreCustomer', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearMerchantStores', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearMonthlyActivityData', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearUserRatingOrder', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('clearWeeklyActivityData', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

        });

        merchantUser = Cypress.env('merchant3');

        // Login as the merchant again
        cy.Login(merchantUser, password).then((response) => {
            merchantId = response.merchantID
            // Delete all orders using DB connection.
            cy.task('deleteOrders', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deletePromotions', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteProducts', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteProductGroups', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteStores', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteUserPointHistory', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            cy.task('deleteUserPunchCardByMerchandId', { merchantId: merchantId }).then((textOrNull) => {
                console.log(textOrNull)
            })

            // CLEAR DASHBOARD

            cy.task('clearDailyDataActivity',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearDailyTotalPurchasedProducts',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearDailyUserPlatform',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearDailyUserRating',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearHourlyUserEngagement',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearMerchantStoreCustomer',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearMerchantStores',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearMonthlyActivityData',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearUserRatingOrder',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

            cy.task('clearWeeklyActivityData',{merchantId: merchantId}).then((textOrNull) => {   
                console.log(textOrNull) 
            })

        });


    });
})
