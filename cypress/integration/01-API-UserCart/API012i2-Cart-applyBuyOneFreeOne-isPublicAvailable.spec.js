describe('API012i2 - Apply Buy One Get One Free Deal - isPublicAvailable = false', function () {
    it('Test the Buy One Get One on Item where isPublicAvailable = false', function () {
        
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

        cy.waitUntil(()=> cy.updateDeal(store1.boPG3P4foPG1P1,store1.boPG3P4foPG1P1.id));

        var deal;
        cy.waitUntil(() => 
        cy.getPromotionByID(store1.boPG3P4foPG1P1.id).then((response)=>{
          //  debugger;
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
        cy.waitUntil(() => cy.updatePromotionStatus("ACTIVE",store1.boPG3P4foPG1P1.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis10PerPG2P2.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis20CADONCART200CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.hiddenDiscount20CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.dis10PERONCART300CAD.id));  
        cy.waitUntil(() => cy.updatePromotionStatus("INACTIVE",store1.rewardPG1P2.id));  
      
        cy.wrap(deal).then(()=>{
           // debugger;
            deal.isPublicAvailable = false
            cy.updateDeal(deal,deal.id).then((response)=>{
                expect(response).to.have.property("isPublicAvailable",false)
            })
        })
    
        email = Cypress.env('enduser0001');
        password = Cypress.env('enduser0001Pass');
        cy.Login(email, password);

        cy.waitUntil(() => cy.clearUserCart(store1.storeID.id).then((response)=>{
           // debugger;
            expect(response).to.have.property('isCartEmpty', true);
        }));

        // Add 2 PG3P4 to the cart and expect discount 10% on Cart deal to be applied
        cy.waitUntil(() => cy.addItemToCart(store1.storeID.id,store1.PG3P4.id,2,null,null).then((response)=>{
            // Suggested Promotion should be empty because isPublic is false.
            console.log(response);
            expect(response.suggestedPromotion).to.be.an('array').that.is.empty;  
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
        cy.waitUntil(()=> cy.updateDeal(store1.boPG3P4foPG1P1,store1.boPG3P4foPG1P1.id));
        // cy.waitUntil(()=> cy.updateDeal(store1.dis10PerPG2P2,store1.dis10PerPG2P2.id));
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
