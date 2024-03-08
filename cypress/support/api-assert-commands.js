/*
 * Login to a specific user
 * @param {string} username
 * @param {string} password
 * @returns {string} - returns auth token cookie string when chained with .then()
 */
import 'cypress-file-upload';
import '@bahmutov/cy-api/support';
import 'cypress-localstorage-commands';
const JSONbig = require('json-bigint')({ 'storeAsString': true });
import { hex2ascii } from 'hex2ascii';
import 'cypress-wait-until';

const logging = Cypress.env('fileLogging');

Cypress.Commands.add('assertTaxItem', (itemName, quantity, discount, taxesToBeAsserted) => {
    cy.fixture('test-data/created-data/stores.json').as('stores')
    cy.fixture('test-data/created-data/tax_config.json').as('taxes')

    var store1
    var taxConfig
    var taxes = [];
    var price
    var taxConfigIds

    // Get information of created store1 into variable.
    cy.waitUntil(() => cy.get('@stores').then((info) => {
        store1 = info[0]
    }));

    // Get all tax configure of the store created.
    cy.waitUntil(() => cy.get('@taxes').then((info) => {
        taxConfig = info
    }));

    cy.wrap(store1).then(() => {

        price = store1[itemName].price
        var productTaxConfigs = store1[itemName].productTaxConfigs
        productTaxConfigs.forEach(function (item) {
            if (item.storeId == store1.storeID.id) {
                taxConfigIds = item.taxConfigIds
            }
        });
        cy.wrap(taxConfigIds).each((taxId) => {
            var tax = {
                "taxAmount": 0,
                "taxPercentage": 0,
                "taxType": ""
            };

            cy.wrap(taxConfig).then(() => {
                taxConfig.forEach(function (configuredTax) {
                    if (configuredTax.id == taxId) {
                        tax.taxAmount = parseFloat(((quantity * price - discount) * configuredTax.percentage / 100).toFixed(8))
                        tax.taxPercentage = configuredTax.percentage
                        tax.taxType = configuredTax.taxType
                    }
                })
                if (tax.taxAmount > 0) {
                    taxes.push(tax);
                }
            })
        }).then(() => {

            console.log("Calculated taxes: " + itemName + ", " + quantity + ", " + discount, taxes);
            console.log("Validating taxes", taxesToBeAsserted);


            expect(taxes, "Self-calculated taxes to be equal to give appliedTaxes").to.deep.equal(taxesToBeAsserted)
        })
    })

})

Cypress.Commands.add('assertDiscount', (items, discount) => {
    var calculatedDiscount = 0
    var roundedCalculatedDiscount = 0
    cy.wrap(items).each((item) => {
        calculatedDiscount += item.totalDiscountAmount
        item.addons.forEach((addon) => {
            calculatedDiscount += addon.totalDiscountAmount
        })
    }).then(() => {
        roundedCalculatedDiscount = parseFloat(calculatedDiscount.toFixed(8))
    }).then(() => {
        expect(roundedCalculatedDiscount, "Discount to be equal to self-calculated discount").to.equal(discount)
    })
})

Cypress.Commands.add('assertAmount', (appliedTaxes, subAmount, discount, totalAmount, serviceFee) => {
    var totalTaxAmount = 0;
    cy.wrap(appliedTaxes).each((taxObj) => {
        totalTaxAmount += taxObj.taxAmount
    }).then(() => {
        console.log("Total Tax is: ", totalTaxAmount);
        expect(totalAmount, "TotalAmount to be equal to self calculated total Amount").to.equal(parseFloat((totalTaxAmount + subAmount + serviceFee - discount).toFixed(8)))

        // expect(totalAmount).to.equal(parseFloat(totalTaxAmount.toFixed(8)) + parseFloat((subAmount - discount).toFixed(8)))
    })
})


Cypress.Commands.add('assertDeliveryTax', (distance, deliveryPrice, taxesToBeAsserted) => {
    cy.fixture('test-data/created-data/stores.json').as('stores')
    cy.fixture('test-data/created-data/tax_config.json').as('taxes')

    var store1
    var taxConfig
    var taxes = [];
    var price
    var taxConfigIds

    // Get information of created store1 into variable.
    cy.waitUntil(() => cy.get('@stores').then((info) => {
        store1 = info[0]
    }));

    // Get all tax configure of the store created.
    cy.waitUntil(() => cy.get('@taxes').then((info) => {
        taxConfig = info
    }));

    cy.wrap(store1).then(() => {

        console.log("Delivery Rules: ", store1.storeID.deliveryRules);

        for (let i = 0; i < store1.storeID.deliveryRules.length; i++) {
            if (store1.storeID.deliveryRules[i].price == deliveryPrice && distance > store1.storeID.deliveryRules[i - 1].distance && distance <= store1.storeID.deliveryRules[i].distance) {
                taxConfigIds = store1.storeID.deliveryRules[i].taxConfigIds
            }

        }

        cy.wrap(taxConfigIds).each((taxId) => {
            var tax = {
                "taxAmount": 0,
                "taxPercentage": 0,
                "taxType": ""
            };

            cy.wrap(taxConfig).then(() => {
                taxConfig.forEach(function (configuredTax) {
                    if (configuredTax.id == taxId) {
                        tax.taxAmount = parseFloat((deliveryPrice * configuredTax.percentage / 100).toFixed(8))
                        tax.taxPercentage = configuredTax.percentage
                        tax.taxType = configuredTax.taxType
                    }
                })
                if (tax.taxAmount > 0) {
                    taxes.push(tax);
                }
            })
        }).then(() => {

            console.log("Calculated taxes: ", taxes);
            console.log("Validating taxes", taxesToBeAsserted);


            expect(taxes, "Self Calculated delivery taxes are equal to given appliedTaxes on delivery").to.deep.equal(taxesToBeAsserted)
        })
    })

})

