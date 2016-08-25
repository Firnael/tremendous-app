(function() {
    'use strict';

    angular
        .module('app')
        .controller('rosterCtrl', RosterCtrl);

    RosterCtrl.$inject = ['CharacterSvc', 'RosterSvc', 'UtilsSvc'];

    function RosterCtrl(CharacterSvc, RosterSvc, UtilsSvc){
        var vm = this;
        vm.roster = [];
        vm.rosterInfos = undefined;
        vm.updating = true;
        vm.updateCount = 0;
        vm.rosterSize = 0;

        vm.getRoster = getRoster;
        vm.getRosterInfos = getRosterInfos;
        vm.getRosterLastUpdate = getRosterLastUpdate;
        vm.getClassColor = getClassColor;
        vm.getIlvlColor = getIlvlColor;
        vm.getItemQualityColor = getItemQualityColor;
        vm.updateRoster = updateRoster;
        vm.getUpdateProgress = getUpdateProgress;
        activate();

        //////////////

        function activate() {
          console.log('RosterCtrl activate');
          vm.getRoster();
        }

        function getRoster() {
          CharacterSvc.getRoster().then(function(data){
            vm.roster = data;
            vm.getRosterInfos();
          });
        }

        function getRosterInfos() {
          RosterSvc.get().then(function (data) {
            vm.rosterInfos = data;
            vm.updating = false;
          });
        }

        function getRosterLastUpdate() {
          return vm.rosterInfos ? moment(vm.rosterInfos.lastUpdate).calendar() : '';
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value);
        }

        function getIlvlColor(value) {
          return UtilsSvc.getCssClassByIlvl(value);
        }

        function getItemQualityColor(value) {
          return UtilsSvc.getCssClassByQuality(value, true);
        }

        function updateRoster() {
          vm.updating = true;
          vm.rosterSize = vm.roster.length;
          vm.updateCount = 0;

          for(var i=0; i<vm.roster.length; i++) {
            var raider = vm.roster[i];
            CharacterSvc.updateCharacter(raider.name).then(function(data){
              vm.updateCount++;
              if(vm.updateCount === vm.rosterSize) {
                RosterSvc.update().then(function () {
                  vm.getRoster();
                });
              }
            });
          }
        }

        function getUpdateProgress() {
          return vm.updateCount > 0 ? (vm.updateCount / vm.rosterSize) * 100 : 0;
        }
    }
})();
