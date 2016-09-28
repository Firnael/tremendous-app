(function() {
    'use strict';

    angular
        .module('app')
        .controller('recipesCtrl', RecipesCtrl);

    // RecipesCtrl.$inject = [];

    function RecipesCtrl(){
      var vm = this;
      activate();

      //////////////

      function activate() {
        console.log('RecipesCtrl activate');
      }
    }
})();
