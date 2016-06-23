(function () {
    'use strict';

    angular
        .module('app')
        .factory('CharacterSvc', CharacterSvc);

    CharacterSvc.$inject = ['$http', 'UtilsSvc'];

    function CharacterSvc($http, UtilsSvc) {

        var service = {
            getCharacter: getCharacter,
            updateCollection: updateCollection
        };
        return service;

        function getCharacter(characterName){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/info/" + characterName).then(function(response) {
                return response.data;
            });
            return promise;
        }

        function updateCollection(){
            var promise = $http.post(UtilsSvc.getUrlPrefix() + "/api/character/update-collection").then(function(response) {
                return response.data;
            });
            return promise;
        }

    }
})();
