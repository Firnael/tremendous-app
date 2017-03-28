/* Directive trmdsLootValue.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsLootValue', trmdsLootValueDirective);

    function trmdsLootValueDirective() {

      function link (scope, element, attributes) {
        switch(scope.value) {
          case 0: scope.label = 'No'; scope.labelClass = 'label-no'; break;
          case 1: scope.label = '+2'; scope.labelClass = 'label-plustwo'; break;
          case 2: scope.label = 'Proc'; scope.labelClass = 'label-proc'; break;
          case 3: scope.label = 'Up'; scope.labelClass = 'label-up'; break;
          case 4: scope.label = 'BiS'; scope.labelClass = 'label-bis'; break;
          default: break;
        }
      }

      return {
        restrict: "E",
        template: '<span class="label label-custom" ng-class="labelClass">{{ label }}</span>',
        link: link,
        scope: {
          value: '='
        }
      };
    }
})();
