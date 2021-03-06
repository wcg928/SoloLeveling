/*
*	@filename	SoloLevelingGlobals.js
*	@author		isid0re
*	@desc		Global variables Settings, general functions, and Dynamic tiers for SoloLeveling functionality
*/

// general settings
var difficulty = ['Normal', 'Nightmare', 'Hell'][me.diff];

// Character Respecialization Variables
// ClassLevel = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"][me.classid];
const respecOne = [ 0, 28, 26, 25, 0, 24, 0][me.classid];
const respecTwo = [ 0, 85, 75, 85, 0, 75, 0][me.classid];
var	levelcap = [35, 65, 100][me.diff];

// SoloLeveling Pickit Items
var valuableItems = [
	'([type] == ring || [type] == amulet) && [quality] >= magic # [fcr] >= 600',
	'([type] == armor || [type] == boots || [type] == gloves || [type] == belt) && [quality] >= magic # [fcr] >= 600',
	'([type] == helm || [type] == circlet || [type] == primalhelm || [type] == pelt)&& [quality] >= magic # [fcr] >= 600',
	'([type] == anyshield || [type] == voodooheads) && [quality] >= magic # [fcr] >= 600',
	'([type] == javelin || [type] == amazonspear || [type] == amazonjavelin) && [quality] >= magic # [fcr] >= 600',
	'([type] == orb || [type] == wand || [type] == staff) && [quality] >= normal # [fcr] >= 600',
	'([type] == throwingaxe || [type] == axe || [type] == mace || [type] == club || [type] == scepter || [type] == hammer) && [quality] >= magic # [fcr] >= 600',
	'([type] == sword || [type] == knife || [type] == throwingknife) && [quality] >= magic # [fcr] >= 600',
	'([type] == bow || [type] == crossbow) && [quality] >= magic # [fcr] >= 600',
	'([type] == handtohand || [type] == assassinclaw) && [quality] >= magic  # [fcr] >= 600',
];

var generalItems = [
	"[name] == tomeoftownportal",
	"[name] == tomeofidentify",
	"[name] == gold # [gold] >= me.charlvl * 3 * me.diff",
	"[name] == minorhealingpotion",
	"[name] == lighthealingpotion",
	"[name] == healingpotion",
	"[name] == greaterhealingpotion",
	"[name] == superhealingpotion",
	"[name] == minormanapotion",
	"[name] == lightmanapotion",
	"[name] == manapotion",
	"[name] == greatermanapotion",
	"[name] == supermanapotion",
	"[name] == rejuvenationpotion",
	"[name] == fullrejuvenationpotion",
	"[name] == ScrollofTownPortal # # [MaxQuantity] == 20",
	"[name] == scrollofidentify # # [MaxQuantity] == 20",
	"[name] == key # # [maxquantity] == 12",
	"[name] == perfectamethyst # # [MaxQuantity] == 2",
	"[name] == perfectemerald # # [MaxQuantity] == 2",
	"[name] == perfecttopaz # # [MaxQuantity] == 2",
	"[name] == perfectdiamond # # [MaxQuantity] == 2",
	"[name] == perfectruby # # [MaxQuantity] == 2",
	"[name] == perfectsapphire # # [MaxQuantity] == 2",
	"[name] >= pulrune && [name] <= zodrune"
];

var questItems = [
	"[Name] == ScrollOfInifuss",
	"[Name] == KeyToTheCairnStones",
	"[name] == BookOfSkill",
	"[Name] == HoradricCube",
	"[Name] == ShaftOfTheHoradricStaff",
	"[Name] == TopOfTheHoradricStaff",
	"[Name] == HoradricStaff",
	"[Name] == TheGoldenBird",
	"[Name] == potionoflife",
	"[Name] == lamesen'stome",
	"[Name] == Khalim'sEye",
	"[Name] == Khalim'sHeart",
	"[Name] == Khalim'sBrain",
	"[Name] == Khalim'sFlail",
	"[Name] == Khalim'sWill",
	"[Name] == ScrollofResistance",
];

