(function () {
  'use strict';

  angular
    .module('app')
    .factory('UserSvc', UserSvc);

  UserSvc.$inject = ['$http', '$rootScope', 'UtilsSvc'];

  function UserSvc($http, $rootScope, UtilsSvc) {

    var service = {
      match: match
    };
    return service;

    function match(battletag) {
      var data = { 'battletag': battletag };
      var promise = $http.post(UtilsSvc.getUrlPrefix() + '/api/user/match', data).then(function(response) {
        return response.data;
      });
      return promise;
    }
  }
})();
