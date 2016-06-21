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
        vm.updateCharacters = updateCharacters;
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

        function updateCharacters() {
          vm.updatingCharacters = true;

          CharacterSvc.update().then(function (result) {
              vm.charactersUpdateMessage = result.message;
              vm.addedCharacters = result.addedCharacters;
              vm.removedCharacters = result.removedCharacters;
              vm.updatingCharacters = false;
          });
        }
    }
})();
