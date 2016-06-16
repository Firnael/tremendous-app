/* Directive trmdsNavBar.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsNavBar', trmdsNavBarDirective);

    function trmdsNavBarDirective() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'views/directives/navbar.html'
        };
    }
})();
