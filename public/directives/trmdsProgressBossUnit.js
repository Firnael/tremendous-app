/* Directive trmdsProgressBossUnit.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsProgressBossUnit', trmdsProgressBossUnitDirective);

    function trmdsProgressBossUnitDirective() {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/progress-boss-unit.html',
            scope: {
              name: "@",
              difficulty: "@",
              size: "@"
            }
        };
    }
})();
