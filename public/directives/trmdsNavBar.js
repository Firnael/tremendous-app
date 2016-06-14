/* Directive trmdsNavBar.js */
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
