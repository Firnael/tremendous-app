(function() {
    'use strict';

    angular
        .module('app')
        .controller('rankingCtrl', RankingCtrl);

    RankingCtrl.$inject = ['RankingSvc'];

    function RankingCtrl(RankingSvc){
        var vm = this;
        vm.ranking = undefined;
        vm.guild = undefined;
        vm.updating = true;

        vm.setRanking = setRanking;
        vm.getRanking = getRanking;
        vm.getGuildRanking = getGuildRanking;
        vm.getRankingLastUpdate = getRankingLastUpdate;
        vm.updateRanking = updateRanking;

        activate();

        //////////////

        function activate() {
          console.log('RankingCtrl activate');
          vm.getRanking();
        }

        function setRanking(data) {
          vm.ranking = data;
          vm.guild = getGuildRanking();
          vm.updating = false;
        }

        function getRanking() {
          RankingSvc.get().then(function (data) {
            vm.setRanking(data);
          });
        }

        function getGuildRanking() {
          for(var i=0; i<vm.ranking.guilds.length; i++) {
            var guild = vm.ranking.guilds[i];
            if(guild.name === 'Millenium') {
              return guild;
            }
          }
        }

        function getRankingLastUpdate() {
          return vm.ranking ? moment(vm.ranking.lastUpdate).calendar() : '';
        }

        function updateRanking() {
          vm.updating = true;
          RankingSvc.update().then(function (data) {
            vm.setRanking(data);
          });
        }
    }
})();
