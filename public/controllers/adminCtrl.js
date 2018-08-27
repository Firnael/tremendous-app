(function() {
    'use strict';

    angular
        .module('app')
        .controller('adminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['BnetApiSvc', 'GuildSvc', 'CharacterSvc'];

    function AdminCtrl(BnetApiSvc, GuildSvc, CharacterSvc){
        var vm = this;

        // Guild
        vm.guildUpdateMessage;
        vm.guildMemberCount;
        vm.guildLastModified;
        vm.roster;
        vm.mains;
        vm.rerolls;
        vm.selectedMain;
        vm.selectedReroll;
        vm.linkingRerollToMain = false;

        vm.updateGuild = updateGuild;
        vm.updateCharacterCollection = updateCharacterCollection;

        // Gestion des mains/rerolls et des roles
        vm.getRoster = getRoster;
        vm.getMains = getMains;
        vm.getRerolls = getRerolls;
        vm.linkRerollToMain = linkRerollToMain;
        vm.checkRerollAccountId = checkRerollAccountId;
        vm.setRole = setRole;

        activate();

        //////////////

        function activate() {
          console.log('AdminCtrl activate');
          vm.getRoster();
          vm.getMains();
          vm.getRerolls();
        }

        function updateGuild() {
          vm.updatingGuild = true;

          GuildSvc.update().then(function(result) {
            vm.guildUpdateMessage = result.message;
            vm.guildMemberCount = result.memberCount;
            vm.guildLastModified = moment(result.lastModified).calendar();
            vm.updatingGuild = false;
          });
        }

        function updateCharacterCollection() {
          vm.updatingCharacterCollection = true;

          CharacterSvc.updateCollection().then(function (result) {
            vm.characterCollectionUpdateMessage = result.message;
            vm.addedCharacters = result.addedCharacters;
            vm.removedCharacters = result.removedCharacters;
            vm.updatingCharacterCollection = false;
          });
        }

        function getRoster() {
          CharacterSvc.getRoster().then(function (result) {
            vm.roster = result;
          });
        }

        function getMains() {
          CharacterSvc.getMains().then(function (result) {
            vm.mains = result;
          });
        }

        function getRerolls() {
          CharacterSvc.getRerolls().then(function (result) {
            vm.rerolls = result;
          });
        }

        function linkRerollToMain() {
          vm.linkingRerollToMain = true;
          CharacterSvc.linkRerollToMain(vm.selectedReroll, vm.selectedMain).then(function (result) {
            vm.getRerolls();
            vm.selectedReroll = undefined;
            vm.linkingRerollToMain = false;
          });
        }

        function checkRerollAccountId(accountId) {
          for(var i=0; i<vm.mains.length; i++) {
            var main = vm.mains[i];
            if(main.accountIdentifier === accountId) {
              return true;
            }
          }
          return false;
        }

        // Update the character role and reload it
        function setRole(characterName, role) {
          CharacterSvc.setRole(characterName, role).then(function (updatedCharacter) {
            for(var i=0; i<vm.roster.length; i++) {
              if(vm.roster[i].name === updatedCharacter.name) {
                vm.roster[i] = updatedCharacter;
                break;
              }
            }
          });
        }
    }
})();
