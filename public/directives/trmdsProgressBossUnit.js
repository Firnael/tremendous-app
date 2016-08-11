/* Directive trmdsProgressBossUnit.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsProgressBossUnit', trmdsProgressBossUnitDirective);

    function trmdsProgressBossUnitDirective() {

      function link (scope, element, attributes) {
        scope.showDetails = false;
        scope.getHighestProgress = getHighestProgress;
        scope.getDifficulty = getDifficulty;
        scope.getHumanTimestamp = getHumanTimestamp;

        function getHighestProgress() {
          var result = 0;
          for(var i=0; i<scope.downs.length; i++) {
            var down = scope.downs[i];
            if(down.timestamp > 0) {
              if(down.difficulty > result) {
                result = down.difficulty;
              }
            }
          }
          return scope.getDifficulty(result);
        };

        function getDifficulty(difficulty) {
          switch(difficulty) {
            case 0: return 'Pas encore down'; break;
            case 1: return 'Normal'; break;
            case 2: return 'Heroique'; break;
            case 3: return 'Mythique'; break;
          }
        };

        function getHumanTimestamp(timestamp) {
          if(timestamp === 0) {
            return '---';
          }
          return moment(timestamp).calendar();
        };

      };

      return {
          restrict: 'E',
          link: link,
          templateUrl: 'views/directives/progress-boss-unit.html',
          scope: {
            name: "=",
            downs: "="
          }
      };
    }
})();
