var selenium = require('selenium-webdriver');
var AttestBuilder = require('attest-webdriverjs');

var assert = require('chai').assert;

describe('Demo Page', function() {
   var driver, browser;

   // Load the browser
   before(function() {
       driver = new selenium.Builder().forBrowser('firefox');
       browser = driver.build();
       browser.manage().timeouts().setScriptTimeout(10000);
   });

   // Close the browser at the end
   after(function(done) {
       browser.quit().then(done);
   });

   describe('Homepage', function (done) {

       it('has 0 accessibility violations', function (done) {
           browser.get('http://localhost:3333/')
           .then(includeAttest)
           .then(function (attest) {
              attest.analyze(function(results) {
                if (results.violations.length > 0) {
                  console.log(results.violations);
                }
                assert.equal(results.violations.length, 0);
                done();
               });
           });
       });
   });

   /**
    * Returns a promise indicating when attest is ready to test the page
    */
   function includeAttest() {
       return browser.executeAsyncScript(function(callback) {
           var script = document.createElement('script');
           script.innerHTML = 'document.documentElement.classList.add("deque-attest-is-ready");';
           document.documentElement.appendChild(script);
           callback();

       }).then(function () {
           return browser.wait(selenium.until.elementsLocated(selenium.By.css('.deque-attest-is-ready')));

       }).then(function () {
           return new AttestBuilder(browser, 'wcag2');
       });
   }

});
