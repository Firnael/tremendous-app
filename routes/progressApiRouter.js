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

    var data = createProgressData(character.achievements.achievementsCompleted);

    // Wipe clean the progress collection
    Progress.remove({}, function(err) {
      if (err) { return res.send(err); }

      // Create new Progress
      var progress = new Progress();
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
  emeraldNightmare.push({ 'name': 'Ursoc', 'difficulty': checkProgressAchiev(achievs, 10916, 10917, 10919) });
  emeraldNightmare.push({ 'name': 'Nythendra', 'difficulty': checkProgressAchiev(achievs, 10912, 10913, 10914) });
  emeraldNightmare.push({ 'name': 'Elerethe Renferal', 'difficulty': checkProgressAchiev(achievs, 10921, 10922, 10923) });
  emeraldNightmare.push({ 'name': 'Il\'gynoth', 'difficulty': checkProgressAchiev(achievs, 10925, 10926, 10927) });
  emeraldNightmare.push({ 'name': 'Dragons du cauchemard', 'difficulty': checkProgressAchiev(achievs, 10929, 10930, 10931) });
  emeraldNightmare.push({ 'name': 'Cenarius', 'difficulty': checkProgressAchiev(achievs, 10933, 10934, 10935) });
  emeraldNightmare.push({ 'name': 'Xavius', 'difficulty': checkProgressAchiev(achievs, 10937, 10938, 10939) });

  var nighthold = [];
  nighthold.push({ 'name': 'Skorpyron', 'difficulty': checkProgressAchiev(achievs, 10941, 10942, 10943) });
  nighthold.push({ 'name': 'Krosus', 'difficulty': checkProgressAchiev(achievs, 10970, 10971, 10972) });
  nighthold.push({ 'name': 'Anomalie chromatique', 'difficulty': checkProgressAchiev(achievs, 10945, 10946, 10947) });
  nighthold.push({ 'name': 'Trilliax', 'difficulty': checkProgressAchiev(achievs, 10949, 10950, 10951) });
  nighthold.push({ 'name': 'Star Augur Etraeus', 'difficulty': checkProgressAchiev(achievs, 10957, 10959, 10960) });
  nighthold.push({ 'name': 'Grand Magistrix Elisande', 'difficulty': checkProgressAchiev(achievs, 10974, 10975, 10976) });
  nighthold.push({ 'name': 'High Botanist Tel\'arn', 'difficulty': checkProgressAchiev(achievs, 10962, 10963, 10964) });
  nighthold.push({ 'name': 'Spellblade Aluriel', 'difficulty': checkProgressAchiev(achievs, 10953, 10954, 10955) });
  nighthold.push({ 'name': 'Tichondrius', 'difficulty': checkProgressAchiev(achievs, 10966, 10967, 10968) });
  nighthold.push({ 'name': 'Gul\'dan', 'difficulty': checkProgressAchiev(achievs, 10978, 10979, 10980) });

  data.emeraldNightmare = emeraldNightmare;
  data.nighthold = nighthold;
  return data;
}

function checkProgressAchiev(achievs, n, h, m) {
  var result = 0;
  if(achievs.indexOf(m) > 0) {
    return 3;
  } else if(achievs.indexOf(h) > 0) {
    return 2
  } else if(achievs.indexOf(n) > 0) {
    return 1
  }
  return 0;
}

module.exports = progressApiRouter;
