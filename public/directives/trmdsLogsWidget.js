/* Directive trmdsLogsWidget.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsLogsWidget', trmdsLogsWidgetDirective);

    function trmdsLogsWidgetDirective() {

      return {
        restrict: "E",
        templateUrl: 'views/directives/logs-widget.html',
        scope: {
          log: '='
        }
      };
    }
})();
