/* Directive trmdsTitleBar.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsTitleBar', trmdsTitleBarDirective);

    function trmdsTitleBarDirective() {

      function link (scope, element, attributes) {
        scope.$watch('lastUpdate', function(n, o) {
          if(typeof n === 'number') {
            scope.lastUpdate = moment(scope.lastUpdate).calendar();
          }
        }, false);
      };

      return {
        restrict: 'E',
        templateUrl: 'views/directives/titlebar.html',
        link: link,
        scope: {
          page: '@',
          displayButton: '=',
          lastUpdate: '=',
          updating: '=',
          update: '='
        }
      };
    }
})();