// General functions
var goldCheck = function () {
	let gold = me.getStat(14) + me.getStat(15);
	let goldLimit = [10000, 50000, 100000][me.diff];

	if (gold >= goldLimit) {
		return true;
	}

	return false;
};

var runesCheck = function () {
	let haveRunes = false;

	switch (me.diff) {
	case 0: //normal
		//have items
		if (haveItem("shield", "runeword", "Ancients' Pledge") || haveItem("auricshields", "runeword", "Ancients' Pledge")) {
			haveRunes = true;
		}

		//have runes for "Ancients' Pledge"
		if (me.getItem("ralrune") && me.getItem("ortrune") && me.getItem("talrune")) {
			haveRunes = true;
		}

		break;
	case 1: //nightmare
		//have items
		if (haveItem("helm", "runeword", "Lore") && (me.classid !== 3 && haveItem("sword", "runeword", "Spirit") || me.classid === 3 && haveItem("sword", "runeword", "Spirit") && haveItem("auricshields", "runeword", "Spirit"))) {
			haveRunes = true;
		}

		//have runes for "Spirit" and "Lore"
		if (me.getItem("talrune") && me.getItem("thulrune") && me.getItem("ortrune") && me.getItem("amnrune") && me.getItem("solrune")) {
			haveRunes = true;
		}

		break;
	case 2: //hell
		if (!Misc.checkQuest(40, 0)) {
			haveRunes = true;
		}

		break;
	}

	return haveRunes;
};

var farmCheck = function (quest) {
	let dontfarm = true;

	if (me.gametype === 0 && Misc.checkQuest(26, 0) || Misc.checkQuest(40, 0)) {
		switch (quest) {
		case 2: //maus
			if (me.diff === 2) {
				dontfarm = false;
			}

			break;
		case 4: //cows
			dontfarm = false;
			break;
		case 6: //pits
			if (me.diff === 2) {
				dontfarm = false;
			}

			break;
		case 7: //andy
			if (me.gametype === 1 && me.diff === 1 || me.diff === 2) {
				dontfarm = false;
			}

			break;
		case 15: //ancient tunnels
			if (me.diff === 0 && !Pather.accessToAct(3) || me.diff === 2 && me.classid !== 3) {
				dontfarm = false;
			}

			break;
		case 22: //lower kurast
			if (me.diff === 2) {
				dontfarm = false;
			}

			break;
		case 23: //mephisto
			if (me.diff !== 0) {
				dontfarm = false;
			}

			break;
		case 26: //diablo
			dontfarm = false;

			break;
		case 35: // shenk
		case 37: // pindle
			if (me.diff === 2) {
				dontfarm = false;
			}

			break;
		case 40: //baal
			dontfarm = false;
			break;
		}
	}

	return dontfarm;
};

var movetoInventory = function (item, sorting = false) {
	if (item.mode === 3) {
		return false;
	}

	if (item.location === 3 && sorting === false) {
		return true;
	}

	let spot = Storage.Inventory.FindSpot(item);

	if (!spot) {
		return false;
	}

	if (item.location === 6) {
		while (!Cubing.openCube()) {
			delay(1 + me.ping * 2);
			Packet.flash(me.gid);
		}
	}

	if (Packet.itemToCursor(item)) {
		for (let i = 0; i < 15; i += 1) {
			sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x00);

			let tick = getTickCount();

			while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10 + me.ping);
			}
		}
	}

	return false;
};

var movetoStash = function (item, sorting = false) {
	if (item.mode === 3) {
		return false;
	}

	if (item.location === 7 && sorting === false) {
		return true;
	}

	let spot = Storage.Stash.FindSpot(item);

	if (!spot) {
		return false;
	}

	while (!Town.openStash()) {
		Packet.flash(me.gid);
		delay(me.ping * 2);
	}

	if (Packet.itemToCursor(item)) {
		for (let i = 0; i < 15; i += 1) {
			sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x04);

			let tick = getTickCount();

			while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10 + me.ping);
			}
		}
	}

	return false;
};

