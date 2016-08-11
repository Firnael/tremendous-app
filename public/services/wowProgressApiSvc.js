(function () {
    'use strict';

    angular
        .module('app')
        .factory('WowProgressApiSvc', WowProgressApiSvc);

    WowProgressApiSvc.$inject = ['$http', 'UtilsSvc'];

    function WowProgressApiSvc($http, UtilsSvc) {

        var service = {
          getGuildRank: getGuildRank,
          getServerRanking : getServerRanking
        };
        return service;

        function getGuildRank(){
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/wowprogress/guild-rank").then(function(response){
            return response.data;
          });
          return promise;
        }

        function getServerRanking() {
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/wowprogress/server-ranking").then(function(response){
            return response.data;
          });
          return promise;
        }

    }
})();
