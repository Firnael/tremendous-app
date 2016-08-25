(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    ProgressCtrl.$inject = ['ProgressSvc'];

    function ProgressCtrl(ProgressSvc){
        var vm = this;
        vm.progress = undefined;
        vm.updating = false;

        vm.getProgress = getProgress;
        vm.getProgressLastUpdate = getProgressLastUpdate;
        vm.updateProgress = updateProgress;
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

        function updateProgress() {
          vm.updating = true;
          ProgressSvc.update().then(function(data){
            vm.progress = data;
            vm.updating = false;
          });
        }
    }
})();
