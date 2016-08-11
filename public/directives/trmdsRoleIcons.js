/* Directive trmdsRoleIcons.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsRoleIcons', trmdsRoleIconsDirective);

    function trmdsRoleIconsDirective() {

      function link (scope, element, attributes) {
        var value = 'placeholder';
        switch(scope.role) {
          case '0': value = 'tank'; break;
          case '1': value = 'heal'; break;
          case '2': value = 'dps'; break;
          default: break;
        }
        scope.src = 'assets/img/' + value + '.png';
        scope.title = value;
      };

      return {
          restrict: "E",
          template: '<img ng-src="{{ src }}" title="{{ title }}" width="{{ size }}" height="{{ size }}"/>',
          link: link,
          scope: {
            role: '@',
            size: '@'
          }
      };
    }
})();
