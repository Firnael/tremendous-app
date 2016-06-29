(function () {
    'use strict';

    angular
        .module('app')
        .factory('WowProgressApiSvc', WowProgressApiSvc);

    WowProgressApiSvc.$inject = ['$http', 'UtilsSvc'];

    function WowProgressApiSvc($http, UtilsSvc) {

        var service = {
            getGuildRank: getGuildRank
        };
        return service;

        function getGuildRank(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/wowprogress/").then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();
