(function () {
    'use strict';

    angular
        .module('app')
        .factory('CharacterSvc', CharacterSvc);

    CharacterSvc.$inject = ['$http', 'UtilsSvc'];

    function CharacterSvc($http, UtilsSvc) {

        var service = {
            getCharacter: getCharacter,
            getCharacters: getCharacters,
            updateCharacter: updateCharacter,
            updateCollection: updateCollection
        };
        return service;

        // Get one
        function getCharacter(characterName){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/info/" + characterName).then(function(response) {
                return response.data;
            });
            return promise;
        }

        // Get all
        function getCharacters(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/").then(function(response) {
                return response.data;
            });
            return promise;
        }

        // Update one
        function updateCharacter(characterName){
            var promise = $http.post(UtilsSvc.getUrlPrefix() + "/api/character/update/" + characterName).then(function(response) {
                return response.data;
            });
            return promise;
        }

        // Update all
        function updateCollection(){
            var promise = $http.post(UtilsSvc.getUrlPrefix() + "/api/character/update-collection").then(function(response) {
                return response.data;
            });
            return promise;
        }

    }
})();
