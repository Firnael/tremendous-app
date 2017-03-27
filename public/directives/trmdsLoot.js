/* Directive trmdsLoot.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsLoot', trmdsLootDirective);

    function trmdsLootDirective() {

      function link (scope, element, attributes) {
        var bossNameUri = '';
        switch(scope.bossId) {
          case 102263: bossNameUri = 'skorpyron'; break;
          case 104415: bossNameUri = 'chronomatic-anomaly'; break;
          case 104288: bossNameUri = 'trilliax'; break;
          case 101002: bossNameUri = 'krosus'; break;
          case 107699: bossNameUri = 'spellblade-aluriel'; break;
          case 104528: bossNameUri = 'botanist'; break;
          case 103685: bossNameUri = 'tichondrius'; break;
          case 103758: bossNameUri = 'star-augur-etraeus'; break;
          case 110965: bossNameUri = 'grand-magistrix-elisande'; break;
          case 105503: bossNameUri = 'guldan'; break;
          default: break;
        }
        scope.thumbnail = 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-' + bossNameUri + '.png';
      }

      return {
        restrict: "E",
        templateUrl: 'views/directives/loot.html',
        link: link,
        scope: {
          bossId: '=',
          value: '=',
          changeValue: '='
        }
      };
    }
})();
