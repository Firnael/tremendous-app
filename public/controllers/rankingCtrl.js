(function() {
    'use strict';

    angular
        .module('app')
        .controller('rankingCtrl', RankingCtrl);

    RankingCtrl.$inject = ['WowProgressApiSvc'];

    function RankingCtrl(WowProgressApiSvc){
        var vm = this;
        vm.guildRank = undefined;
        vm.getGuildRank = getGuildRank;

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
        vm.labels = [ 'x'... autant d'occurences que de data ];
        vm.data = [
          [x occurences]
        ];
        */

        activate();

        //////////////

        function activate() {
            console.log('RankingCtrl activate');
            vm.getGuildRank();
        }

        function getGuildRank() {
            WowProgressApiSvc.getGuildRank().then(function (data) {
                vm.guildRank = data;
            });
        }
    }
})();
