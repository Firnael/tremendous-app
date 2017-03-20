(function() {
    'use strict';

    angular
        .module('app')
        .controller('userCtrl', UserCtrl);

    UserCtrl.$inject = ['$rootScope', 'UserSvc', 'CharacterSvc', 'UtilsSvc'];

    function UserCtrl($rootScope, UserSvc, CharacterSvc, UtilsSvc) {
      var vm = this;
      vm.characters;
      vm.selectedCharacterIndex = 0;

      vm.getUserCharacters = getUserCharacters;
      vm.selectCharacter = selectCharacter;
      vm.getSelectedCharacterLoot = getSelectedCharacterLoot;
      vm.changeValue = changeValue;
      vm.getThumbnailUrl = getThumbnailUrl;
      vm.getClassColor = getClassColor;
      activate();

      //////////////

      function activate() {
        console.log('UserCtrl activate');
        vm.getUserCharacters();
      }

      function getUserCharacters() {
        var battletag = $rootScope.user.battletag;
        CharacterSvc.getByBattletag(battletag).then(function (characters) {
          vm.characters = characters;
        })
      }

      function selectCharacter(index) {
        vm.selectedCharacterIndex = index;
      }

      function getSelectedCharacterLoot() {
        if(vm.characters) {
          return vm.characters[vm.selectedCharacterIndex].loot;
        }
      }

      function changeValue(value, bossId) {
        var characterName = vm.characters[vm.selectedCharacterIndex].name;
        CharacterSvc.updateLoot(characterName, bossId, value).then(function (updatedCharacter) {
          vm.characters[vm.selectedCharacterIndex] = updatedCharacter;
        });
      }

      function getThumbnailUrl(uri) {
        return UtilsSvc.getThumbnailPath('avatar', uri);
      }

      function getClassColor(characterClass) {
        return UtilsSvc.getCssClassByCharacterClass(characterClass);
      }
    }
})();
