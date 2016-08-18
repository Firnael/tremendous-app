(function() {
    'use strict';

    angular
        .module('app')
        .controller('characterCtrl', CharacterCtrl);

    CharacterCtrl.$inject = ['$routeParams', 'CharacterSvc', 'UtilsSvc'];

    function CharacterCtrl($routeParams, CharacterSvc, UtilsSvc){
        var vm = this;
        vm.updatingCharacter = true;
        vm.character = {};
        vm.rerolls = {};

        // Chart Professions
        vm.labels = ['Accompli', 'Reste'];
        vm.colors = ['#71c326','#555555'];

        vm.getCharacter = getCharacter;
        vm.getRerolls = getRerolls;
        vm.getThumbnailPath = getThumbnailPath;
        vm.getProfessionData = getProfessionData;
        vm.getSelectedSpec = getSelectedSpec;
        vm.updateCharacter = updateCharacter;
        vm.getClassColor = getClassColor;
        activate();

        //////////////

        function activate() {
            console.log('CharacterCtrl activate');
            getCharacter();
        }

        function getCharacter() {
          CharacterSvc.getCharacter($routeParams.characterName).then(function (result) {
            vm.character = result;
            if(typeof vm.character.class == 'undefined') {
                return updateCharacter();
            }

            vm.professionData = [];
            for(var i=0; i<6; i++) {
              vm.professionData[i] = vm.getProfessionData(i);
            }

            vm.lastModified = moment(vm.character.lastModified).calendar();
            vm.updatingCharacter = false;

            // Get rerolls
            vm.getRerolls(vm.character.accountIdentifier);
          });
        }

        function getRerolls(accountId) {
          CharacterSvc.getByAccountId(accountId).then(function (result) {
            vm.rerolls = result;
          });
        }

        function getThumbnailPath() {
          if(vm.character.thumbnail) {
            return UtilsSvc.getThumbnailPath('inset', vm.character.thumbnail);
          }
        }

        /**
         * Récupère les données nécessaires à l'affichage des donuts des métiers
         */
        function getProfessionData(index) {
          if(!vm.character.professions[index]) {
            return [];
          }

          var data = [];
          var rank = vm.character.professions[index].rank;
          var max = vm.character.professions[index].max;
          data.push(rank);
          var diff = max - rank;
          diff > 0 ? data.push(diff) : data.push(0);
          return data;
        }

        /**
         * Détermine la spec à afficher
         */
        function getSelectedSpec() {
            if(vm.character.specs) {
                if(vm.character.specs[0].selected) {
                    return vm.character.specs[0].name;
                } else {
                    return vm.character.specs[1].name;
                }
            }
        }

        /**
         * Lance le job de mise à jour du personnage
         */
        function updateCharacter() {
            vm.updatingCharacter = true;
            CharacterSvc.updateCharacter($routeParams.characterName).then(function (result) {
                getCharacter();
            });
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value);
        }
    }
})();
