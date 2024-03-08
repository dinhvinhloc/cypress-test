describe('API012h6 - Fixed Discount on Item  - applied on all eligible items', function () {
    it('Test the Fixed Discount on Item applied all the eligible items (BP-1436).', function () {
        
        cy.fixture('test-data/created-data/stores.json').as('stores')

        var store1        

        // Get information of created store1 into variable.
                cy.waitUntil(() => cy.get('@stores').then((info)=>{
            store1 = info[0]
        }));            
        
        // Login as merchant to get the coupon code
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);

        cy.waitUntil(()=> cy.updateDeal(store1.dis10PerPG2P2,store1.dis10PerPG2P2.id));

        var deal
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.dis10PerPG2P2.id).then((response)=>{
            console.log(response);
            return deal = response
        })
        );
        
        // INACTIVATE ALL OTHER DEALS TO NARROW DOWN THE CONDITION
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.pointPerkPG3P5.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.punchCardPG1P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P1At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P2At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.freePG3P3At600.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.boPG3P4foPG1P1.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis10PerPG2P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis20CADONCART200CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.hiddenDiscount20CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis10PERONCART300CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.rewardPG1P2.id));  
      

        cy.wrap(deal).then(()=>{
            deal.rewardProductList.push({
                "id": store1.PG2P1.id,
                "groupIndex": null,
                "quantity": 1
            });
            deal.rewardProductList.push({
                "id": store1.PG2P3.id,
                "groupIndex": null,
                "quantity": 1
            });
            cy.updateDeal(deal,deal.id)
        })

        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);



        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // 1 x PG2P3, expect the discount applied on that single item
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P3.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 3.999);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P2.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 7.489);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));

        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG2P1.id,1,store1.AG2AO1.id,1).then((response)=>{
            console.log(response);
            expect(response.appliedPromotion[0]).to.have.property('id', deal.id);  
            expect(response).to.have.property('discountAmount', 10.539);
                        // Check Discounts
            cy.assertDiscount(response.items,response.discountAmount);
            // Check Tax
            cy.assertAmount(response.appliedTaxes,response.subAmount,response.discountAmount, response.totalAmount,response.serviceFee)

        }));



        // CHANGE BACK THE DEALS -------------------------------------------------
        var email = Cypress.env('merchant1');
        var password = Cypress.env('merchant1Pass');
        cy.Login(email, password);
        
        // cy.waitUntil(()=> cy.updateDeal(store1.deal10CADPG1P1PG2P1PG3P1,store1.deal10CADPG1P1PG2P1PG3P1.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.bundle100CADP3ALLGROUP,store1.bundle100CADP3ALLGROUP.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.pointPerkPG3P5,store1.pointPerkPG3P5.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.punchCardPG1P2,store1.punchCardPG1P2.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.freePG3P1At250,store1.freePG3P1At250.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.freePG3P2At250,store1.freePG3P2At250.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.freePG3P3At600,store1.freePG3P3At600.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.boPG3P4foPG1P1,store1.boPG3P4foPG1P1.id));
        cy.waitUntil(()=> cy.updateDeal(store1.dis10PerPG2P2,store1.dis10PerPG2P2.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.dis20CADONCART200CAD,store1.dis20CADONCART200CAD.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.hiddenDiscount20CAD,store1.hiddenDiscount20CAD.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.dis10PERONCART300CAD,store1.dis10PERONCART300CAD.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.rewardPG1P2,store1.rewardPG1P2.id));
        
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.deal10CADPG1P1PG2P1PG3P1.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.bundle100CADP3ALLGROUP.id));
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.pointPerkPG3P5.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.punchCardPG1P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P1At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P2At250.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.freePG3P3At600.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.boPG3P4foPG1P1.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis10PerPG2P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis20CADONCART200CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.hiddenDiscount20CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.dis10PERONCART300CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.rewardPG1P2.id));

        
    });
})
