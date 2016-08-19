/* Directive trmdsSlotIcons.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsSlotIcons', trmdsSlotIconsDirective);

    function trmdsSlotIconsDirective() {

      function link (scope, element, attributes) {
        switch(scope.slot) {
          case 'head': scope.src = 'http://vignette2.wikia.nocookie.net/wowwiki/images/c/c3/Ui-paperdoll-slot-head.png'; break;
          case 'neck': scope.src = 'http://vignette1.wikia.nocookie.net/wowwiki/images/d/d4/Ui-paperdoll-slot-neck.png'; break;
          case 'shoulder':
          scope.src = 'http://vignette1.wikia.nocookie.net/wowwiki/images/f/fa/Ui-paperdoll-slot-shoulder.png'; break;
          case 'back': scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/f/f4/Ui-paperdoll-slot-back.png'; break;
          case 'chest': scope.src = 'http://vignette4.wikia.nocookie.net/wowwiki/images/b/b7/Ui-paperdoll-slot-chest.png'; break;
          case 'wrist': scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/1/1d/Ui-paperdoll-slot-wrists.png'; break;
          case 'hands': scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/2/22/Ui-paperdoll-slot-hands.png'; break;
          case 'waist': scope.src = 'http://vignette1.wikia.nocookie.net/wowwiki/images/c/cd/Ui-paperdoll-slot-waist.png'; break;
          case 'legs': scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/1/14/Ui-paperdoll-slot-legs.png'; break;
          case 'feet': scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/a/a5/Ui-paperdoll-slot-feet.png'; break;
          case 'finger1': scope.src = 'http://vignette1.wikia.nocookie.net/wowwiki/images/c/c2/Ui-paperdoll-slot-finger.png'; break;
          case 'finger2': scope.src = 'http://vignette1.wikia.nocookie.net/wowwiki/images/c/c2/Ui-paperdoll-slot-finger.png'; break;
          case 'trinket1':
          scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/2/26/Ui-paperdoll-slot-trinket.png'; break;
          case 'trinket2':
          scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/2/26/Ui-paperdoll-slot-trinket.png'; break;
          case 'mainHand': scope.src = 'http://vignette3.wikia.nocookie.net/wowwiki/images/f/f5/Ui-paperdoll-slot-mainhand.png'; break;
          case 'offHand': scope.src = 'http://vignette2.wikia.nocookie.net/wowwiki/images/3/30/Ui-paperdoll-slot-secondaryhand.png'; break;
          default: break;
        }
      };

      return {
          restrict: "E",
          template: '<img class="img" ng-src="{{ src }}" title="{{ slot }}" width="{{ size }}" height="{{ size }}"/>',
          link: link,
          scope: {
            slot: '@',
            size: '@'
          }
      };
    }
})();
