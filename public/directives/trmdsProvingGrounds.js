/* Directive trmdsProvingGrounds.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsProvingGrounds', trmdsProvingGroundsDirective);

    function trmdsProvingGroundsDirective() {

        function link (scope, element, attributes) {
            scope.$watch('value', function(newValue, oldValue) {
                if (newValue){
                    var tmp;
                    switch(newValue) {
                        case '0': tmp = ''; break;
                        case '1': scope.title = "Bronze"; tmp = 'bronze'; break;
                        case '2': scope.title = "Argent"; tmp = 'silver'; break;
                        case '3': scope.title = "Or"; tmp = 'gold'; break;
                        case '4': scope.title = "Infini (Vague 30)"; tmp = 'platinum'; break;
                        default: tmp = ''; break;
                    }

                    var url = 'https://wow.zamimg.com/images/wow/icons/large/achievement_challengemode_';
                    if(tmp === '') {
                      url = '../assets/img/placeholder.png';
                    } else {
                      url += tmp + '.jpg';
                    }
                    scope.result = url;
                }
            }, false);
        };

        return {
            restrict: "E",
            template: '<img ng-src="{{ result }}" width="{{ size }}" height="{{ size }}" title="{{ title }}" class="img-circle img-thumbnail"/>',
            link: link,
            scope: {
              value: '@',
              size: '@'
            }
        };
    }
})();
