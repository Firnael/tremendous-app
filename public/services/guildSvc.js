(function () {
    'use strict';

    angular
        .module('app')
        .factory('GuildSvc', GuildSvc);

    GuildSvc.$inject = ['$http', '$location'];

    function GuildSvc($http, $location) {

        var prefix = 'http://';
        var url = prefix + $location.host() + ":" + $location.port();

        var service = {
            update: update
        };
        return service;

        function update(){
            var promise = $http.post(url + "/api/guild/update").then(function(response) {
                return response.data;
            });
            return promise;
        }

    }
})();
