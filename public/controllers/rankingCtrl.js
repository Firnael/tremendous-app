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
      vm.getTierProgress = getTierProgress;
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

      function getTierProgress(progress) {
        var array = progress.split(' ');
        return array[2] + ' ' + array[3] + ' ' + array[4] + ' ' + array[5];
      }

      function getProgressValue(progress) {
        var array = progress.split(' ');
        var trialOfValor = parseInt(array[2].substring(0,1));
        if(array[3].indexOf('M') >= 0) {
          trialOfValor += 3;
        }
        var nighthold = parseInt(array[4].substring(0,1));
        if(array[5].indexOf('M') >= 0) {
          nighthold += 10;
        }

        var final = trialOfValor + nighthold;

        if(final === 26) {
          return 'legendary';
        } else if(final >= 23) {
          return 'epic';
        } else if(final >= 19) {
          return 'rare';
        } else if(final >= 16) {
          return 'uncommon';
        } else if(final >= 15) {
          return 'common';
        } else {
          return 'poor';
        }
      }
    }
})();
