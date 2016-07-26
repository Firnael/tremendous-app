(function() {
    'use strict';

    angular
        .module('app')
        .controller('rosterCtrl', RosterCtrl);

    RosterCtrl.$inject = ['CharacterSvc'];

    function RosterCtrl(CharacterSvc){
        var vm = this;
        vm.mains = undefined;

        vm.getMains = getMains;
        activate();

        //////////////

        function activate() {
            console.log('RosterCtrl activate');
            vm.mains = getMains();
        }

        function getMains() {
            CharacterSvc.getMains().then(function(data){
                vm.mains = data;
            });
        }
    }
})();
