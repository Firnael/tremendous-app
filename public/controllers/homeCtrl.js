(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['CharacterSvc'];

    function HomeCtrl(CharacterSvc){
        var vm = this;
        vm.characters = undefined;

        vm.getCharacters = getCharacters;
        activate();

        //////////////

        function activate() {
            console.log('HomeCtrl activate');
            vm.characters = getCharacters();
        }

        function getCharacters() {
            CharacterSvc.getCharacters().then(function(data){
                vm.characters = data;
            });
        }
    }
})();
