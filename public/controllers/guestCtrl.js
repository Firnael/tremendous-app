(function() {
    'use strict';

    angular
        .module('app')
        .controller('guestCtrl', GuestCtrl);

    // GuestCtrl.$inject = [];

    function GuestCtrl() {
      var vm = this;
      activate();

      //////////////

      function activate() {
        console.log('GuestCtrl activate');
      }
    }
})();
