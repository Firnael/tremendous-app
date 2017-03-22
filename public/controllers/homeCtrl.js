(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['TokenSvc', '$rootScope'];

    function HomeCtrl(TokenSvc, $rootScope) {
      var vm = this;
      vm.logs = [];
      vm.logsLoading = true;
      vm.token = {};

      vm.getTokenInfos = getTokenInfos;
      activate();

      //////////////

      function activate() {
        console.log('HomeCtrl activate');
        vm.getTokenInfos();

        // Get time left to wait before release in seconds
        // var currentDate = new Date();
        // var releaseDate = new Date('9/21/2016');
        // vm.countdown = (Math.abs(releaseDate.getTime() - currentDate.getTime()))/1000;
      }

      function getTokenInfos() {
        TokenSvc.get().then(function (result) {
          vm.token.value = result.value;
          vm.token.moment = moment(result.lastUpdate).format("HH:mm");
        });
      }
    }
})();
