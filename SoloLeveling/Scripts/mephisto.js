/*
*	@filename	mephisto.js
*	@author		isid0re
*	@desc		mephisto quest
*/

function mephisto () {
	if (!Pather.accessToAct(3) || !Misc.checkQuest(18, 0) || farmCheck(23) && Misc.checkQuest(23, 0)) {
		return true;
	}

	Town.townTasks();
	print('ÿc9SoloLevelingÿc0: starting mephisto');
	me.overhead("mephisto");

	if (!Pather.checkWP(101)) {
		Pather.getWP(101);
	} else {
		Pather.useWaypoint(101);
	}

	Precast.doPrecast(true);
	Pather.moveToExit(102, true);
	Town.doChores();
	Town.buyPots(10, "Thawing"); // thawing
	Town.drinkPots();
	Town.buyPots(10, "Antidote"); // antidote
	Town.drinkPots();
	Pather.usePortal(102, me.name);
	Precast.doPrecast(true);
	Pather.moveTo(17692, 8048);
	Pather.moveTo(17563, 8072);
	Config.MercWatch = false;
	Attack.killTarget("Mephisto");
	Config.MercWatch = true;
	Pickit.pickItems();
	Pather.moveTo(17581, 8070);
	delay(250 + me.ping * 2);
	Pather.usePortal(null);

	return true;
}
