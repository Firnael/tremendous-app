(function() {
    'use strict';

    angular
        .module('app')
        .controller('mythicCtrl', MythicCtrl);

    MythicCtrl.$inject = ['CharacterSvc', 'UtilsSvc'];

    function MythicCtrl(CharacterSvc, UtilsSvc){
        var vm = this;
        vm.roster = [];
        vm.selectedDungeon = undefined;
        vm.updating = true;
        vm.lastUpdate = new Date().getTime();
        vm.lastWeekWednesdayAt3Am = moment().day(-4).hour(3).minute(0).second(0);
        vm.thisWeekWednesdayAt3Am = moment().day(3).hour(3).minute(0).second(0);

        vm.getRoster = getRoster;
        vm.update = update;
        vm.selectDungeon = selectDungeon;
        vm.getClassColor = getClassColor;
        vm.checkResetTimer = checkResetTimer;
        activate();

        //////////////

        function activate() {
          console.log('MythicCtrl activate');
          vm.getRoster();
        }

        function getRoster() {
          CharacterSvc.getRoster().then(function(data){
            vm.roster = data;
            vm.updating = false
          });
        }

        function update() {
          console.log('Update Mythic+');
        }

        function selectDungeon(dungeonId) {
          vm.selectedDungeon = dungeonId;
          console.log('vm.selectedDungeon: ' + vm.selectedDungeon);
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value, false);
        }

        function checkResetTimer(timestamp) {
          if(vm.thisWeekWednesdayAt3Am.isBefore(moment())) {
            // on est après le reset de cette semaine
            if(moment(timestamp).isAfter(vm.thisWeekWednesdayAt3Am)) {
              // timestamp est après le reset, gg
              return true;
            }
          } else {
            // on est avant le reset de cette semaine
            if(vm.lastWeekWednesdayAt3Am.isBefore(moment(timestamp))) {
              // on est après le reset de la semaine dernière, gg
              return true;
            }
          }
          return false;
        }
    }
})();
