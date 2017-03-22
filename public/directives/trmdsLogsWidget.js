/* Directive trmdsLogsWidget.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsLogsWidget', trmdsLogsWidgetDirective);

    function trmdsLogsWidgetDirective() {

      function link (scope, element, attributes) {
        scope.day = moment(scope.log.start).format('dddd');
        scope.log.start = moment(scope.log.start).format("DD/MM, HH:mm");
        scope.log.end = moment(scope.log.end).format("DD/MM, HH:mm");

        // https://flatuicolors.com/
        switch(scope.day) {
          case 'Monday': scope.dayColor = '#16a085'; break;
          case 'Tuesday': scope.dayColor = '#27ae60'; break;
          case 'Wednesday': scope.dayColor = '#2980b9'; break;
          case 'Thursday': scope.dayColor = '#8e44ad'; break;
          case 'Friday': scope.dayColor = '#f39c12'; break;
          case 'Saturday': scope.dayColor = '#d35400'; break;
          case 'Sunday': scope.dayColor = '#c0392b'; break;
          default: break;
        }
      };

      return {
        restrict: "E",
        link: link,
        templateUrl: 'views/directives/logs-widget.html',
        scope: {
          log: '='
        }
      };
    }
})();
