(function () {
    'use strict';

    angular
        .module('app')
        .factory('GuildSvc', GuildSvc);

    GuildSvc.$inject = ['$http', 'UtilsSvc'];

    function GuildSvc($http, UtilsSvc) {

        var service = {
            update: update
        };
        return service;

        function update(){
            var promise = $http.post(UtilsSvc.getUrlPrefix() + "/api/guild/update").then(function(response) {
                return response.data;
            });
            return promise;
        }

    }
})();
