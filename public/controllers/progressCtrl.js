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
        vm.labels = [ 'x'... autant d'occurences que de data ];
        vm.data = [
          [x occurences]
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
