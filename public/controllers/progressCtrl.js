(function() {
    'use strict';

    angular
        .module('app')
        .controller('progressCtrl', ProgressCtrl);

    ProgressCtrl.$inject = ['WowProgressApiSvc'];

    function ProgressCtrl(WowProgressApiSvc){
        var vm = this;

        /*
        <!-- Ranking -->
        <div class="col-md-9">
          <canvas class="chart chart-horizontal-bar" chart-data="vm.data" chart-labels="vm.labels" chart-series="vm.series"  chart-options="vm.options"></canvas>
        </div>
        
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
        */

        vm.guildRank = undefined;
        vm.getGuildRank = getGuildRank;
        activate();

        //////////////

        function activate() {
            console.log('ProgressCtrl activate');
            vm.getGuildRank();
        }

        function getGuildRank() {
            WowProgressApiSvc.getGuildRank().then(function (data) {
                vm.guildRank = data;
            });
        }
    }
})();
