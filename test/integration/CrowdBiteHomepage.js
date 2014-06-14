
var CrowdBiteHomePage = function() {

    this.get = function() {
        ptor.get('http://localhost:3000/');
    };

    this.checkTitle = function (text){
        ptor.getTitle().then(function (title) {
                expect(title).toBe('Crowdbite | '+ text);
            }
        );
    }

    this.checkCurrentURL = function (expectedURL) {

        ptor.getCurrentUrl().then(function (actualURL){
            expect(actualURL).toContain(expectedURL);
        })
    }

    this.getTopNav = function(){
        return ptor.findElements(protractor.By.css('.nav li a'));
    }

    this.checkMenuItem = function(index, text){
        return this.getTopNav().then(
            function(arr) {
                var item = arr[index];
                item.getText().then( function (txt) {
                    expect(txt).toEqual(text);
                });
            }
        );
    }

    this.checkNav = function (title, url, index, length){

        var that = this;
        this.getTopNav().then(function(arr) {

            arr[index].click().then(function(arr){

                that.checkTitle(title);
                that.checkCurrentURL(url);

                that.getTopNav().then(function(arr) {
                    expect(arr.length).toEqual(length);
                });
            });
        });

    }

    this.getEmail = function () {
        return element(by.model('user.email'));
    };

    this.getPassword = function () {
        return element(by.model('user.password'));
    };

};

module.exports = new CrowdBiteHomePage();
