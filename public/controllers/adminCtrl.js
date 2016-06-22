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

        vm.updateGuild = updateGuild;
        vm.updateCharacterCollection = updateCharacterCollection;
        activate();

        //////////////

        function activate() {
            console.log('AdminCtrl activate');
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
    }
})();
