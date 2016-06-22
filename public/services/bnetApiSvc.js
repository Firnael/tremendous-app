(function () {
    'use strict';

    angular
        .module('app')
        .factory('BnetApiSvc', BnetApiSvc);

    BnetApiSvc.$inject = ['$http', '$location'];

    function BnetApiSvc($http, $location) {

        var prefix = 'http://';
        var url = prefix + $location.host() + ":" + $location.port();

        var service = {
            getTest: getTest,
            getCharacterInfo: getCharacterInfo,
            getGuildInfo: getGuildInfo
        };
        return service;

        function getTest(){
            var promise = $http.get(url + "/api/bnet/").then(function(response){
                return response.data;
            });
            return promise;
        }

        function getCharacterInfo(characterName){
            if(characterName !== undefined) {
                var promise = $http.get(url + "/api/bnet/character/" + characterName).then(function(response){
                    return response.data;
                });
                return promise;
            }
        }

        function getGuildInfo(){
            var promise = $http.get(url + "/api/bnet/guild/members").then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();
