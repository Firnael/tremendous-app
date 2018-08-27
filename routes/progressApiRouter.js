var express = require('express');
var bnet = require('battlenet-api')(process.env.BNET_STRATEGY_CLIENT_ID);
var progressApiRouter = express.Router();
// Models
var Progress = require('../models/progress');

/**
 * Get progress
 */
progressApiRouter.route('/').get(function (req, res) {
  Progress.findOne({}, function (err, progress) {
    if (err) { res.send(err); return; }
    return res.send(progress);
  });
});

/**
 * Update progress based on roster achievements
 */
progressApiRouter.route('/update').get(function (req, res) {
  bnet.wow.character.aggregate({ origin: 'eu', realm: 'ysondre', name: 'Croclardon', fields: ['progression'] }, function (err, character) {
    if (err) { res.send(err); return; }

    var data = createProgressData(character.progression);

    // Wipe clean the progress collection
    Progress.remove({}, function(err) {
      if (err) { return res.send(err); }

      // Create new Progress
      var progress = new Progress();
      progress.lastUpdate = new Date().getTime();
      progress.emeraldNightmare = data.emeraldNightmare;
      progress.nighthold = data.nighthold;
      progress.trialOfValor = data.trialOfValor;

      // Save it
      progress.save(function(errsave) {
        if (errsave) { return res.send(errsave); }
        console.log('Progress updated');
        return res.send(progress);
      });
    });
  });
});

function createProgressData(progression) {
  var data = {};

  // Extract Legion raids
  var enTmp;
  var tovTmp;
  var nhTmp;
  for(var i=0; i<progression.raids.length; i++) {
    var raid = progression.raids[i];

    if(raid.id === 8026) { // Cauchemard d'Emeraude
      enTmp = raid;
    } else if(raid.id === 8025) { // Palais Sacrenuit
      nhTmp = raid;
    } else if(raid.id === 8440) { // Jugement des Valeureux
      tovTmp = raid;
    }
  }

  // Create progress data
  var emeraldNightmare = [];
  for(var i=0; i<enTmp.bosses.length; i++) {
    var boss = enTmp.bosses[i];
    emeraldNightmare.push({ 'bossName': boss.name, 'downs': getProgressTimestamps(boss) });
  }

  var nighthold = [];
  for(var i=0; i<nhTmp.bosses.length; i++) {
    var boss = nhTmp.bosses[i];
    nighthold.push({ 'bossName': boss.name, 'downs': getProgressTimestamps(boss) });
  }

  var trialOfValor = [];
  for(var i=0; i<tovTmp.bosses.length; i++) {
    var boss = tovTmp.bosses[i];
    trialOfValor.push({ 'bossName': boss.name, 'downs': getProgressTimestamps(boss) });
  }

  data.emeraldNightmare = emeraldNightmare;
  data.nighthold = nighthold;
  data.trialOfValor = trialOfValor;
  return data;
}

function getProgressTimestamps(boss) {
  var nDown = { difficulty: 1, timestamp: boss.normalTimestamp };
  var hDown = { difficulty: 2, timestamp: boss.heroicTimestamp };
  var mDown = { difficulty: 3, timestamp: boss.mythicTimestamp };
  return [nDown, hDown, mDown];
}

module.exports = progressApiRouter;
