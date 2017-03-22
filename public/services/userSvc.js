(function () {
  'use strict';

  angular
    .module('app')
    .factory('UserSvc', UserSvc);

  UserSvc.$inject = ['$http', '$rootScope', 'UtilsSvc'];

  function UserSvc($http, $rootScope, UtilsSvc) {

    var service = {
      updateThumbnail: updateThumbnail
    };
    return service;

    function updateThumbnail(thumbnail) {
      var data = { 'battletag': $rootScope.user.battletag, 'thumbnail': thumbnail };
      var promise = $http.post(UtilsSvc.getUrlPrefix() + '/api/user/thumbnail', data).then(function(response) {
        return response.data;
      });
      return promise;
    }
  }
})();
