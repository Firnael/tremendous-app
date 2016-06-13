(function() {
    'use strict';

    angular
        .module('app')
        .controller('testCtrl', TestCtrl);

    TestCtrl.$inject = ['$scope', 'BnetApiSvc'];

    function TestCtrl($scope, BnetApiSvc){
        var vm = this;
        vm.nice = "Nice";
        vm.character = '';

        vm.getCharacterInfo = getCharacterInfo;
        activate();

        //////////////

        function activate() {
            console.log('TestCtrl activate');
            BnetApiSvc.getTest(vm.character).then(function(data){
                console.log(data);
            });
        }

        function getCharacterInfo() {
            if(vm.character === undefined) {
                return;
            }

            BnetApiSvc.getCharacterInfo(vm.character).then(function(data){
                vm.data = data;
            });
        }
    }
})();
