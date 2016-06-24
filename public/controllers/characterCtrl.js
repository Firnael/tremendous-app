(function() {
    'use strict';

    angular
        .module('app')
        .controller('characterCtrl', CharacterCtrl);

    CharacterCtrl.$inject = ['$routeParams', 'CharacterSvc'];

    function CharacterCtrl($routeParams, CharacterSvc){
        var vm = this;
        vm.character = {};

        // Chart test
        vm.labels = ['', ''];
        vm.colours = ['#71c326','#555555'];

        vm.getCharacter = getCharacter;
        vm.getThumbnailPath = getThumbnailPath;
        vm.getProfessionData = getProfessionData;
        activate();

        //////////////

        function activate() {
            console.log('CharacterCtrl activate');
            getCharacter();
        }

        function getCharacter() {
            CharacterSvc.getCharacter($routeParams.characterName).then(function (result) {
                vm.character = result;
                vm.professionData1 = vm.getProfessionData(0);
                vm.professionData2 = vm.getProfessionData(1);
            });
        }

        /**
         * Accepte 'avatar', 'inset' ou 'profile-main', du plus petit au plus grand
         */
        function getThumbnailPath(type) {
            if(type !== 'avatar' && type !== 'inset' && type !== 'profile-main') {
                console.log('getThumbnailPath : bad param');
                return;
            }
            if(vm.character.thumbnail) {
                var path = 'http://render-api-eu.worldofwarcraft.com/static-render/eu/';
                var result = vm.character.thumbnail.replace('avatar', type);
                return path + result;
            }
        }

        function getProfessionData(index) {
            var data = [];
            var rank = vm.character.professions[index].rank;
            var max = vm.character.professions[index].max;
            data.push(rank);
            var diff = max - rank;
            diff > 0 ? data.push(diff) : data.push(0);
            return data;
        }
    }
})();
