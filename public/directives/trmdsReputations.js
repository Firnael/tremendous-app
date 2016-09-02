/* Directive trmdsReputations.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsReputations', trmdsReputationsDirective);

    function trmdsReputationsDirective() {

      function link (scope, element, attributes) {
        switch(scope.standing) {
          case '0': scope.reputation = 'Hai'; break;
          case '1': scope.reputation = 'Hostile'; break;
          case '2': scope.reputation = 'Inamical'; break;
          case '3': scope.reputation = 'Neutre'; break;
          case '4': scope.reputation = 'Amical'; break;
          case '5': scope.reputation = 'Honore'; break;
          case '6': scope.reputation = 'Revere'; break;
          case '7': scope.reputation = 'Exalte'; break;
          default: break;
        }

        scope.text = scope.reputation;
        scope.getWidth = getWidth;
        scope.toggleText = toggleText;

        function getWidth() {
          return (scope.current / scope.max) * 100;
        }

        function toggleText(bool) {
          if(bool) {
            scope.text = scope.current + ' / ' + scope.max;
          } else {
            scope.text = scope.reputation
          }
        }
      };

      return {
          restrict: "E",
          templateUrl: 'views/directives/character-reputation.html',
          link: link,
          scope: {
            standing: '@',
            current: '@',
            max: '@'
          }
      };
    }
})();
