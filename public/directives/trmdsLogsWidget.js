/* Directive trmdsLogsWidget.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsLogsWidget', trmdsLogsWidgetDirective);

    function trmdsLogsWidgetDirective() {

      function link (scope, element, attributes) {
        scope.getZoneById = getZoneById;
        scope.getMomentByTimestamp = getMomentByTimestamp;

        function getZoneById(zoneId) {
          switch(zoneId) {
            case 10: return 'Emerald Nightmare';
            default: return 'Unknown';
          }
        }

        function getMomentByTimestamp(timestamp) {
          return moment(timestamp).format("DD MMM, hh:mm A");
        }

      };

      return {
        restrict: "E",
        templateUrl: 'views/directives/logs-widget.html',
        link: link,
        scope: {
          log: '='
        }
      };
    }
})();
