(function() {
    'use strict';

    angular
        .module('app')
        .controller('recipesCtrl', RecipesCtrl);

    RecipesCtrl.$inject = ['CharacterSvc', 'UtilsSvc'];

    function RecipesCtrl(CharacterSvc, UtilsSvc){
      var vm = this;
      vm.currentTab = 0;
      vm.charactersWithAlchemyRecipes;
      vm.charactersWithGemRecipes;
      vm.charactersWithEnchantRecipes;
      vm.charactersWithCookingRecipes;

      vm.setCurrentTab = setCurrentTab;
      vm.getClassColor = getClassColor;
      vm.getCharactersWithRecipes = getCharactersWithRecipes;
      vm.getAlchemyRecipeRank = getAlchemyRecipeRank;
      vm.getGemRecipeRank = getGemRecipeRank;
      vm.getEnchantRecipeRank = getEnchantRecipeRank;
      vm.getCookingRecipeRank = getCookingRecipeRank;
      activate();

      //////////////

      function activate() {
        console.log('RecipesCtrl activate');
        vm.getCharactersWithRecipes();
      }

      function setCurrentTab(tab) {
        vm.currentTab = tab;
      }

      function getClassColor(value) {
        return UtilsSvc.getCssClassByCharacterClass(value, false);
      }

      function getCharactersWithRecipes() {
        CharacterSvc.getCharactersWithRecipes('alchemy').then(function(data){
          vm.charactersWithAlchemyRecipes = data;
        });
        CharacterSvc.getCharactersWithRecipes('jewelcrafting').then(function(data){
          vm.charactersWithGemRecipes = data;
        });
        CharacterSvc.getCharactersWithRecipes('enchants').then(function(data){
          vm.charactersWithEnchantRecipes = data;
        });
        CharacterSvc.getCharactersWithRecipes('cooking').then(function(data){
          vm.charactersWithCookingRecipes = data;
        });
      }

      function getAlchemyRecipeRank(recipe, recipes) {
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

      function getGemRecipeRank(recipe, recipes) {
        switch(recipe) {
          case 'saber_eye':
            if(recipes.indexOf(195877) >= 0) { return 3; }
            break;
          case 'mastery':
            if(recipes.indexOf(195855) >= 0) { return 3; }
            break;
          case 'haste':
            if(recipes.indexOf(195853) >= 0) { return 3; }
            break;
          case 'crit':
            if(recipes.indexOf(195852) >= 0) { return 3; }
            break;
          case 'vers':
            if(recipes.indexOf(195854) >= 0) { return 3; }
            break;
          default: return -1; break;
        }
        return 0;
      }

      function getEnchantRecipeRank(recipe, recipes) {
        switch(recipe) {
          case 'cloak_agi':
            if(recipes.indexOf(191021) >= 0) { return 3; }
            else if(recipes.indexOf(191004) >= 0) { return 2; }
            else if(recipes.indexOf(190878) >= 0) { return 1; }
            break;
          case 'cloak_int':
            if(recipes.indexOf(191022) >= 0) { return 3; }
            else if(recipes.indexOf(191005) >= 0) { return 2; }
            else if(recipes.indexOf(190879) >= 0) { return 1; }
            break;
          case 'cloak_str':
            if(recipes.indexOf(191020) >= 0) { return 3; }
            else if(recipes.indexOf(191003) >= 0) { return 2; }
            else if(recipes.indexOf(190877) >= 0) { return 1; }
            break;
          case 'neck_priestess':
            if(recipes.indexOf(228410) >= 0) { return 3; }
            else if(recipes.indexOf(228409) >= 0) { return 2; }
            else if(recipes.indexOf(228408) >= 0) { return 1; }
            break;
          case 'neck_claw':
            if(recipes.indexOf(191023) >= 0) { return 3; }
            else if(recipes.indexOf(191006) >= 0) { return 2; }
            else if(recipes.indexOf(190892) >= 0) { return 1; }
            break;
          case 'neck_army':
            if(recipes.indexOf(191024) >= 0) { return 3; }
            else if(recipes.indexOf(191007) >= 0) { return 2; }
            else if(recipes.indexOf(190893) >= 0) { return 1; }
            break;
          case 'neck_hide':
            if(recipes.indexOf(228404) >= 0) { return 3; }
            else if(recipes.indexOf(228403) >= 0) { return 2; }
            else if(recipes.indexOf(228402) >= 0) { return 1; }
            break;
          case 'neck_satyr':
            if(recipes.indexOf(191025) >= 0) { return 3; }
            else if(recipes.indexOf(191008) >= 0) { return 2; }
            else if(recipes.indexOf(190894) >= 0) { return 1; }
            break;
          case 'neck_soldier':
            if(recipes.indexOf(228407) >= 0) { return 3; }
            else if(recipes.indexOf(228406) >= 0) { return 2; }
            else if(recipes.indexOf(228405) >= 0) { return 1; }
            break;
          case 'ring_crit':
            if(recipes.indexOf(191013) >= 0) { return 3; }
            else if(recipes.indexOf(190996) >= 0) { return 2; }
            else if(recipes.indexOf(190870) >= 0) { return 1; }
            break;
          case 'ring_haste':
            if(recipes.indexOf(191014) >= 0) { return 3; }
            else if(recipes.indexOf(190997) >= 0) { return 2; }
            else if(recipes.indexOf(190871) >= 0) { return 1; }
            break;
          case 'ring_mastery':
            if(recipes.indexOf(191015) >= 0) { return 3; }
            else if(recipes.indexOf(190998) >= 0) { return 2; }
            else if(recipes.indexOf(190872) >= 0) { return 1; }
            break;
          case 'ring_versa':
            if(recipes.indexOf(191016) >= 0) { return 3; }
            else if(recipes.indexOf(190999) >= 0) { return 2; }
            else if(recipes.indexOf(190873) >= 0) { return 1; }
            break;
          default: return -1; break;
        }
        return 0;
      }

      function getCookingRecipeRank(recipe, recipes) {
        switch(recipe) {
          case 'haste':
            if(recipes.indexOf(201555) >= 0) { return 3; }
            else if(recipes.indexOf(201535) >= 0) { return 2; }
            else if(recipes.indexOf(201506) >= 0) { return 1; }
            break;
          case 'versa':
            if(recipes.indexOf(201557) >= 0) { return 3; }
            else if(recipes.indexOf(201537) >= 0) { return 2; }
            else if(recipes.indexOf(201508) >= 0) { return 1; }
            break;
          case 'mastery':
            if(recipes.indexOf(201556) >= 0) { return 3; }
            else if(recipes.indexOf(201536) >= 0) { return 2; }
            else if(recipes.indexOf(201507) >= 0) { return 1; }
            break;
          case 'crit':
            if(recipes.indexOf(201554) >= 0) { return 3; }
            else if(recipes.indexOf(201534) >= 0) { return 2; }
            else if(recipes.indexOf(201505) >= 0) { return 1; }
            break;
          case 'damages':
            if(recipes.indexOf(201558) >= 0) { return 3; }
            else if(recipes.indexOf(201538) >= 0) { return 2; }
            else if(recipes.indexOf(201511) >= 0) { return 1; }
            break;
          default: return -1; break;
        }
        return 0;
      }
    }
})();
