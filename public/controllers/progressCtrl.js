(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    ProgressCtrl.$inject = ['ProgressSvc'];

    function ProgressCtrl(ProgressSvc){
        var vm = this;
        vm.progress = undefined;
        vm.updating = true;

        vm.setProgress = setProgress;
        vm.getProgress = getProgress;
        vm.getProgressLastUpdate = getProgressLastUpdate;
        vm.updateProgress = updateProgress;
        activate();

        //////////////

        function activate() {
          console.log('ProgressCtrl activate');
          vm.getProgress();
        }

        function setProgress(data) {
          vm.progress = data;
          vm.updating = false;
        }

        function getProgress() {
          ProgressSvc.get().then(function(data){
            vm.setProgress(data);
          });
        }

        function getProgressLastUpdate() {
          return vm.progress ? moment(vm.progress.lastUpdate).calendar() : '';
        }

        function updateProgress() {
          vm.updating = true;
          ProgressSvc.update().then(function(data){
            vm.setProgress(data);
          });
        }
    }
})();
