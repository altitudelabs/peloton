var util = require('util');

var homePage = require('./CrowdBiteHomepage.js');

describe('Visitor HomePage', function() {

    beforeEach(function(){
        ptor = protractor.getInstance();
        homePage.get();
        ptor.waitForAngular();
    })

//    it('should show homepage', function() {
//
//        homePage.checkTitle("Real Estate Crowdfunding");
//
//
//        var arr  = homePage.getTopNav().then(function (arr){
//            expect(arr.length).toEqual(5);
//            expect(arr[0].getText()).toBe('TEAM');
//            expect(arr[1].getText()).toBe('FAQ');
//            expect(arr[2].getText()).toBe('CONTACT US');
//            expect(arr[3].getText()).toBe('LOGIN');
//            expect(arr[4].getText()).toBe('SIGN UP');
//        });
//
//    });

    it ('' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        '' +
        ' login', function () {

            ptor.get('http://localhost:3000/login');
            var email = homePage.getEmail();
            var password = homePage.getPassword();
            var button = ptor.findElement(protractor.By.css(".button"));

            button.click().then(function () {
                var error = element(by.css('#cheese'));
                error.getText().then( function (sam) {
                    expect(sam).toEqual('Missing credentials');
                })
            })

            email.sendKeys("admin@test.com");
            password.sendKeys('123');

            button.click().then(function () {

                homePage.checkNav('Deals', '/deals', 0, 6);

            })
        }
    );

    it('should show deals page', function() {
        homePage.checkNav('Deals', '/deals', 0, 6);
    });

    it('should show sponsor page', function() {
        homePage.checkNav('Sponsors', '/sponsors', 1, 6);
    });

    it('should show sponsor page', function() {
        homePage.checkNav('Users', '/users', 2, 6);
    })

    it('should show faq page', function() {
        homePage.checkNav('FAQ', '/faq', 3, 6);
    });

    it('should show contact us page', function() {
        homePage.checkNav('Contact Us', '/contact', 4, 6);
    });

    it('should have logout button  page', function() {

        homePage.checkMenuItem(5,"LOGOUT");
        homePage.checkNav('Login', '/login', 5, 5);

    });


});
