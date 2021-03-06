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
        vm.defaultOrderBy = ['+class', '+role', '-averageItemLevel'];
        vm.orderBy = vm.defaultOrderBy;
        vm.orderAttribute = 'class';
        vm.orderSort = '-';

        // Class distribution
        vm.classDistribution = {};
        vm.classDistribution.data = [0,0,0,0,0,0,0,0,0,0,0,0];
        vm.classDistribution.tankData = [0,0,0,0,0,0,0,0,0,0,0,0];
        vm.classDistribution.healerData = [0,0,0,0,0,0,0,0,0,0,0,0];
        vm.classDistribution.labels = [
          'War', 'Pal', 'Hunt', 'Rogue', 'Priest', 'DK',
          'Cham', 'Mage', 'Demo', 'Monk', 'Drood', 'DH'
        ];
        vm.classDistribution.colors = [
          '#C79C6E', '#F58CBA', '#ABD473', '#FFF569', '#FFFFFF', '#C41F3B',
          '#0070DE', '#69CCF0', '#9482C9', '#00FF96', '#FF7D0A', '#A330C9'
        ];

        vm.getRoster = getRoster;
        vm.getRosterInfos = getRosterInfos;
        vm.getClassColor = getClassColor;
        vm.getIlvlColor = getIlvlColor;
        vm.getItemQualityColor = getItemQualityColor;
        vm.getKrakenEyeAuditColor = getKrakenEyeAuditColor;
        vm.getGemAuditColor = getGemAuditColor;
        vm.getEnchantAuditColor = getEnchantAuditColor;
        vm.updateRoster = updateRoster;
        vm.getUpdateProgress = getUpdateProgress;
        vm.updateRosterData = updateRosterData;
        vm.getHeartOfAzerothLevelColor = getHeartOfAzerothLevelColor;
        vm.changeOrderBy = changeOrderBy;
        vm.resetOrderBy = resetOrderBy;
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
            vm.updateRosterData();
            vm.updating = false;
          });
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value, true);
        }

        function getIlvlColor(value) {
          return UtilsSvc.getCssClassByIlvl(value, true);
        }

        function getItemQualityColor(value) {
          if(!value) {
            return 'roster-audit-neutral';
          }
          return UtilsSvc.getCssClassByQuality(value, true);
        }

        function getKrakenEyeAuditColor(raider) {
          if(raider.audit) {
            if(raider.audit.gemSlots === 0) {
              return 'roster-audit-neutral';
            } else if(raider.audit.equipedKrakenEye > 0) {
              return 'roster-audit-good';
            }
            return 'roster-audit-bad';
          }
        }

        function getGemAuditColor(raider) {
          if(raider.audit) {
            if(raider.audit.gemSlots === 0) {
              return 'roster-audit-neutral';
            } else if(raider.audit.equipedGems === raider.audit.gemSlots) {
              if(raider.audit.equipedWrongGems > 0) {
                return 'roster-audit-warning';
              }
              return 'roster-audit-good';
            }
            return 'roster-audit-bad';
          }
        }

        function getEnchantAuditColor(raider) {
          if(raider.audit) {
            if(raider.audit.missingEnchants > 0) {
              return 'roster-audit-bad';
            } else if(raider.audit.wrongEnchant > 0) {
              return 'roster-audit-warning';
            }
            return 'roster-audit-good';
          }
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

        function updateRosterData() {
          // Class distribution
          for(var i=0; i<vm.rosterInfos.classes.length; i++) {
            var entry = vm.rosterInfos.classes[i];
            vm.classDistribution.data[i] = entry.count;
          }
          // Tanks distribution
          for(var i=0; i<vm.rosterInfos.tanks.length; i++) {
            var entry = vm.rosterInfos.tanks[i];
            vm.classDistribution.tankData[i] = entry.count;
          }
          // Healers distribution
          for(var i=0; i<vm.rosterInfos.healers.length; i++) {
            var entry = vm.rosterInfos.healers[i];
            vm.classDistribution.healerData[i] = entry.count;
          }
        }

        function getHeartOfAzerothLevelColor(count) {
          if(count > 20) { return 'roster-audit-awesome'; }
          else if(count >= 18) { return 'roster-audit-good'; }
          else if(count >= 16) { return 'roster-audit-warning'; }
          else return 'roster-audit-bad';
        }

        function changeOrderBy(orderBy) {
          if(orderBy === vm.orderAttribute) {
            if(vm.orderSort === '-') {
              vm.orderSort = '+';
            } else {
              vm.orderSort = '-';
            }
          } else {
            vm.orderSort = '-';
            vm.orderAttribute = orderBy;
          }

          var newOrderBy = vm.orderSort + vm.orderAttribute;
          vm.orderBy = [newOrderBy];
        }

        function resetOrderBy() {
          vm.orderBy = vm.defaultOrderBy;
        }

    }
})();
