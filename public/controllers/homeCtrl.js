(function() {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', HomeCtrl);

    // HomeCtrl.$inject = [];

    function HomeCtrl(){
        var vm = this;

        activate();

        //////////////

        function activate() {
            console.log('HomeCtrl activate');
        }
    }
})();
