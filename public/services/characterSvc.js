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
            getRoster: getRoster,
            getMains: getMains,
            getRerollsWithoutMains: getRerollsWithoutMains,
            getByAccountId: getByAccountId,
            updateCharacter: updateCharacter,
            updateCollection: updateCollection,
            linkRerollToMain: linkRerollToMain,
            setRole: setRole
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

        // Get roster (guild rank 0, 1, 2 and 3)
        function getRoster() {
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/roster/").then(function(response) {
              return response.data;
          });
          return promise;
        }

        // Get mains (guild rank 0, 1, 2 and 3)
        function getMains(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/mains/").then(function(response) {
                return response.data;
            });
            return promise;
        }

        // Get rerolls without mains (accountId == 0)
        function getRerollsWithoutMains(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/rerolls/").then(function(response) {
                return response.data;
            });
            return promise;
        }

        function getByAccountId(accountId) {
          var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/character/account-id/" + accountId).then(function(response) {
              return response.data;
          });
          return promise;
        }

        // Set reroll accountId = main accountId
        function linkRerollToMain(reroll, main) {
            var data = {};
            data.reroll = reroll;
            data.main = main;

            var promise = $http.post(UtilsSvc.getUrlPrefix() + "/api/character/link/", data).then(function(response) {
                return response.data;
            });
            return promise;
        }

        // Set role to character among 0:Tank, 1:Heal, 2:DPS
        function setRole(characterName, role) {
          var data = {};
          data.characterName = characterName;
          data.role = role;

          var promise = $http.post(UtilsSvc.getUrlPrefix() + "/api/character/role/", data).then(function(response) {
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
