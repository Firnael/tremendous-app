(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    ProgressCtrl.$inject = [];

    function ProgressCtrl(){
        var vm = this;

        vm.options = {
          scales : {
            xAxes : [{
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  max: 13,
                  stepSize: 1
                }
            }]
          }
				};

        vm.series = ['Progress'];

        vm.data = [
          [13, 13, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11]
        ];

        vm.labels = [
          'The Fallen',
          'Millenium',
          'Slow Motion',
          'Danse Avec Les Løøts',
          'Timeless',
          'Løst Heaven',
          'Shin',
          'Loreless',
          'Packet Loss',
          'adveRsity',
          'Sentence',
          'Aeris',
          'AquaPoney',
          'Misery',
          'Rhadamantis',
          'Zero Respect',
          'Enslave',
          'Rainbow Magic Pony',
          'Epic',
          'Shoot Again'
        ];

        activate();

        //////////////

        function activate() {
            console.log('ProgressCtrl activate');
        }
    }
})();
