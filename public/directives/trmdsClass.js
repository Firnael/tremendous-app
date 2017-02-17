/* Directive trmdsClass.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsClass', trmdsClassDirective);

    function trmdsClassDirective() {

        function link (scope, element, attributes) {

            scope.$watch('charClass', function(newValue, oldValue) {
                if (newValue){
                    switch(newValue) {
                        case '1': scope.result = 'Guerrier'; break;
                        case '2': scope.result = 'Paladin'; break;
                        case '3': scope.result = 'Chasseur'; break;
                        case '4': scope.result = 'Voleur'; break;
                        case '5': scope.result = 'Prêtre'; break;
                        case '6': scope.result = 'Chevalier de la mort'; break;
                        case '7': scope.result = 'Chaman'; break;
                        case '8': scope.result = 'Mage'; break;
                        case '9': scope.result = 'Démoniste'; break;
                        case '10': scope.result = 'Moine'; break;
                        case '11': scope.result = 'Druide'; break;
                        case '12': scope.result = 'Chasseur de démons'; break;
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
              charClass: '@'
            }
        };
    }
})();
