(function() {
    'use strict';

    angular
        .module('app')
        .controller('rosterCtrl', RosterCtrl);

    RosterCtrl.$inject = ['CharacterSvc', 'UtilsSvc'];

    function RosterCtrl(CharacterSvc, UtilsSvc){
        var vm = this;
        vm.mains = [];
        vm.selectedMain = undefined;
        vm.selectedRerolls = undefined;
        vm.displayMain = false;

        vm.getRoster = getRoster;
        vm.getClassColor = getClassColor;
        vm.getIlvlColor = getIlvlColor;
        vm.getQualityColor = getQualityColor;
        vm.selectMain = selectMain;
        vm.getThumbnailPath = getThumbnailPath;
        vm.getAverageIlvl = getAverageIlvl;
        activate();

        //////////////

        function activate() {
            console.log('RosterCtrl activate');
            vm.getRoster();
        }

        function getRoster() {
            CharacterSvc.getRoster().then(function(data){
                vm.mains = data;
            });
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value);
        }

        function getIlvlColor(value) {
          return UtilsSvc.getCssClassByIlvl(value);
        }

        function getQualityColor(value) {
          return UtilsSvc.getCssClassByQuality(value);
        }

        function selectMain(main) {
          vm.displayMain = false;
          vm.selectedMain = main;
          vm.selectedRerolls = [];

          CharacterSvc.getByAccountId(main.accountIdentifier).then(function(data) {
            for(var i=0; i<data.length; i++) {
              var character = data[i];
              if(character.guildRank === 5) {
                vm.selectedRerolls.push(character);
              }
            }
            vm.displayMain = true;
          });
        }

        function getThumbnailPath(character) {
          if(character && character.thumbnail) {
            return UtilsSvc.getThumbnailPath('avatar', character.thumbnail);
          }
          return 'assets/img/placeholder.png';
        }

        function getAverageIlvl() {
          var total = 0;
          for(var i=0; i<vm.mains.length; i++) {
            total += vm.mains[i].averageItemLevel;
          }
          return (total / vm.mains.length).toFixed(1);
        }
    }
})();
