(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    ProgressCtrl.$inject = ['$scope'];

    function ProgressCtrl($scope){
        var vm = this;
        vm.data = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]];
        vm.labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

        activate();

        //////////////

        function activate() {
            console.log('ProgressCtrl activate');
        }
    }
})();
