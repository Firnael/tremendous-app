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
        vm.professionData = [];
        vm.labels = ['Accompli', 'Reste'];
        vm.colors = ['#65ae22','#555555'];

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
          vm.getCharacter();
        }

        function getCharacter() {
          CharacterSvc.getCharacter($routeParams.characterName).then(function (result) {
            vm.character = result;
            vm.lastModified = moment(vm.character.lastModified).calendar();

            // If data incomplete, don't go further
            if(typeof vm.character.class == 'undefined') {
              vm.updatingCharacter = false;
              return;
            }

            // Get profession data for charts
            for(var i=0; i<6; i++) {
              vm.professionData[i] = vm.getProfessionData(i);
            }

            // Get rerolls
            vm.getRerolls(vm.character.accountIdentifier);

            vm.updatingCharacter = false;
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
          if(!vm.character.specs) {
            console.log('vm.character.spec is undefined');
            return;
          }

          var spec1 = vm.character.specs[0];
          var spec2 = vm.character.specs[1];
          if(spec1 && spec1.selected) {
            return spec1.name;
          } else if(spec2 && spec2.selected) {
            return spec2.name;
          } else {
            console.log('vm.character.spec is empty');
          }
        }

        /**
         * Lance le job de mise à jour du personnage
         */
        function updateCharacter() {
          vm.updatingCharacter = true;
          CharacterSvc.updateCharacter($routeParams.characterName).then(function (result) {
            vm.getCharacter();
          });
        }

        function getClassColor(value) {
          return UtilsSvc.getCssClassByCharacterClass(value);
        }
    }
})();
