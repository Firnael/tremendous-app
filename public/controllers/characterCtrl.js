(function() {
    'use strict';

    angular
        .module('app')
        .controller('characterCtrl', CharacterCtrl);

    CharacterCtrl.$inject = ['$routeParams', 'CharacterSvc'];

    function CharacterCtrl($routeParams, CharacterSvc){
        var vm = this;
        vm.character = {};

        vm.getCharacter = getCharacter;
        vm.getThumbnailPath = getThumbnailPath;
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

        /**
         * Accepte 'avatar', 'inset' ou 'profile-main', du plus petit au plus grand
         */
        function getThumbnailPath(type) {
            console.log('getThumbnailPath, type=' + type);
            if(type !== 'avatar' && type !== 'inset' && type !== 'profile-main') {
                console.log('getThumbnailPath : bad param');
                return;
            }
            var path = 'http://render-api-eu.worldofwarcraft.com/static-render/eu/';
            var result = vm.character.thumbnail.replace('avatar', type);
            return path + result;
        }
    }
})();
