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
      vm.updateRanking = updateRanking;
      vm.getProgressValue = getProgressValue;

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
          if(!data) {
            console.log('getRanking: no data');
            vm.updating = false;
          }
          vm.setRanking(data);
        });
      }

      function getGuildRanking() {
        for(var i=0; i<vm.ranking.guilds.length; i++) {
          var guild = vm.ranking.guilds[i];
          if(guild.name === 'Tremendous') {
            return guild;
          }
        }
      }

      function updateRanking() {
        vm.updating = true;
        RankingSvc.update().then(function (data) {
          vm.setRanking(data);
        });
      }

      function getProgressValue(guild) {
        var nighthold = parseInt(guild.nighthold.substring(0,2));
        if(nighthold === 10) {
          return 'legendary';
        } else if(nighthold >= 7) {
          return 'epic';
        } else if(nighthold >= 5) {
          return 'rare';
        } else if(nighthold >= 4) {
          return 'uncommon';
        } else if(nighthold >= 3) {
          return 'common';
        } else {
          return 'poor';
        }
      }
    }
})();
