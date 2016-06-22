(function() {
    'use strict';

    angular
        .module('app')
        .controller('characterCtrl', CharacterCtrl);

    CharacterCtrl.$inject = ['$routeParams', 'CharacterSvc'];

    function CharacterCtrl($routeParams, CharacterSvc){
        var vm = this;
        vm.title = 'Character Page';
        vm.character = {};
        vm.test = 0;

        vm.getCharacter = getCharacter;
        activate();

        //////////////

        function activate() {
            console.log('CharacterCtrl activate');
            getCharacter();
        }

        function getCharacter() {
            CharacterSvc.getCharacter($routeParams.characterName).then(function (result) {
                console.log(result);
                vm.character = result;
            });
        }
    }
})();
