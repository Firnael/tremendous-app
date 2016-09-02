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

        function getUrlPrefix(){
            var prefix = '';
            $location.host().includes('localhost') ? prefix = 'http' : prefix = 'https';
            return prefix + '://' + $location.host() + ":" + $location.port();
        }

        /**
         * Accepte 'avatar', 'inset' ou 'profile-main', du plus petit au plus grand
         */
        function getThumbnailPath(type, thumbPath) {
            if(type !== 'avatar' && type !== 'inset' && type !== 'profile-main') {
                console.log('getThumbnailPath : bad param');
                return;
            }
            var path = 'http://render-api-eu.worldofwarcraft.com/static-render/eu/';
            var result = thumbPath.replace('avatar', type);
            return path + result;
        }

        function getCssClassByCharacterClass(charClass) {
          switch(charClass) {
            case 1: return 'warrior'; break;
            case 2: return 'paladin'; break;
            case 3: return 'hunter'; break;
            case 4: return 'rogue'; break;
            case 5: return 'priest'; break;
            case 6: return 'death-knight'; break;
            case 7: return 'shaman'; break;
            case 8: return 'mage'; break;
            case 9: return 'warlock'; break;
            case 10: return 'monk'; break;
            case 11: return 'druid'; break;
            case 12: return 'demon-hunter'; break;
            default: break;
          }
        }

        function getCssClassByIlvl(value, background) {
          var result = '';
          if(value >= 840) {
            result = 'legendary';
          } else if(value >= 830) {
            result = 'epic';
          } else if(value >= 820) {
            result = 'rare';
          } else if(value >= 810) {
            result = 'uncommon';
          } else if(value >= 800) {
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
