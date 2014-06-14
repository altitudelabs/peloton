//
// User Service
// - Service
//

"use strict";

angular.module("psApp").factory("UsersService", function ($resource) {
    return $resource("/api/users/:id", {
        id: "@id"
    }, {
        update: {
            method: "PUT",
            params: {}
        },
        get: {
            method: "GET",
            params: {
                id:"me"
            }
        },
        deactivate: {
            method: "POST",
            url: "/api/users/:id/deactivate"
        },
        reactivate: {
            method: "POST",
            url: "/api/users/:id/reactivate"
        },
        requestResetPassword: {
            method: "POST",
            url: "/api/users/password/request-reset"
        },
        resetPassword: {
            method: "POST",
            url: "/api/users/password/reset"
        }
    });
});
