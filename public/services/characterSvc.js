(function () {
    'use strict';

    angular
        .module('app')
        .factory('CharacterSvc', CharacterSvc);

    CharacterSvc.$inject = ['$http', '$location'];

    function CharacterSvc($http, $location) {

        var service = {
            update: update
        };
        return service;

        function update(){
            var url = 'http://' + $location.host() + ":" + $location.port() + "/api/character/update";
            var promise = $http.post(url).then(function(response) {
              return response.data;
            });
            return promise;
        }

    }
})();
