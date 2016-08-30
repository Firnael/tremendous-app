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

        // Class distribution
        vm.classDistribution = {};
        vm.classDistribution.data = [0,0,0,0,0,0,0,0,0,0,0,0];
        vm.classDistribution.labels = [
          'War', 'Pal', 'Hunt', 'Rogue', 'Priest', 'DK',
          'Cham', 'Mage', 'Demo', 'Monk', 'Drood', 'DH'
        ];
        vm.classDistribution.colors = [
          '#C79C6E', '#F58CBA', '#ABD473', '#FFF569', '#FFFFFF', '#C41F3B',
          '#0070DE', '#69CCF0', '#9482C9', '#00FF96', '#FF7D0A', '#A330C9'
        ];

        // Armor types
        vm.armorTypes = {};
        vm.armorTypes.data = [0, 0, 0, 0];
        vm.armorTypes.labels = ['Plaque', 'Maille', 'Cuir', 'Tissu'];
        vm.armorTypes.colors = ['#FFFFFF', '#AAAAAA', '#777777', '#222222'];

        // Armor tokens
        vm.armorTokens = {};
        vm.armorTokens.data = [0, 0, 0];
        vm.armorTokens.labels = ['Vanquisher', 'Protector', 'Conqueror'];
        vm.armorTokens.colors = ['#FFFFFF', '#AAAAAA', '#777777'];

        vm.getRoster = getRoster;
        vm.getRosterInfos = getRosterInfos;
        vm.getClassColor = getClassColor;
        vm.getIlvlColor = getIlvlColor;
        vm.getItemQualityColor = getItemQualityColor;
        vm.getGemAuditColor = getGemAuditColor;
        vm.updateRoster = updateRoster;
        vm.getUpdateProgress = getUpdateProgress;
        vm.updateRosterData = updateRosterData;
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
          return UtilsSvc.getCssClassByCharacterClass(value);
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

        function getGemAuditColor(raider) {
          if(raider.audit) {
            if(raider.audit.gemSlots === 0) {
              return 'roster-audit-neutral';
            } else if(raider.audit.equipedGems === raider.audit.gemSlots) {
              return 'roster-audit-good';
            }
            return 'roster-audit-bad';
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

          // Armor types
          vm.armorTypes.data[0] = vm.rosterInfos.armorTypes.plate;
          vm.armorTypes.data[1] = vm.rosterInfos.armorTypes.mail;
          vm.armorTypes.data[2] = vm.rosterInfos.armorTypes.leather;
          vm.armorTypes.data[3] = vm.rosterInfos.armorTypes.cloth;

          // Armor tokens
          vm.armorTokens.data[0] = vm.rosterInfos.armorTokens.vanquisher;
          vm.armorTokens.data[1] = vm.rosterInfos.armorTokens.protector;
          vm.armorTokens.data[2] = vm.rosterInfos.armorTokens.conqueror;
        }

    }
})();
