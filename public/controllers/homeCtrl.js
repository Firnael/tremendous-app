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

        // Get time left to wait before release in seconds
        var currentDate = new Date();
        var releaseDate = new Date('9/21/2016');
        vm.countdown = (Math.abs(releaseDate.getTime() - currentDate.getTime()))/1000;
      }
    }
})();
