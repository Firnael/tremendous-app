// models/character.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    lastModified: Number,
    name: String,
    guildRank: Number,
    class: Number,
    race: Number,
    gender: Number,
    level: Number,
    achievementPoints: Number,
    thumbnail: String,
    averageItemLevel: Number,
    averageItemLevelEquipped: Number,
    items: [
      { slot: String, id: Number, quality: Number, ilvl: Number }
    ],
    heartOfAzerothLevel: Number,
    audit: {
      missingEnchants: Number,
      wrongEnchant: Number,
      gemSlots: Number,
      equipedKrakenEye: Number,
      equipedGems: Number,
      equipedWrongGems: Number
    },
    arena2v2Rating: Number,
    arena3v3Rating: Number,
    arena2v2SeasonWon: Number,
    arena2v2SeasonLost: Number,
    arena3v3SeasonWon: Number,
    arena3v3SeasonLost: Number,
    rbgRating: Number,
    rbgSeasonWon: Number,
    rbgSeasonLost: Number,
    provingGroundsDps: Number,
    provingGroundsTank: Number,
    provingGroundsHeal: Number,
    professions: [
      { name: String, rank: Number, max: Number, primary: Boolean }
    ],
    alchemyRecipes: Array,
    jewelcraftingRecipes: Array,
    enchantRecipes: Array,
    cookingRecipes: Array,
    specs: [
      { name: String, selected: Boolean }
    ],
    reputations: [
      { name: String, standing: Number, current: Number, max: Number }
    ],
    mythicDungeons: {
      total: Number,
      dungeons: Object
    },
    role: Number,
    accountIdentifier: Number,
    battletag: String,
    loot : [
      { bossId: Number, value: Number }
    ]
});

module.exports = mongoose.model('Character', CharacterSchema);
