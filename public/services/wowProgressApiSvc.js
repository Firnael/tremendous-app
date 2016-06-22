(function () {
    'use strict';

    angular
        .module('app')
        .factory('WowProgressApiSvc', WowProgressApiSvc);

    WowProgressApiSvc.$inject = ['$http', '$location'];

    function WowProgressApiSvc($http, $location) {

        var prefix = 'http://';
        var url = prefix + $location.host() + ":" + $location.port();

        var service = {
            getTest: getTest
        };
        return service;

        function getTest(){
            var promise = $http.get(url + "/api/wowprogress/").then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();
