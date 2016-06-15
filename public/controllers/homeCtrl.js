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
        vm.thumbnailPath = 'http://render-api-eu.worldofwarcraft.com/static-render/eu/';
        // inset - profilemain - avatar

        vm.getCharacterInfo = getCharacterInfo;
        vm.getGuildMembers = getGuildMembers;

        vm.getClassLabel = getClassLabel;
        activate();

        //////////////

        function activate() {
            console.log('HomeCtrl activate');
            // BnetApiSvc.getTest(vm.character).then(function(data){
            //     console.log(data);
            // });
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

        function getClassLabel(i) {
          switch(i) {
            case 1: return 'Guerrier';
            case 2: return 'Paladin';
            case 3: return 'Chasseur';
            case 4: return 'Voleur';
            case 5: return 'Prêtre';
            case 6: return 'Chevalier de la mort';
            case 7: return 'Chaman';
            case 8: return 'Mage';
            case 9: return 'Démoniste';
            case 10: return 'Moine';
            case 11: return 'Druide';
            case 12: return 'Chasseur de démon';
          }
        }
    }
})();
