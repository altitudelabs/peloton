//
// Investments Service
//

"use strict";

angular.module("psApp").factory("InvestmentsService", function ($resource) {

    return $resource("/api/users/:userId/investments", {
        id: "@id"
    }, {
        invest: {
            method: "POST",
            url: "/api/deals/:id/invest"
        }
    });
});
