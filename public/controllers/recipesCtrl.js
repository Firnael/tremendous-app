(function() {
    'use strict';

    angular
        .module('app')
        .controller('recipesCtrl', RecipesCtrl);

    RecipesCtrl.$inject = ['CharacterSvc', 'UtilsSvc'];

    function RecipesCtrl(CharacterSvc, UtilsSvc){
      var vm = this;
      vm.charactersWithRecipes;

      vm.getClassColor = getClassColor;
      vm.getCharactersWithRecipes = getCharactersWithRecipes;
      vm.getRecipeRank = getRecipeRank;
      activate();

      //////////////

      function activate() {
        console.log('RecipesCtrl activate');
        vm.getCharactersWithRecipes();
      }

      function getClassColor(value) {
        return UtilsSvc.getCssClassByCharacterClass(value, false);
      }

      function getCharactersWithRecipes() {
        CharacterSvc.getCharactersWithRecipes().then(function(data){
          vm.charactersWithRecipes = data;
        });
      }

      function getRecipeRank(recipe, recipes) {
        switch(recipe) {
          // Flasks
          case 'flask_endu':
            if(recipes.indexOf(188348) >= 0) { return 3; }
            else if(recipes.indexOf(188347) >= 0) { return 2; }
            else if(recipes.indexOf(188346) >= 0) { return 1; }
            break;
          case 'flask_str':
            if(recipes.indexOf(188345) >= 0) { return 3; }
            else if(recipes.indexOf(188344) >= 0) { return 2; }
            else if(recipes.indexOf(188343) >= 0) { return 1; }
            break;
          case 'flask_int':
            if(recipes.indexOf(188339) >= 0) { return 3; }
            else if(recipes.indexOf(188338) >= 0) { return 2; }
            else if(recipes.indexOf(188337) >= 0) { return 1; }
            break;
          case 'flask_agi':
            if(recipes.indexOf(188342) >= 0) { return 3; }
            else if(recipes.indexOf(188341) >= 0) { return 2; }
            else if(recipes.indexOf(188340) >= 0) { return 1; }
            break;

          // Combat potions
          case 'potion_melee':
            if(recipes.indexOf(188330) >= 0) { return 3; }
            else if(recipes.indexOf(188329) >= 0) { return 2; }
            else if(recipes.indexOf(188328) >= 0) { return 1; }
            break;
          case 'potion_distant':
            if(recipes.indexOf(188327) >= 0) { return 3; }
            else if(recipes.indexOf(188326) >= 0) { return 2; }
            else if(recipes.indexOf(188325) >= 0) { return 1; }
            break;
          case 'potion_armor':
            if(recipes.indexOf(188333) >= 0) { return 3; }
            else if(recipes.indexOf(188332) >= 0) { return 2; }
            else if(recipes.indexOf(188331) >= 0) { return 1; }
            break;

          // Regen potions
          case 'potion_hp':
            if(recipes.indexOf(188300) >= 0) { return 3; }
            else if(recipes.indexOf(188299) >= 0) { return 2; }
            else if(recipes.indexOf(188298) >= 0) { return 1; }
            break;
          case 'potion_both':
            if(recipes.indexOf(188306) >= 0) { return 3; }
            else if(recipes.indexOf(188305) >= 0) { return 2; }
            else if(recipes.indexOf(188304) >= 0) { return 1; }
            break;
          case 'potion_mana':
            if(recipes.indexOf(188303) >= 0) { return 3; }
            else if(recipes.indexOf(188302) >= 0) { return 2; }
            else if(recipes.indexOf(188301) >= 0) { return 1; }
            break;
          case 'potion_mana_channel':
            if(recipes.indexOf(188336) >= 0) { return 3; }
            else if(recipes.indexOf(188335) >= 0) { return 2; }
            else if(recipes.indexOf(188334) >= 0) { return 1; }
            break;

          default: return -1; break;
        }

        return 0;
      }
    }
})();