var haveItem = function (type, flag, iName) {
	if (type && !NTIPAliasType[type]) {
		print("ÿc9SoloLevelingÿc0: No alias for type '" + type + "'");
	}

	if (iName !== undefined) {
		iName = iName.toLowerCase();
	}

	let items = me.getItems();
	let itemCHECK = false;

	for (let i = 0; i < items.length && !itemCHECK; i++) {

		switch (flag) {
		case 'crafted':
			itemCHECK = !!(items[i].getFlag(NTIPAliasQuality["crafted"]));
			break;
		case 'runeword':
			itemCHECK = !!(items[i].getFlag(NTIPAliasFlag["runeword"])) && items[i].fname.toLowerCase().includes(iName);
			break;
		}

		if (type) {
			itemCHECK = itemCHECK && (items[i].itemType === NTIPAliasType[type]);
		}
	}

	return itemCHECK;
};

var indexOfMax = function (arr) {
	if (arr.length === 0) {
		return -1;
	}

	var max = arr[0];
	var maxIndex = 0;

	for (let index = 1; index < arr.length; index++) {
		if (arr[index] > max) {
			maxIndex = index;
			max = arr[index];
		}
	}

	return maxIndex;
};

// Dynamic Tiers
var buildCheck = function () {
	function getBuildTemplate () {
		let buildType = finalBuild;
		let build = buildType + "Build" ;
		let classname = ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"][me.classid];
		let template = "SoloLeveling/BuildFiles/" + classname + "." + build + ".js";

		return template.toLowerCase();
	}

	var template = getBuildTemplate();

	if (!include(template)) {
		throw new Error("buildCheck(): Failed to include template: " + template);
	}

	return {
		caster: build.caster,
		tabSkills: build.skillstab,
		wantedSkills: build.wantedskills,
		usefulSkills: build.usefulskills,
	};
};

var isCaster = buildCheck().caster;

var mercscore = function (item) {
	var mercWeights = {
		IAS: 3.5,
		MINDMG:	3, // min damage
		MAXDMG: 3, // max damage
		ELEDMG: 2, // elemental damage
		AR:	0.5, // attack rating
		CB: 3, // crushing blow
		LL: 1.5, //lifeleach
		// regen
		HPREGEN: 2,
		FHR: 3, // faster hit recovery
		DEF: 0.05, // defense
		HP:	2,
		STR:	1.5,
		DEX:	1.5,
		ALL:	180, // + all skills
		FR: 3.5, // fire resist
		LR: 4, // lightning resist
		CR: 2, // cold resist
		PR: 1, // poison resist
	};

	let mercRating = 1;
	mercRating += item.getStatEx(151, 120) * 100; // meditation aura
	mercRating += item.getStatEx(151, 123) * 1000; // conviction aura
	mercRating += item.getStatEx(93) * mercWeights.IAS; // add IAS
	mercRating += item.getStatEx(21) * mercWeights.MINDMG; // add MIN damage
	mercRating += item.getStatEx(22) * mercWeights.MAXDMG; // add MAX damage
	mercRating += (item.getStatEx(48) + item.getStatEx(49) + item.getStatEx(50) + item.getStatEx(51) + item.getStatEx(52) + item.getStatEx(53) + item.getStatEx(54) + item.getStatEx(55)) * mercWeights.ELEDMG; // add elemental damage
	mercRating += item.getStatEx(19) * mercWeights.AR; // add AR
	mercRating += item.getStatEx(136) * mercWeights.CB; // add crushing blow
	mercRating += item.getStatEx(60) * mercWeights.LL; // add LL
	mercRating += item.getStatEx(74) * mercWeights.HPREGEN; // add hp regeneration
	mercRating += item.getStatEx(99) * mercWeights.FHR; // add faster hit recovery
	mercRating += item.getStatEx(31) * mercWeights.DEF; //	add Defense
	mercRating += (item.getStatEx(3) + item.getStatEx(7) + (item.getStatEx(216) / 2048 * me.charlvl)) * mercWeights.HP; // add HP
	mercRating += item.getStatEx(0) * mercWeights.STR; // add STR
	mercRating += item.getStatEx(2) * mercWeights.DEX; // add DEX
	mercRating += item.getStatEx(127) * mercWeights.ALL; // add all skills
	mercRating += item.getStatEx(39) * mercWeights.FR; // add FR
	mercRating += item.getStatEx(43) * mercWeights.CR; // add CR
	mercRating += item.getStatEx(41) * mercWeights.LR; // add LR
	mercRating += item.getStatEx(45) * mercWeights.PR; // add PR

	let rwBase;

	for (let x = 0; x < Config.Runewords.length; x += 1) {
		let sockets = Config.Runewords[x][0].length;
		let baseCID = Config.Runewords[x][1];

		if (item.classid === baseCID && item.quality < 4 && item.getStat(194) === sockets && !item.getFlag(NTIPAliasFlag["runeword"])) {
			rwBase = true;
		}
	}

	if (rwBase) {
		mercRating = -1;
	}

	return mercRating;
};

