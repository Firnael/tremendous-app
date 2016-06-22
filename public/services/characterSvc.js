(function () {
    'use strict';

    angular
        .module('app')
        .factory('CharacterSvc', CharacterSvc);

    CharacterSvc.$inject = ['$http', '$location'];

    function CharacterSvc($http, $location) {

        var service = {
            getCharacter: getCharacter,
            updateCollection: updateCollection
        };
        return service;

        function getCharacter(characterName){
            var url = 'http://' + $location.host() + ":" + $location.port() + "/api/character/info/";
            var promise = $http.get(url + characterName).then(function(response) {
                return response.data;
            });
            return promise;
        }

        function updateCollection(){
            var url = 'http://' + $location.host() + ":" + $location.port() + "/api/character/update-collection";
            var promise = $http.post(url).then(function(response) {
                return response.data;
            });
            return promise;
        }

    }
})();
