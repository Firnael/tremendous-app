(function() {
    'use strict';

    angular
        .module('app')
        .controller('rosterCtrl', RosterCtrl);

    RosterCtrl.$inject = ['CharacterSvc', 'UtilsSvc'];

    function RosterCtrl(CharacterSvc, UtilsSvc){
        var vm = this;
        vm.roster = [];
        vm.updating = true;
        vm.updateCount = 0;
        vm.rosterSize = 0;

        vm.getRoster = getRoster;
        vm.getClassColor = getClassColor;
        vm.getIlvlColor = getIlvlColor;
        vm.getItemQualityColor = getItemQualityColor;
        vm.getAverageIlvl = getAverageIlvl;
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
            vm.updating = false;
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

        function getAverageIlvl() {
          var total = 0;
          for(var i=0; i<vm.roster.length; i++) {
            total += vm.roster[i].averageItemLevel;
          }
          return (total / vm.roster.length).toFixed(1);
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
