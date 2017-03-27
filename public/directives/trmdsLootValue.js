/* Directive trmdsLootValue.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsLootValue', trmdsLootValueDirective);

    function trmdsLootValueDirective() {

      function link (scope, element, attributes) {
        switch(scope.value) {
          case 0: scope.label = 'No'; scope.labelClass = 'label-danger'; break;
          case 1: scope.label = '+2'; scope.labelClass = 'label-default'; break;
          case 2: scope.label = 'Proc'; scope.labelClass = 'label-warning'; break;
          case 3: scope.label = 'Up'; scope.labelClass = 'label-success'; break;
          case 4: scope.label = 'BiS'; scope.labelClass = 'label-info'; break;
          default: break;
        }
      }

      return {
        restrict: "E",
        template: '<span class="label" ng-class="labelClass">{{ label }}</span>',
        link: link,
        scope: {
          value: '='
        }
      };
    }
})();
