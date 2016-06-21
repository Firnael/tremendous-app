(function() {
    'use strict';

    angular
        .module('app')
        .controller('characterCtrl', CharacterCtrl);

    CharacterCtrl.$inject = ['$routeParams'];

    function CharacterCtrl($routeParams){
        var vm = this;
        vm.title = 'Character Page : ' + $routeParams.characterName;

        activate();

        //////////////

        function activate() {
            console.log('CharacterCtrl activate');
        }
    }
})();
