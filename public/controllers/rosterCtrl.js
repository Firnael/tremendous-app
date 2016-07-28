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

        vm.getRoster = getRoster;
        vm.getByRole = getByRole;
        vm.getClassColor = getClassColor;
        vm.selectMain = selectMain;
        vm.getThumbnailPath = getThumbnailPath;
        activate();

        //////////////

        function activate() {
            console.log('RosterCtrl activate');
            getRoster();
        }

        function getRoster() {
            CharacterSvc.getRoster().then(function(data){
                vm.mains = data;
            });
        }

        function getByRole(role) {
          var charWithRole = [];
          for(var i=0; i<vm.mains.length; i++) {
            var char = vm.mains[i];
            if(char.role === role) {
              charWithRole.push(char);
            }
          }
          return charWithRole;
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value);
        }

        function selectMain(main) {
          vm.selectedMain = main;
          vm.selectedRerolls = [];
          CharacterSvc.getByAccountId(main.accountIdentifier).then(function(data) {
            for(var i=0; i<data.length; i++) {
              var character = data[i];
              if(character.guildRank === 5) {
                vm.selectedRerolls.push(character);
              }
            }
          });
        }

        function getThumbnailPath(character) {
          if(character && character.thumbnail) {
            return UtilsSvc.getThumbnailPath('avatar', character.thumbnail);
          }
          return 'assets/img/placeholder.png';
        }
    }
})();
