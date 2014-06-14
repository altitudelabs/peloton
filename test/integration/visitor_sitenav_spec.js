var util = require('util');

var homePage = require('./CrowdBiteHomepage.js');

describe('Visitor HomePage', function() {

    beforeEach(function(){
        ptor = protractor.getInstance();
        homePage.get();
        ptor.waitForAngular();
    })

    it('should show homepage', function() {

        homePage.checkTitle("Real Estate Crowdfunding");


        var arr  = homePage.getTopNav().then(function (arr){
            expect(arr.length).toEqual(5);
            expect(arr[0].getText()).toBe('TEAM');
            expect(arr[1].getText()).toBe('FAQ');
            expect(arr[2].getText()).toBe('CONTACT US');
            expect(arr[3].getText()).toBe('LOGIN');
            expect(arr[4].getText()).toBe('SIGN UP');
        });

    });

    it('should show team page', function() {
        homePage.checkNav('Our Team', '/team', 0, 5);
    });

    it('should show faq page', function() {
        homePage.checkNav('FAQ', '/faq', 1, 5);
    });

    it('should show contact us page', function() {
        homePage.checkNav('Contact Us', '/contact', 2, 5);
    });

    it('should show login  page', function() {
        homePage.checkNav('Login', '/login', 3, 5);
    });

    it('should show signup  page', function() {
        homePage.checkNav('Sign Up!', '/signup', 4, 5);
    });

});
