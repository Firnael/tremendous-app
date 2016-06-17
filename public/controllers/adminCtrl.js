(function() {
    'use strict';

    angular
        .module('app')
        .controller('adminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['BnetApiSvc', 'GuildSvc'];

    function AdminCtrl(BnetApiSvc, GuildSvc){
        var vm = this;
        vm.title = 'Admin Page';

        vm.updateGuild = updateGuild;
        activate();

        //////////////

        function activate() {
            console.log('AdminCtrl activate');
        }

        function updateGuild() {
          BnetApiSvc.getGuildInfo().then(function(data){
              GuildSvc.update(data).then(function () {
                console.log('Guild updated');
              });
          });
        }
    }
})();
