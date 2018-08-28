/* Directive trmdsReputations.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsReputations', trmdsReputationsDirective);

    function trmdsReputationsDirective() {

      function link (scope, element, attributes) {
        switch(scope.standing) {
          case '0': scope.reputationClass = "hated"; scope.reputation = 'Hai'; break;
          case '1': scope.reputationClass = "hostile"; scope.reputation = 'Hostile'; break;
          case '2': scope.reputationClass = "unfriendly"; scope.reputation = 'Inamical'; break;
          case '3': scope.reputationClass = "neutral"; scope.reputation = 'Neutre'; break;
          case '4': scope.reputationClass = "friendly"; scope.reputation = 'Amical'; break;
          case '5': scope.reputationClass = "honored"; scope.reputation = 'Honore'; break;
          case '6': scope.reputationClass = "revered"; scope.reputation = 'Revere'; break;
          case '7': scope.reputationClass = "exalted"; scope.reputation = 'Exalte'; break;
          default: break;
        }

        scope.text = scope.reputation;
        scope.getWidth = getWidth;
        scope.toggleText = toggleText;

        function getWidth() {
          // If Exalted, fill the bar to the max
          console.log("scope.max : " + scope.max);
          if(scope.max === '0') {
            console.log("YES");
            return 100;
          }
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
