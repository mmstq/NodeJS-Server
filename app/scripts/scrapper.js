const webdriver = require('selenium-webdriver');
const express = require('express')
const router = express.Router()

const By = webdriver.By;

router.get('/test', function (req, res) {
    const driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(function() {
        return driver.getTitle().then(function(title) {
            console.log(title);
            return title === 'webdriver - Google Search';
        });
    }, 5000).then(function() {
        res.status(200).send('Done');
    }, function(error) {
        res.status(200).send(error);
    });
    driver.quit();
});

module.exports = router