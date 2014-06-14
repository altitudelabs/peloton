//
// Deal Service
// - Service
//

"use strict";

angular.module("psApp").factory("DealsService", function ($resource) {

    return $resource("/api/deals/:id", {
        id: "@id"
    }, {
        invest: {
            method: "POST",
            url: "/api/deals/:id/invest"
        },
        isInvestor: {
            method: "GET",
            url: "/api/deals/:id/investors/me"
        }
    });
});
