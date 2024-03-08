/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const MongoClient = require('mongodb').MongoClient;

const mongodbURL = "mongodb+srv://";

const databaseMain = "timely";
const databaseDashboard = "merchant-dashboard-service";

module.exports = (on, config) => {
  on('task', {
    deleteOrders({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING ORDERS`)
            const db = client.db(databaseMain);
            db.collection('Orders').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteProducts({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING PRODUCTS`)
            const db = client.db(databaseMain);
            db.collection('Products').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteProductGroups({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING PRODUCT GROUPS`)
            const db = client.db(databaseMain);
            db.collection('ProductGroups').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deletePromotions({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING PROMOTIONS`)
            const db = client.db(databaseMain);
            db.collection('Promotions').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteStores({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING STORES`)
            const db = client.db(databaseMain);
            db.collection('MerchantStores').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteGlobalPoint({ userId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING GLOBAL POINTS`)
            const db = client.db(databaseMain);
            db.collection('UserPoint').remove({ userId: userId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteGlobalPointHistory({ userId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING GLOBAL POINTS HISTORY`)
            const db = client.db(databaseMain);
            db.collection('UserPointHistory').remove({ userId: userId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteUserPoint({ userId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING USER POINTS`)
            const db = client.db(databaseMain);
            db.collection('UserPoint').remove({ userId: userId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteUserPointHistory({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING USER POINTS HISTORY`)
            const db = client.db(databaseMain);
            db.collection('UserPointHistory').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteUserPunchHistory({ userPunchCardId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING USER PUNCHES HISTORY`)
            const db = client.db(databaseMain);
            db.collection('UserPunchCardHistory').remove({ userPunchCardId: userPunchCardId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteUserPunchCardByMerchandId({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING PUNCH CARD`)
            const db = client.db(databaseMain);
            db.collection('UserPunchCard').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    deleteUserPunchCardByUserId({ userId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`DELETING PUNCH CARD`)
            const db = client.db(databaseMain);
            db.collection('UserPunchCard').remove({ userId: userId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    updatePunchCard({ promotionId, punches, status }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`UPDATE PUNCHES`)
            const db = client.db(databaseMain);
            db.collection('UserPunchCard').updateOne({ promotionId: promotionId }, { $set: { punches: punches, status: status } }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    updateUserPoint({ userId, merchantId, point }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`UPDATE USER POINT`)
            const db = client.db(databaseMain);
            db.collection('UserPoint').updateOne({ userId: userId, merchantId: merchantId }, { $set: { point: point } }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  //CLEAR DASHBOARD - DATA 
  on('task', {
    clearDailyDataActivity({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - DAILY ACTIVITIES`)
            const db = client.db(databaseDashboard);
            db.collection('DailyActivityData').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearDailyTotalPurchasedProducts({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - DAILY TOTAL PURCHASED PRODUCT`)
            const db = client.db(databaseDashboard);
            db.collection('DailyTotalPurchasedProducts').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearDailyUserPlatform({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - USER PLATFORM`)
            const db = client.db(databaseDashboard);
            db.collection('DailyUserPlatform').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearDailyUserRating({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - DAILY USER RATING`)
            const db = client.db(databaseDashboard);
            db.collection('DailyUserRating').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearHourlyUserEngagement({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - HOURLY USER ENGAGEMENT`)
            const db = client.db(databaseDashboard);
            db.collection('HourlyUserEngagement').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearMerchantStoreCustomer({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - MERCHANT STORE CUSTOMER`)
            const db = client.db(databaseDashboard);
            db.collection('MerchantStoreCustomer').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearMerchantStores({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - MERCHANT STORES`)
            const db = client.db(databaseDashboard);
            db.collection('MerchantStores').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearMonthlyActivityData({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - MONTHLY ACTIVITY DATA`)
            const db = client.db(databaseDashboard);
            db.collection('MonthlyActivityData').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearUserRatingOrder({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - USER RATING ORDER`)
            const db = client.db(databaseDashboard);
            db.collection('UserRatingOrder').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task

  on('task', {
    clearWeeklyActivityData({ merchantId }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            console.log(`CLEAR DASHBOARD - WEEKLY ACTIVITY DATA`)
            const db = client.db(databaseDashboard);
            db.collection('WeeklyActivityData').remove({ merchantId: merchantId }, function (error, numOfDocs) {
              resolve({ success: numOfDocs })
              client.close();
            })
          }
        });
      }); // end of return Promise
    }
  }) // end of task


  on('task', {
    validateData({ promotionId, punches, status }) {
      return new Promise((resolve) => {

        MongoClient.connect(mongodbURL, (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            // console.log(`VALIDATE DATA`)
            const db = client.db(databaseMain);
            let file = []
            db.collection('Promotions').find({}).toArray(function (error, result) {

              result.forEach(promotion => {
                var calculatedRewardItems
                if (promotion.rewardProductList.length == 0) {
                  calculatedRewardItems = 0
                } else {

                  if ('quantity' in promotion.rewardProductList[0]) {
                    calculatedRewardItems = promotion.rewardProductList[0].quantity
                  } else {
                    console.log(promotion)
                    calculatedRewardItems = 1
                  }

                }

                if (calculatedRewardItems != promotion.rewardItems) {
                  console.log("ERROR IN DATA FIX")
                  console.log(promotion)
                  file.push(promotion)
                } else {
                  console.log("NO ERROR")
                }

              })


              // console.log(result)
              resolve({ success: result })
              client.close();

              var fs = require('fs');
              fs.writeFile("cypress/sample/test.json", JSON.stringify(file), function (err) {
                if (err) {
                  console.log(err);
                }
              });

            })



          }
        });
      }); // end of return Promise
    }
  }) // end of task


}

