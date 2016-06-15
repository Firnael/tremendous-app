(function () {
    'use strict';

    angular
        .module('app')
        .factory('BnetApiSvc', BnetApiSvc);

    BnetApiSvc.$inject = ['$http', '$location'];

    function BnetApiSvc($http, $location) {

        var prefix = 'http://';
        var service = {
            getTest: getTest,
            getCharacterInfo: getCharacterInfo,
            getGuildMembers: getGuildMembers,
            getGuildNews: getGuildNews
        };
        return service;

        function getTest(){
            var promise = $http.get(prefix + $location.host() + ":" + $location.port() + "/api/bnet/").then(function(response){
                return response.data;
            });
            return promise;
        }

        function getCharacterInfo(characterName){
            if(characterName !== undefined) {
                var promise = $http.get(prefix + $location.host() + ":" + $location.port() + "/api/bnet/character/" + characterName).then(function(response){
                    return response.data;
                });
                return promise;
            }
        }

        function getGuildMembers(){
            var promise = $http.get(prefix + $location.host() + ":" + $location.port() + "/api/bnet/guild/members").then(function(response){
                return response.data;
            });
            return promise;
        }

        function getGuildNews(){
            var promise = $http.get(prefix + $location.host() + ":" + $location.port() + "/api/bnet/guild/news").then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();
