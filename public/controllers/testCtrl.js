(function() {
    'use strict';

    angular
        .module('app')
        .controller('testCtrl', TestCtrl);

    TestCtrl.$inject = ['$scope'];

    function TestCtrl($scope){
        var vm = this;
        vm.nice = "Nice";

        activate();

        //////////////

        function activate() {
            console.log('TestCtrl activate');
        }
    }
})();
