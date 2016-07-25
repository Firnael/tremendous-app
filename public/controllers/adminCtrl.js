(function() {
    'use strict';

    angular
        .module('app')
        .controller('adminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['BnetApiSvc', 'GuildSvc', 'CharacterSvc'];

    function AdminCtrl(BnetApiSvc, GuildSvc, CharacterSvc){
        var vm = this;
        vm.title = 'Admin Page';

        // Guild
        vm.guildUpdateMessage;
        vm.guildMemberCount;
        vm.guildLastModified;
        vm.mains;
        vm.rerolls;
        vm.selectedMain;
        vm.selectedReroll;
        vm.linkingRerollToMain = false;

        vm.updateGuild = updateGuild;
        vm.updateCharacterCollection = updateCharacterCollection;

        // Gestion des mains/rerolls
        vm.getMains = getMains;
        vm.getRerollsWithoutMains = getRerollsWithoutMains;
        vm.linkRerollToMain = linkRerollToMain;

        activate();

        //////////////

        function activate() {
            console.log('AdminCtrl activate');
            vm.getMains();
            vm.getRerollsWithoutMains();
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

        function getMains() {
          CharacterSvc.getMains().then(function (result) {
              vm.mains = result;
          });
        }

        function getRerollsWithoutMains() {
          CharacterSvc.getRerollsWithoutMains().then(function (result) {
              vm.rerolls = result;
          });
        }

        function linkRerollToMain() {
          vm.linkingRerollToMain = true;
          CharacterSvc.linkRerollToMain(vm.selectedReroll, vm.selectedMain).then(function (result) {
              vm.getRerollsWithoutMains();
              vm.selectedReroll = undefined;
              vm.linkingRerollToMain = false;
          });
        }
    }
})();
