(function () {
    'use strict';

    angular
        .module('app')
        .factory('RankingSvc', RankingSvc);

    RankingSvc.$inject = ['$http', 'UtilsSvc'];

    function RankingSvc($http, UtilsSvc) {

        var service = {
          get: get,
          update : update
        };
        return service;

        function get(){
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/ranking").then(function(response){
            return response.data;
          });
          return promise;
        }

        function update() {
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/ranking/update").then(function(response){
            return response.data;
          });
          return promise;
        }

    }
})();
