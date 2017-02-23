(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['LogsSvc', 'TokenSvc', '$rootScope'];

    function HomeCtrl(LogsSvc, TokenSvc, $rootScope) {
      var vm = this;
      vm.logs = [];
      vm.token = {};
      vm.logsLoading = true;

      vm.getLogs = getLogs;
      vm.getTokenInfos = getTokenInfos;
      activate();

      //////////////

      function activate() {
        console.log('HomeCtrl activate');
        vm.getLogs();
        vm.getTokenInfos();

        // Get time left to wait before release in seconds
        // var currentDate = new Date();
        // var releaseDate = new Date('9/21/2016');
        // vm.countdown = (Math.abs(releaseDate.getTime() - currentDate.getTime()))/1000;
      }

      function getLogs() {
        LogsSvc.get().then(function (result) {
          for(var i=0; i<result.length; i++) {
            var log = result[i];
            if(log.zone >= 10) { // get only raid logs
              log.order = log.start;
              log.start = moment(log.start).format("DD/MM, HH:mm");
              log.end = moment(log.end).format("DD/MM, HH:mm");
              vm.logs.push(log);
            }
          }
          vm.logsLoading = false;
        });
      }

      function getTokenInfos() {
        TokenSvc.get().then(function (result) {
          vm.token.value = result.value;
          vm.token.moment = moment(result.lastUpdate).format("HH:mm");
        });
      }
    }
})();
