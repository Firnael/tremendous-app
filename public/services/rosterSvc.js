(function () {
    'use strict';

    angular
        .module('app')
        .factory('RosterSvc', RosterSvc);

    RosterSvc.$inject = ['$http', 'UtilsSvc'];

    function RosterSvc($http, UtilsSvc) {

      var service = {
        get: get,
        update: update
      };
      return service;

      // Get roster infos
      function get(){
        var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/roster").then(function(response) {
          return response.data;
        });
        return promise;
      }

      // Update roster infos
      function update() {
        var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/roster/update").then(function(response) {
          return response.data;
        });
        return promise;
      }
    }

})();
