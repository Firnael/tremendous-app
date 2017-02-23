(function () {
    'use strict';

    angular
        .module('app')
        .factory('BnetApiSvc', BnetApiSvc);

    BnetApiSvc.$inject = ['$http', '$rootScope', 'UtilsSvc'];

    function BnetApiSvc($http, $rootScope, UtilsSvc) {

        var service = {
          getUserCharacters: getUserCharacters
        };
        return service;

        function getUserCharacters() {
          var promise = $http.get(UtilsSvc.getUrlPrefix() + '/api/bnet/characters/' + $rootScope.user.token).then(function(response){
            return response.data;
          });
          return promise;
        }
    }
})();
