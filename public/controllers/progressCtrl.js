(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    ProgressCtrl.$inject = ['ProgressSvc'];

    function ProgressCtrl(ProgressSvc){
        var vm = this;
        vm.progress = undefined;

        vm.getProgress = getProgress;
        vm.getProgressLastUpdate = getProgressLastUpdate;
        activate();

        //////////////

        function activate() {
          console.log('ProgressCtrl activate');
          vm.getProgress();
        }

        function getProgress() {
          ProgressSvc.get().then(function(data){
            vm.progress = data;
          });
        }

        function getProgressLastUpdate() {
          return vm.progress ? moment(vm.progress.lastUpdate).calendar() : '';
        }
    }
})();
