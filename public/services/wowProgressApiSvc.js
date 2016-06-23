(function () {
    'use strict';

    angular
        .module('app')
        .factory('WowProgressApiSvc', WowProgressApiSvc);

    WowProgressApiSvc.$inject = ['$http', 'UtilsSvc'];

    function WowProgressApiSvc($http, UtilsSvc) {

        var service = {
            getTest: getTest
        };
        return service;

        function getTest(){
            var promise = $http.get(UtilsSvc.getUrlPrefix() + "/api/wowprogress/").then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();
