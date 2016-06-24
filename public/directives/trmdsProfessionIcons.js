/* Directive trmdsProfessionIcons.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsProfessionIcons', trmdsProfessionIconsDirective);

    function trmdsProfessionIconsDirective() {

        function link (scope, element, attributes) {
            var url = 'http://wow.zamimg.com/images/wow/icons/large/';
            var icon = '';

            scope.$watch('profession', function(newValue, oldValue) {
                if (newValue){
                    switch(newValue) {
                        // Primaires
                        case 'Alchimie': icon = 'trade_alchemy'; break;
                        case 'Calligraphie': icon = 'inv_inscription_tradeskill01'; break;
                        case 'Couture': icon = 'trade_tailoring'; break;
                        case 'Dépeçage': icon = 'inv_misc_pelt_wolf_01'; break;
                        case 'Enchantement': icon = 'trade_engraving'; break;
                        case 'Forge': icon = 'trade_blacksmithing'; break;
                        case 'Herboristerie': icon = 'trade_herbalism'; break;
                        case 'Ingénierie': icon = 'trade_engineering'; break;
                        case 'Joaillerie': icon = 'inv_misc_gem_01'; break;
                        case 'Mineur': icon = 'trade_mining'; break;
                        case 'Travail du cuir': icon = 'inv_misc_armorkit_17'; break;
                        // Secondaires
                        case 'Archéologie' : icon = 'trade_archaeology'; break;
                        case 'Cuisine' : icon = 'inv_misc_food_15'; break;
                        case 'Pêche': icon = 'trade_fishing'; break;
                        case 'Premiers soins': icon = 'spell_holy_sealofsacrifice'; break;
                        default: icon = 'ability_creature_cursed_04'; break;
                    }
                    scope.result= url + icon + '.jpg';
                }
            }, false);
        };

        return {
            restrict: "E",
            template: '<img ng-src="{{ result }}" title="{{ profession }}" width="64" height="64" class="img-circle img-thumbnail"/>',
            link: link,
            scope: {
              profession: '@'
            }
        };
    }
})();
