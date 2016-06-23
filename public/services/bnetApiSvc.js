(function () {
    'use strict';

    angular
        .module('app')
        .factory('BnetApiSvc', BnetApiSvc);

    BnetApiSvc.$inject = ['$http', 'UtilsSvc'];

    function BnetApiSvc($http, UtilsSvc) {

        var service = {
            getTest: getTest,
            getCharacterInfo: getCharacterInfo,
            getGuildInfo: getGuildInfo
        };
        return service;

        function getTest(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/bnet/").then(function(response){
                return response.data;
            });
            return promise;
        }

        function getCharacterInfo(characterName){
            if(characterName !== undefined) {
                var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/bnet/character/" + characterName).then(function(response){
                    return response.data;
                });
                return promise;
            }
        }

        function getGuildInfo(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/bnet/guild/members").then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();
