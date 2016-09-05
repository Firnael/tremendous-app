(function() {
    'use strict';

    angular
        .module('app')
        .controller('mythicCtrl', MythicCtrl);

    MythicCtrl.$inject = ['CharacterSvc'];

    function MythicCtrl(CharacterSvc){
        var vm = this;
        vm.roster = [];
        vm.updating = true;
        vm.lastUpdate = new Date().getTime();

        vm.getRoster = getRoster;
        vm.update = update;
        activate();

        //////////////

        function activate() {
          console.log('MythicCtrl activate');
          vm.getRoster();
        }

        function getRoster() {
          CharacterSvc.getRoster().then(function(data){
            vm.roster = data;
            vm.updating = false
          });
        }

        function update() {
          console.log('Update Mythic+');
        }
    }
})();
