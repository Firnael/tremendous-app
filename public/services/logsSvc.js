(function () {
    'use strict';

    angular
        .module('app')
        .factory('LogsSvc', LogsSvc);

    LogsSvc.$inject = ['$http', 'UtilsSvc'];

    function LogsSvc($http, UtilsSvc) {

      var service = {
        get: get
      };
      return service;

      function get(){
        var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/warcraftlogs").then(function(response) {
          return response.data;
        });
        return promise;
      }

    }
})();
