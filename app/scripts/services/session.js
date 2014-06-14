//
// Session Service
//

'use strict';

angular.module('psApp').factory('Session', function ($resource) {

    return $resource('/api/session/');
});
