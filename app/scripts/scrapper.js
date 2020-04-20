// const webdriver = require('selenium-webdriver');
const express = require('express')
const router = express.Router()
var admin = require("firebase-admin")
var serviceAccount = require("../scripts/service.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uiet-mdu-bc58d.firebaseio.com"
})


// const By = webdriver.By;

router.get('/test', function (req, res) {


    var registrationToken = 'fOMqeAI7L20:APA91bEYtnY-mshByqGEWIOwJW78vGHOW8C2oQSVAshXfy6ypscpE_msdjO1ETE1ge3o9po2Jv3HDPs2BdqMSQCs2QNNwM1ItIWs0bulJKIDt1tYeCMpWcBO_0i1I03Ou7owtkaRmJr6'

    var payload = {
        notification: {
            title: "Account Deposit",
            body: "A deposit to your savings account has just cleared."
        }
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function (response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        });

    // const driver = new webdriver.Builder()
    //     .forBrowser('firefox')
    //     .build();
    // driver.get('http://www.google.com/ncr');
    // driver.findElement(By.name('q')).sendKeys('webdriver');
    // driver.findElement(By.name('btnG')).click();
    // driver.wait(function() {
    //     return driver.getTitle().then(function(title) {
    //         console.log(title);
    //         return title === 'webdriver - Google Search';
    //     });
    // }, 5000).then(function() {
    //     res.status(200).send('Done');
    // }, function(error) {
    //     res.status(200).send(error);
    // });
    // driver.quit();
});

module.exports = router