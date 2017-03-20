/* Directive trmdsClassIcons.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsClassIcons', trmdsClassIconsDirective);

    function trmdsClassIconsDirective() {

        function link (scope, element, attributes) {
          scope.$watch('charClass', function(newValue, oldValue) {
            if (newValue){
              scope.url = 'https://wow.zamimg.com/images/wow/icons/large/';
              switch(newValue) {
                case '1': scope.url += 'classicon_warrior.jpg'; break;
                case '2': scope.url += 'classicon_paladin.jpg'; break;
                case '3': scope.url += 'classicon_hunter.jpg'; break;
                case '4': scope.url += 'classicon_rogue.jpg'; break;
                case '5': scope.url += 'classicon_priest.jpg'; break;
                case '6': scope.url += 'classicon_deathknight.jpg'; break;
                case '7': scope.url += 'classicon_shaman.jpg'; break;
                case '8': scope.url += 'classicon_mage.jpg'; break;
                case '9': scope.url += 'classicon_warlock.jpg'; break;
                case '10': scope.url += 'classicon_monk.jpg'; break;
                case '11': scope.url += 'classicon_druid.jpg'; break;
                case '12': scope.url += 'class_demonhunter.jpg'; break;
              }
            }
          }, false);
        };

        return {
            restrict: "E",
            template: '<img ng-src="{{ url }}" width="{{ size }}" height="{{ size }}"/>',
            link: link,
            scope: {
              charClass: '@',
              size: '@'
            }
        };
    }
})();
