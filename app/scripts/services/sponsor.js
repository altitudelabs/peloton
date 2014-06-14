//
// Sponsor Service
// - Service
//
// $resource - generates constructor function augmented
// with methods to interact with RESTful endpoint: query,
// get, save, delete
//

"use strict";

angular.module("psApp").factory("SponsorsService", function ($resource) {

    var baseUrlPeople = "/api/sponsors/:sponsorId/people";
    var baseUrlProperties = "/api/sponsors/:sponsorId/properties";

    return $resource("/api/sponsors/:id", {
        id: "@id"
    }, {
        update: {
          method: "PUT"
        },
        people: {
            method: "GET",
            isArray: true,
            url: baseUrlPeople
        },
        createPerson: {
            method: "POST",
            url: baseUrlPeople
        },
        updatePerson: {
            method: "PUT",
            url: baseUrlPeople + "/:id"
        },
        deletePerson: {
            method: "DELETE",
            url: baseUrlPeople + "/:id"
        },
        properties: {
            method: "GET",
            isArray: true,
            url: baseUrlProperties
        },
        createProperty: {
            method: "POST",
            url: baseUrlProperties
        },
        updateProperty: {
            method: "PUT",
            url: baseUrlProperties + "/:id"
        },
        deleteProperty: {
            method: "DELETE",
            url: baseUrlProperties + "/:id"
        }
    });

});
