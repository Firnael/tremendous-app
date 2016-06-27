(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    // ProgressCtrl.$inject = [];

    function ProgressCtrl(){
        var vm = this;

        vm.data = [65, 59, 80, 81, 56, 55, 40];
        vm.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];

        activate();

        //////////////

        function activate() {
            console.log('ProgressCtrl activate');
        }
    }
})();
