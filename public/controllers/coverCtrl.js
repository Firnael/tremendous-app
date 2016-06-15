(function() {
    'use strict';

    angular
        .module('app')
        .controller('coverCtrl', CoverCtrl);

    CoverCtrl.$inject = ['$scope'];

    function CoverCtrl($scope){
        var vm = this;

        activate();

        //////////////

        function activate() {
            console.log('CoverCtrl activate');
        }
    }
})();
