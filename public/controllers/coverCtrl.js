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
        }
    }
})();
