/* Directive trmdsGuildRank.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsGuildRank', trmdsGuildRankDirective);

    function trmdsGuildRankDirective() {

      function link (scope, element, attributes) {
        scope.$watch('rank', function(newValue, oldValue) {
          if (newValue){
            switch(newValue) {
              case '0': scope.result = 'GM'; break;
              case '1': scope.result = 'Officier'; break;
              case '2': scope.result = 'Veteran'; break;
              case '3': scope.result = 'Membre'; break;
              case '4': scope.result = 'Initiate'; break;
              case '5': scope.result = 'Reroll (officier)'; break;
              case '6': scope.result = 'Reroll'; break;
              case '7': scope.result = 'Ami'; break;
              default: scope.result = '???'; break;
            }
          }
        }, false);
      };

      return {
        restrict: "E",
        template: "{{ result }}",
        link: link,
        scope: {
          rank: '@'
        }
      };
    }
})();
