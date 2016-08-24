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
          vm.getRosterInfos();
        }

        function getRoster() {
          CharacterSvc.getRoster().then(function(data){
            vm.roster = data;
            vm.updating = false;
          });
        }

        function getRosterInfos() {
          RosterSvc.get().then(function (data) {
            vm.rosterInfos = data;
            console.log(vm.rosterInfos);
          });
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
              console.log(vm.updateCount + '/' + vm.rosterSize + ' (' + raider.name + ')');

              if(vm.updateCount === vm.rosterSize) {
                console.log('Jobz done');
                vm.getRoster();
              }
            });
          }
        }

        function getUpdateProgress() {
          return vm.updateCount > 0 ? (vm.updateCount / vm.rosterSize) * 100 : 0;
        }
    }
})();
