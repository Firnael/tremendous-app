(function () {
    'use strict';

    angular
        .module('app')
        .factory('UtilsSvc', UtilsSvc);

    UtilsSvc.$inject = ['$location'];

    function UtilsSvc($location) {

      var service = {
        getUrlPrefix: getUrlPrefix,
        getThumbnailPath: getThumbnailPath,
        getCssClassByCharacterClass: getCssClassByCharacterClass,
        getCssClassByIlvl: getCssClassByIlvl,
        getCssClassByQuality: getCssClassByQuality
      };
      return service;

      function getUrlPrefix() {
        return 'https://' + $location.host() + ":" + $location.port();
      }

      /**
       * Accepte 'avatar', 'inset' ou 'profile-main', du plus petit au plus grand
       */
      function getThumbnailPath(type, thumbPath) {
        if((type !== 'avatar' && type !== 'inset' && type !== 'profile-main') || thumbPath === undefined) {
          console.log('getThumbnailPath : bad param');
          return;
        }
        var path = 'http://render-api-eu.worldofwarcraft.com/static-render/eu/';
        var result = thumbPath.replace('avatar', type);
        return path + result;
      }

      function getCssClassByCharacterClass(charClass, background) {
        var result = '';
        switch(charClass) {
          case 1: result = 'warrior'; break;
          case 2: result = 'paladin'; break;
          case 3: result = 'hunter'; break;
          case 4: result = 'rogue'; break;
          case 5: result = 'priest'; break;
          case 6: result = 'death-knight'; break;
          case 7: result = 'shaman'; break;
          case 8: result = 'mage'; break;
          case 9: result = 'warlock'; break;
          case 10: result = 'monk'; break;
          case 11: result = 'druid'; break;
          case 12: result = 'demon-hunter'; break;
          default: break;
        }
        return background ? result + '-bg' : result;
      }

      function getCssClassByIlvl(value, background) {
        var result = '';
        if(value >= 905) {
          result = 'legendary';
        } else if(value >= 900) {
          result = 'epic';
        } else if(value >= 890) {
          result = 'rare';
        } else if(value >= 880) {
          result = 'uncommon';
        } else if(value >= 870) {
          result = 'common';
        } else {
          result = 'poor';
        }
        return background ? result + '-bg' : result;
      }

      function getCssClassByQuality(value, background) {
        var result = '';
        switch(value) {
          case 0: result = 'poor'; break;
          case 1: result = 'common'; break;
          case 2: result = 'uncommon'; break;
          case 3: result = 'rare'; break;
          case 4: result = 'epic'; break;
          case 5: result = 'legendary'; break;
          case 6: result = 'artefact'; break;
          case 7: result = 'heirloom'; break;
        }
        return background ? result + '-bg' : result;
      }

    }
})();
