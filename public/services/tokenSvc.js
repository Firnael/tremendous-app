(function () {
    'use strict';

    angular
        .module('app')
        .factory('TokenSvc', TokenSvc);

    TokenSvc.$inject = ['$http', 'UtilsSvc'];

    function TokenSvc($http, UtilsSvc) {

      var service = {
        get: get
      };
      return service;

      // Get token infos
      function get(){
        var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/wowtoken").then(function(response) {
          return response.data;
        });
        return promise;
      }
    }

})();
