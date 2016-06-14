(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', 'BnetApiSvc'];

    function HomeCtrl($scope, BnetApiSvc){
        var vm = this;
        vm.nice = "Nice";
        vm.character = '';

        vm.getCharacterInfo = getCharacterInfo;
        vm.getGuildMembers = getGuildMembers;
        activate();

        //////////////

        function activate() {
            console.log('HomeCtrl activate');
            // BnetApiSvc.getTest(vm.character).then(function(data){
            //     console.log(data);
            // });
            vm.getGuildMembers();
        }

        function getCharacterInfo() {
            if(vm.character === undefined) {
                return;
            }

            BnetApiSvc.getCharacterInfo(vm.character).then(function(data){
                vm.characterInfo = data;
            });
        }

        function getGuildMembers() {
            BnetApiSvc.getGuildMembers().then(function(data){
                vm.guildMembers = data;
            });
        }
    }
})();
