var express = require('express');
var bnet = require('battlenet-api')('tpkmytrfpdp2casqurxt24z8ub5u4khn');
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
  bnet.wow.character.aggregate({ origin: 'eu', realm: 'ysondre', name: 'Croclardon', fields: ['achievements'] }, function (err, character) {
    if (err) { res.send(err); return; }

    var data = createProgressData(character.achievements);

    // Wipe clean the progress collection
    Progress.remove({}, function(err) {
      if (err) { return res.send(err); }

      // Create new Progress
      var progress = new Progress();
      progress.lastUpdate = new Date().getTime();
      progress.emeraldNightmare = data.emeraldNightmare;
      progress.nighthold = data.nighthold;

      // Save it
      progress.save(function(errsave) {
          if (errsave) { return res.send(errsave); }
          console.log('Progress updated');
          return res.send(progress);
      });
    });
  });
});

function createProgressData(achievs) {
  var data = {};

  // Create progress data
  var emeraldNightmare = [];
  emeraldNightmare.push({ 'bossName': 'Ursoc', 'downs': getProgressAchiev(achievs, 10916, 10917, 10919) });
  emeraldNightmare.push({ 'bossName': 'Nythendra', 'downs': getProgressAchiev(achievs, 10912, 10913, 10914) });
  emeraldNightmare.push({ 'bossName': 'Elerethe Renferal', 'downs': getProgressAchiev(achievs, 10921, 10922, 10923) });
  emeraldNightmare.push({ 'bossName': 'Il\'gynoth', 'downs': getProgressAchiev(achievs, 10925, 10926, 10927) });
  emeraldNightmare.push({ 'bossName': 'Dragons du cauchemard', 'downs': getProgressAchiev(achievs, 10929, 10930, 10931) });
  emeraldNightmare.push({ 'bossName': 'Cenarius', 'downs': getProgressAchiev(achievs, 10933, 10934, 10935) });
  emeraldNightmare.push({ 'bossName': 'Xavius', 'downs': getProgressAchiev(achievs, 10937, 10938, 10939) });

  var nighthold = [];
  nighthold.push({ 'bossName': 'Skorpyron', 'downs': getProgressAchiev(achievs, 10941, 10942, 10943) });
  nighthold.push({ 'bossName': 'Krosus', 'downs': getProgressAchiev(achievs, 10970, 10971, 10972) });
  nighthold.push({ 'bossName': 'Anomalie chromatique', 'downs': getProgressAchiev(achievs, 10945, 10946, 10947) });
  nighthold.push({ 'bossName': 'Trilliax', 'downs': getProgressAchiev(achievs, 10949, 10950, 10951) });
  nighthold.push({ 'bossName': 'Star Augur Etraeus', 'downs': getProgressAchiev(achievs, 10957, 10959, 10960) });
  nighthold.push({ 'bossName': 'Grand Magistrix Elisande', 'downs': getProgressAchiev(achievs, 10974, 10975, 10976) });
  nighthold.push({ 'bossName': 'High Botanist Tel\'arn', 'downs': getProgressAchiev(achievs, 10962, 10963, 10964) });
  nighthold.push({ 'bossName': 'Spellblade Aluriel', 'downs': getProgressAchiev(achievs, 10953, 10954, 10955) });
  nighthold.push({ 'bossName': 'Tichondrius', 'downs': getProgressAchiev(achievs, 10966, 10967, 10968) });
  nighthold.push({ 'bossName': 'Gul\'dan', 'downs': getProgressAchiev(achievs, 10978, 10979, 10980) });

  data.emeraldNightmare = emeraldNightmare;
  data.nighthold = nighthold;
  return data;
}

function getProgressAchiev(achievs, normal, heroic, mythic) {
  var achievements = achievs.achievementsCompleted;
  var timestamps = achievs.achievementsCompletedTimestamp;

  var nIndex = achievements.indexOf(normal);
  var hIndex = achievements.indexOf(heroic);
  var mIndex = achievements.indexOf(mythic);

  var nDown = { difficulty: 1, timestamp: (nIndex < 0) ? 0 : timestamps[nIndex] };
  var hDown = { difficulty: 2, timestamp: (hIndex < 0) ? 0 : timestamps[hIndex] };
  var mDown = { difficulty: 3, timestamp: (mIndex < 0) ? 0 : timestamps[mIndex] };

  return [nDown, hDown, mDown];
}

module.exports = progressApiRouter;
