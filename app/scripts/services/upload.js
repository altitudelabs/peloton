//
// Upload Service
// - Handles multipart form posts
//
angular.module("psApp").factory("UploadService", function ($http) {

    return {

        //
        // Upload file
        //
        // @param config: Basic $http specification, for example:
        //
        // config: {
        //  url: "",
        //  data: {
        //    id: id
        //    file: file
        //  }
        //
        upload: function(config, success, error) {

            // Extend configuration -
            // 1. Override Angular's default transformRequest method
            // such that our data is left in tact
            // 2. Override Angular's default setting of content-type
            // (which is application/json). We need a multipart request.
            angular.extend(config, {
                method: "POST",
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            });

            return $http(config).success(success).error(error);
        }
    };

});