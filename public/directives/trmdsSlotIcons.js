/* Directive trmdsSlotIcons.js */
(function() {
    'use strict';

    angular
        .module('app')
        .directive('trmdsSlotIcons', trmdsSlotIconsDirective);

    function trmdsSlotIconsDirective() {

      function link (scope, element, attributes) {
        switch(scope.slot) {
          case 'head': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_helmet_03.jpg'; break;
          case 'neck': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_30naxxramas.jpg'; break;
          case 'shoulder': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_shoulder_30.jpg'; break;
          case 'back': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_misc_cape_11.jpg'; break;
          case 'chest': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_chest_chain.jpg'; break;
          case 'wrist': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_bracer_03.jpg'; break;
          case 'hands': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_05.jpg'; break;
          case 'waist': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_belt_24.jpg'; break;
          case 'legs': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_pants_02.jpg'; break;
          case 'feet': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_boots_01.jpg'; break;
          case 'finger1': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_02.jpg'; break;
          case 'finger2': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_22.jpg'; break;
          case 'trinket1': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_13.jpg'; break;
          case 'trinket2': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_jewelry_trinketpvp_02.jpg'; break;
          case 'mainHand': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_sword_23.jpg'; break;
          case 'offHand': scope.src = 'http://wow.zamimg.com/images/wow/icons/large/inv_shield_04.jpg'; break;
          default: break;
        }
      };

      return {
          restrict: "E",
          template: '<img class="img-rounded" ng-src="{{ src }}" title="{{ slot }}" width="{{ size }}" height="{{ size }}"/>',
          link: link,
          scope: {
            slot: '@',
            size: '@'
          }
      };
    }
})();
