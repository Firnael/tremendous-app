(function () {
    'use strict';

    angular
        .module('app')
        .factory('CharacterSvc', CharacterSvc);

    CharacterSvc.$inject = ['$http', '$location'];

    function CharacterSvc($http, $location) {

        var prefix = 'http://';
        var url = prefix + $location.host() + ":" + $location.port();

        var service = {
            getCharacter: getCharacter,
            updateCollection: updateCollection
        };
        return service;

        function getCharacter(characterName){
            var promise = $http.get(url + "/api/character/info/" + characterName).then(function(response) {
                return response.data;
            });
            return promise;
        }

        function updateCollection(){
            var promise = $http.post(url + "/api/character/update-collection").then(function(response) {
                return response.data;
            });
            return promise;
        }

    }
})();
