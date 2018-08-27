(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProgressSvc', ProgressSvc);

    ProgressSvc.$inject = ['$http', 'UtilsSvc'];

    function ProgressSvc($http, UtilsSvc) {

        var service = {
            get: get,
            update: update
        };
        return service;

        // Get progress info for guild "Wyrd"
        function get() {
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/progress").then(function(response) {
            return response.data;
          });
          return promise;
        };

        // Update progress based on raiders achievs
        function update(){
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/progress/update").then(function(response) {
            return response.data;
          });
          return promise;
        };

    }
})();
