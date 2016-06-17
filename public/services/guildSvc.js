(function () {
    'use strict';

    angular
        .module('app')
        .factory('GuildSvc', GuildSvc);

    GuildSvc.$inject = ['$http', '$location'];

    function GuildSvc($http, $location) {

        var service = {
            update: update
        };
        return service;

        function update(data){
            var url = 'http://' + $location.host() + ":" + $location.port() + "/api/guild/update";
            var promise = $http.post(url, data).then(function(response) {
              return response.data;
            });
            return promise;
        }

    }
})();
