(function() {
    'use strict';

    angular
        .module('app')
        .controller('coverCtrl', CoverCtrl);

    // CoverCtrl.$inject = [];

    function CoverCtrl(){
        var vm = this;
        activate();

        //////////////

        function activate() {
            console.log('CoverCtrl activate');

            // Get time left to wait before release in seconds
            var currentDate = new Date();
            var releaseDate = new Date('8/30/2016');
            vm.countdown = (Math.abs(releaseDate.getTime() - currentDate.getTime()))/1000;
        }
    }
})();
