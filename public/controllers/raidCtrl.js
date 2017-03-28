(function() {
    'use strict';

    angular
        .module('app')
        .controller('raidCtrl', RaidCtrl);

    RaidCtrl.$inject = ['CharacterSvc', 'LogsSvc', 'UtilsSvc'];

    function RaidCtrl(CharacterSvc, LogsSvc, UtilsSvc) {
      var vm = this;
      vm.selectedBossId = 102263; // Skorpyron
      vm.roster = [];
      vm.logs = [];
      vm.logsLoading = true;
      vm.bosses = [];

      vm.initBossesArray = initBossesArray;
      vm.getRoster = getRoster;
      vm.getLogs = getLogs;
      vm.getRaidersByLootValue = getRaidersByLootValue;
      vm.getClassColor = getClassColor;
      activate();

      //////////////

      function activate() {
        console.log('RaidCtrl activate');
        vm.initBossesArray();
        vm.getRoster();
        vm.getLogs();
      }

      function initBossesArray() {
        vm.bosses = [
          { id: 102263, thumbnail: 'skorpyron', title: 'Skorpyron' },
          { id: 104415, thumbnail: 'chronomatic-anomaly', title: 'Anomalie chronomatique' },
          { id: 104288, thumbnail: 'trilliax', title: 'Trilliax' },
          { id: 101002, thumbnail: 'krosus', title: 'Krosus' },
          { id: 107699, thumbnail: 'spellblade-aluriel', title: 'Sorcelame Aluriel' },
          { id: 104528, thumbnail: 'botanist', title: 'Grand botaniste Tel\'arn' },
          { id: 103685, thumbnail: 'tichondrius', title: 'Tichondrius' },
          { id: 103758, thumbnail: 'star-augur-etraeus', title: 'Etraeus, l\'augure stellaire' },
          { id: 110965, thumbnail: 'grand-magistrix-elisande', title: 'Grand magistrice Elisande' },
          { id: 105503, thumbnail: 'guldan', title: 'Gul\'dan' }
        ];
      }

      function getRoster() {
        CharacterSvc.getRoster().then(function (roster) {
          vm.roster = roster;
        });
      }

      function getLogs() {
        LogsSvc.get().then(function (result) {
          for(var i=0; i<result.length; i++) {
            var log = result[i];
            log.order = log.start;
            vm.logs.push(log);
          }
          vm.logsLoading = false;
        });
      }

      function getRaidersByLootValue(value) {
        var raiders = [];
        for(var i=0; i<vm.roster.length; i++) {
          var raider = vm.roster[i];
          for(var j=0; j<raider.loot.length; j++) {
            var loot = raider.loot[j];
            if(loot.bossId === vm.selectedBossId) {
              if(loot.value === value) {
                raiders.push(raider);
              }
            }
          }
        }
        return raiders;
      }

      function getClassColor(value) {
        return UtilsSvc.getCssClassByCharacterClass(value, false);
      }

    }
})();
