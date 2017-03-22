(function() {
    'use strict';

    angular
        .module('app')
        .controller('raidCtrl', RaidCtrl);

    RaidCtrl.$inject = ['LogsSvc'];

    function RaidCtrl(LogsSvc) {
      var vm = this;
      vm.logs = [];
      vm.logsLoading = true;

      vm.getLogs = getLogs;
      activate();

      //////////////

      function activate() {
        console.log('RaidCtrl activate');
        vm.getLogs();
      }

      function getLogs() {
        LogsSvc.get().then(function (result) {
          for(var i=0; i<result.length; i++) {
            var log = result[i];
            // if(log.zone >= 10) { // get only raid logs
            log.order = log.start;
            vm.logs.push(log);
            // }
          }
          vm.logsLoading = false;
        });
      }

    }
})();
