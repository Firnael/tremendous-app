(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    // ProgressCtrl.$inject = [];

    function ProgressCtrl(){
        var vm = this;
        activate();

        //////////////

        function activate() {
            console.log('ProgressCtrl activate');
        }
    }
})();