var tierscore = function (item) {
	var resistWeights = {
		FR: 3.5, // fire resist
		LR: 4, // lightning resist
		CR: 2, // cold resist
		PR: 1, // poison resist
		ABS: 2.5 // absorb damage (fire light magic cold)
	};

	var generalWeights = {
		CBF: 25, // cannot be frozen
		FRW: 1, // faster run/walk
		FHR: 3, // faster hit recovery
		DEF: 0.05, // defense
		ICB: 2, // increased chance to block
		BELTSLOTS: 1, //belt potion storage
		// base stats
		HP:	2,
		MANA:	0.8,
		STR:	1.5,
		DEX:	1.5,
	};

	var casterWeights = {
		//breakpoint stats
		FCR:	3.5,
		IAS:	0,
		// Attack
		MINDMG:	0, // min damage
		MAXDMG: 0, // max damage
		ELEDMG: 0, // elemental damage
		AR:	0, // attack rating
		CB: 0, // crushing blow
		// leaching
		LL:	0, //lifeleach
		ML:	0, //manaleach
		// regen
		HPREGEN: 2,
		MANAREGEN: 2,
	};

	var meleeWeights = {
		//breakpoint stats
		FCR: 0,
		IAS: 3.5,
		// Attack
		MINDMG:	3, // min damage
		MAXDMG: 3, // max damage
		ELEDMG: 2, // elemental damage
		AR:	0.5, // attack rating
		CB: 3, // crushing blow
		// leaching
		LL: 1.5, //lifeleach
		ML:	1.5, //manaleach
		// regen
		HPREGEN: 2,
		MANAREGEN: 2,
	};

	var skillsWeights = {
		ALL:	180, // + all skills
		CLASS:	175, // + class tab
		TAB: 100, // + skill tab
		WANTED: 30, // + wanted key skills
		USEFUL: 20 // + wanted supportive skills
	};

	this.generalScore = function (item) {
		// cannot be frozen
		let cbfItem = NTIPAliasStat["itemcannotbefrozen"],
			cbfRating = 0,
			needsCBF = !me.getSkill(54, 0),
			body = me.getItems()
				.filter(item => [1].indexOf(item.location) > -1 ) // limit search to equipped body parts
				.sort((a, b) => a.location - b.location); // Sort on body, low to high.

		if (needsCBF && item.getStatEx(cbfItem)) {
			let haveCBF = false;

			for (let part = 0; part < body.length; part++) { // total 10 body slots
				if (body[part].getStatEx(cbfItem)) {
					haveCBF = true;

					break;
				}
			}

			if (!haveCBF) {
				cbfRating = generalWeights.CBF;
			}
		}

		// faster run/walk
		let frwRating = 0,
			needsFrw = !me.getSkill(54, 0); // value FRW if no teleport

		if (needsFrw) {
			frwRating = item.getStatEx(96) * generalWeights.FRW;
		}

		// belt slots
		let beltRating = 0,
			isBelt = item.itemType === 19; // check if belt

		if (isBelt) {
			beltRating = Storage.BeltSize() * 4 * generalWeights.BELTSLOTS; // rows * columns * weight
		}

		//start generalRating
		let generalRating = 0;
		generalRating += cbfRating; // add cannot be frozen
		generalRating += frwRating; // add faster run walk
		generalRating += beltRating; // add belt slots
		generalRating += item.getStatEx(99) * generalWeights.FHR; // add faster hit recovery
		generalRating += item.getStatEx(31) * generalWeights.DEF; //	add Defense
		generalRating += (item.getStatEx(20) + item.getStatEx(102)) * generalWeights.ICB; //add increased chance to block
		generalRating += (item.getStatEx(3) + item.getStatEx(7) + (item.getStatEx(216) / 2048 * me.charlvl)) * generalWeights.HP; // add HP
		generalRating += (item.getStatEx(1) + item.getStatEx(9) + (item.getStatEx(217) / 2048 * me.charlvl)) * generalWeights.MANA;// add mana
		generalRating += item.getStatEx(0) * generalWeights.STR; // add STR
		generalRating += item.getStatEx(2) * generalWeights.DEX; // add DEX

		return generalRating;
	};

	this.resistScore = function (item) {
		let resistRating = 0;
		// current total resists
		let currFR = me.getStat(39); // current fire resist
		let currCR = me.getStat(43); // current cold resist
		let currLR = me.getStat(41); // current lite resist
		let currPR = me.getStat(45); // current poison resist
		// get item body location
		let itembodyloc = Item.getBodyLoc(item);

		if (!itembodyloc) {
			return resistRating;
		}

		let bodyloc = itembodyloc[0]; // extract bodyloc from array
		// get item resists stats from olditem equipped on body location
		let equippedItems = me.getItems()
			.filter(item =>
				item.bodylocation === bodyloc // filter equipped items to body location
				&& [1].indexOf(item.location) > -1); // limit search to equipped body parts
		let oldItem = equippedItems[0]; // extract oldItem from array
		let olditemFR = oldItem !== undefined ? oldItem.getStatEx(39) : 0; // equipped fire resist
		let olditemCR = oldItem !== undefined ? oldItem.getStatEx(43) : 0; // equipped cold resist
		let olditemLR = oldItem !== undefined ? oldItem.getStatEx(41) : 0; // equipped lite resist
		let olditemPR = oldItem !== undefined ? oldItem.getStatEx(45) : 0; // equipped poison resist
		// subtract olditem resists from current total resists
		let baseFR = currFR - olditemFR;
		let baseCR = currCR - olditemCR;
		let baseLR = currLR - olditemLR;
		let basePR = currPR - olditemPR;
		// if baseRes < max resists give score value upto max resists reached
		let maxRes = me.gametype === 1 ? 175 : 125;
		let FRlimit = Math.max(maxRes - baseFR, 0);
		let CRlimit = Math.max(maxRes - baseCR, 0);
		let LRlimit = Math.max(maxRes - baseLR, 0);
		let PRlimit = Math.max(maxRes - basePR, 0);
		// get new item stats
		let newitemFR = Math.max(item.getStatEx(39), 0); // fire resist
		let newitemCR = Math.max(item.getStatEx(43), 0); // cold resist
		let newitemLR = Math.max(item.getStatEx(41), 0); // lite resist
		let newitemPR = Math.max(item.getStatEx(45), 0); // poison resist
		// newitemRes upto reslimit
		let effectiveFR = Math.min(newitemFR, FRlimit);
		let effectiveCR = Math.min(newitemCR, CRlimit);
		let effectiveLR = Math.min(newitemLR, LRlimit);
		let effectivePR = Math.min(newitemPR, PRlimit);
		// sum resistRatings
		resistRating += effectiveFR * resistWeights.FR; // add fireresist
		resistRating += effectiveCR * resistWeights.CR; // add coldresist
		resistRating += effectiveLR * resistWeights.LR; // add literesist
		resistRating += effectivePR * resistWeights.PR; // add poisonresist
		resistRating += (item.getStatEx(142) + item.getStatEx(144) + item.getStatEx(146) + item.getStatEx(148)) * resistWeights.ABS; // add absorb damage

		return resistRating;
	};

	var buildWeights = isCaster ? casterWeights : meleeWeights;

	this.buildScore = function (item) {
		let buildRating = 0;
		buildRating += item.getStatEx(105) * buildWeights.FCR; // add FCR
		buildRating += item.getStatEx(93) * buildWeights.IAS; // add IAS
		buildRating += item.getStatEx(21) * buildWeights.MINDMG; // add MIN damage
		buildRating += item.getStatEx(22) * buildWeights.MAXDMG; // add MAX damage
		buildRating += (item.getStatEx(48) + item.getStatEx(49) + item.getStatEx(50) + item.getStatEx(51) + item.getStatEx(52) + item.getStatEx(53) + item.getStatEx(54) + item.getStatEx(55) + item.getStatEx(57) + item.getStatEx(58)) * buildWeights.ELEDMG; // add elemental damage
		buildRating += item.getStatEx(19) * buildWeights.AR; // add AR
		buildRating += item.getStatEx(60) * buildWeights.LL; // add LL
		buildRating += item.getStatEx(62) * buildWeights.ML; // add ML
		buildRating += item.getStatEx(74) * buildWeights.HPREGEN; // add hp regeneration
		buildRating += item.getStatEx(26) * buildWeights.MANAREGEN; // add mana recovery

		return buildRating;
	},

	this.skillsScore = function (item) {
		let skillsRating = 0;
		skillsRating += item.getStatEx(127) * skillsWeights.ALL; // + all skills
		skillsRating += item.getStatEx(83, me.classid) * skillsWeights.CLASS; // + class skills
		skillsRating += item.getStatEx(188, buildCheck().tabSkills) * skillsWeights.TAB; // + TAB skills
		let selectedWeights = [skillsWeights.WANTED, skillsWeights.USEFUL];
		let selectedSkills = [buildCheck().wantedSkills, buildCheck().usefulSkills];

		for (let i = 0; i < selectedWeights.length; i++) {
			for (let j = 0; j < selectedSkills.length; j++) {
				for (let k = 0; k < selectedSkills[j].length; k++) {
					skillsRating += item.getStatEx(107, selectedSkills[j][k]) * selectedWeights[i];
				}
			}
		}

		return skillsRating;
	};

	let tier = 1; // set to 1 for native autoequip to use items.
	tier += this.generalScore(item);
	tier += this.resistScore(item);
	tier += this.buildScore(item);
	tier += this.skillsScore(item);

	let rwBase; // don't score runeword base armors
	let questItem, itemsList = [521, 92, 173, 174]; // don't score viper amulet, staff of kings, khalim's flail

	for (let y = 0; y < itemsList.length; y += 1) {
		if (item.classid === itemsList[y]) {
			questItem = true;
		}
	}

	for (let x = 0; x < Config.Runewords.length; x += 1) {
		let sockets = Config.Runewords[x][0].length;
		let baseCID = Config.Runewords[x][1];

		if (item.classid === baseCID && item.quality < 4 && item.getStat(194) === sockets && !item.getFlag(NTIPAliasFlag["runeword"])) {
			rwBase = true;
		}
	}

	if (rwBase || questItem) {
		tier = -1;
	}

	return tier;
};

var getMercFix = function () { // merc is null fix
	if (!Config.UseMerc) {
		return null;
	}

	merc = me.getMerc();

	for (var i = 0; i < 3; i++) {
		if (merc) {
			if (merc.mode === 0 || merc.mode === 12) {
				return null;
			}

			break;
		}

		delay(100 + me.ping);
		merc = me.getMerc();
	}

	return merc;
};

//prototypes
Unit.prototype.getItems = function (...args) {
	let items = this.getItems.apply(this, args);

	if (!items.length) {
		return [];
	}

	return items;
};
