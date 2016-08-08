/* Directive trmdsSideBar.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsSideBar', trmdsSideBarDirective);

    function trmdsSideBarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/sidebar.html',
            scope: {
              page: '@',
              open: '='
            }
        };
    }
})();
