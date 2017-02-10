(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['LogsSvc', 'TokenSvc'];

    function HomeCtrl(LogsSvc, TokenSvc){
      var vm = this;
      vm.logs = [];
      vm.token = {};

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
              vm.logs.push(log);
            }
          }
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
