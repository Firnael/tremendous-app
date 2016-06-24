(function () {
    'use strict';

    angular
        .module('app')
        .factory('UtilsSvc', UtilsSvc);

    UtilsSvc.$inject = ['$location'];

    function UtilsSvc($location) {

        var service = {
            getUrlPrefix: getUrlPrefix
        };
        return service;

        function getUrlPrefix(){
            var prefix = '';
            $location.host().includes('localhost') ? prefix = 'http' : prefix = 'https';
            return prefix + '://' + $location.host() + ":" + $location.port();
        }

    }
})();