// assertItemsInCartVSRedeemProductList
// Input: complete JSON of items [] of cart object
//        promotionId (Punch Card or Reward)
//        redeemProductList was used to add redeem items to cart


Cypress.Commands.add('assertRedeemProductListAddedToCart', (cart, promotionId, redeemProductList) => {
    // Assert that the cart contain the items with given promotionId
    let promotionIdList = cart.items.map(item => item.appliedPromotionId);
    expect(promotionIdList).to.contain(promotionId);

    // Assert the number of items in cart for the given promotion match the number of item in redeemProductList
    var numberOfItemsAppliedGivenPromotion = promotionIdList.reduce(function (n, val) {
        return n + (val === promotionId);
    }, 0);

    expect(numberOfItemsAppliedGivenPromotion).to.equal(redeemProductList.length);

    cy.wrap(redeemProductList).each((redeemItem) => {
        cy.wrap(cart.items).each((item) => {
            if (item.productId == redeemItem.productId && item.appliedPromotionId == promotionId) {
                expect(item.appliedPromotionId, "PromotionId is equal to given in redeemProductList").to.equal(promotionId);
                expect(item.quantity, "Product Quantity on item equal to given in redeemProductList").to.equal(redeemItem.quantity)
                // Assert that the number of addons of relevant item equal to the number of addons in the given redeemItem
                expect(item.addons.length, "Number of addnons equal to given in redeemProductList").to.equal(redeemItem.addons.length)

                // Loop through each addon of the item and the redeemItem, check the quantity and instruction
                cy.wrap(redeemItem.addons).each((redeemAddon) => {
                    cy.wrap(item.addons).each((itemAddon) => {
                        if (redeemAddon.productId == itemAddon.productId) {
                            expect(redeemAddon.quantity, "Addon Quantity on item equal to given in redeemProductList").to.equal(itemAddon.quantity)
                            expect(redeemAddon.instruction, "Addon instruction equal to given in redeemProductList").to.equal(itemAddon.instruction)
                        }
                    })
                })
            }
        })
    })
})



Cypress.Commands.add('assertPromotionApplied', (cart, promotion) => {
    // Assert that the appliedPromotion contain the given promotionId
    let promotionIdList = cart.appliedPromotion.map(promotion => promotion.id);
    expect(promotionIdList).to.contain(promotion.id);

    cy.wrap(cart.appliedPromotion).each((appliedPromotion) => {
        if (appliedPromotion.id == promotion.id) {
            if (promotion.type == "REWARD_ITEM") {
                expect(appliedPromotion.type, "Applied promption type is REWARD_ITEM").to.equal("REWARD_ITEM")
                expect(appliedPromotion.requiredPoints, "Assert requiredPoints").to.equal(promotion.requiredPoints)
            } if (promotion.type == "PUNCH_CARD") {
                expect(appliedPromotion.type, "Applied promption type is PUNCH_CARD_REDEEM").to.equal("PUNCH_CARD_REDEEM")
                expect(appliedPromotion.requiredPunches, "Assert requiredPunches").to.equal(promotion.requiredPunches)
            }
        }
    })
})

Cypress.Commands.add('assertFreeItemsInCartVSTheirPromotionsApplied', (order) => {
    // Assert that the appliedPromotion contain the given promotionId

    var itemsList = order.items
    var appliedPromotions = order.promotions

    cy.wrap(appliedPromotions).each((promotion) => {
        if (promotion.dealType == "DEAL_FREE_ITEM") {
            var addonCost = 0;
            if (!promotion.isAddonCharged) {
                cy.wrap(itemsList).each((item) => {
                    if (item.appliedPromotionId == promotion.id) {
                        cy.wrap(item.addons).each((addon) => {
                            addonCost += addon.price
                        })
                    }
                })
            }

            cy.wrap(addonCost).then(() => {
                expect(promotion.addonDiscountAmount, "Assert addonDiscountAmount").to.equal(addonCost)
            })
        }
    })


})