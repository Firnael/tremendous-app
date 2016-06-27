/* Directive trmdsGuildRank.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsGuildRank', trmdsGuildRankDirective);

    function trmdsGuildRankDirective() {

        function link (scope, element, attributes) {
            scope.$watch('rank', function(newValue, oldValue) {
                if (newValue){
                    switch(newValue) {
                        case '0': scope.result = 'GM'; break;
                        case '1': scope.result = 'CO-GM'; break;
                        case '2': scope.result = 'Raid Leader'; break;
                        case '3': scope.result = 'Machine (Raider)'; break;
                        case '4': scope.result = 'Noob (Recrue)'; break;
                        case '5': scope.result = 'Reroll'; break;
                        default: scope.result = '???'; break;
                    }
                }
            }, false);
        };

        return {
            restrict: "E",
            template: "{{ result }}",
            link: link,
            scope: {
              rank: '@'
            }
        };
    }
})();