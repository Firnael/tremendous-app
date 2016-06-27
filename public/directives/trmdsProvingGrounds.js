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
                        case '1': tmp = 'bronze'; break;
                        case '2': tmp = 'silver'; break;
                        case '3': tmp = 'gold'; break;
                        default: tmp = ''; break;
                    }

                    var url = 'https://wow.zamimg.com/images/wow/icons/large/achievement_challengemode_';
                    if(tmp === '') {
                      url = 'https://hydra-media.cursecdn.com/wow.gamepedia.com/9/97/Inv_misc_questionmark.png';
                    } else {
                      url += tmp + '.jpg';
                    }
                    scope.result = url;
                }
            }, false);
        };

        return {
            restrict: "E",
            template: '<img ng-src="{{ result }}" width="60" height="60" class="img-circle img-thumbnail"/>',
            link: link,
            scope: {
              value: '@'
            }
        };
    }
})();
