/**
*	@filename	cows.js
*	@author		kolton, modified by isid0re for SoloLeveling
*	@desc		clear the Moo Moo Farm without killing the Cow King
*/

function cows () {
	this.buildCowRooms = function () {
		var i, j, room, kingPreset, badRooms, badRooms2,
			finalRooms = [],
			indexes = [];

		kingPreset = getPresetUnit(me.area, 1, 773);
		badRooms = getRoom(kingPreset.roomx * 5 + kingPreset.x, kingPreset.roomy * 5 + kingPreset.y).getNearby();

		for (i = 0; i < badRooms.length; i += 1) {
			badRooms2 = badRooms[i].getNearby();

			for (j = 0; j < badRooms2.length; j += 1) {
				if (indexes.indexOf(badRooms2[j].x + "" + badRooms2[j].y) === -1) {
					indexes.push(badRooms2[j].x + "" + badRooms2[j].y);
				}
			}
		}

		room = getRoom();

		do {
			if (indexes.indexOf(room.x + "" + room.y) === -1) {
				finalRooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
			}
		} while (room.getNext());

		return finalRooms;
	};

	this.clearCowLevel = function () {
		var room, result, myRoom,
			rooms = this.buildCowRooms();

		function RoomSort (a, b) {
			return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
		}

		while (rooms.length > 0) {
			if (!myRoom) {
				room = getRoom(me.x, me.y);
			}

			if (room) {
				if (room instanceof Array) {
					myRoom = [room[0], room[1]];
				} else {
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}
			}

			rooms.sort(RoomSort);
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 10, 2);

			if (result) {
				Pather.moveTo(result[0], result[1], 3);

				if (!Attack.clear(30)) {
					return false;
				}
			}
		}

		return true;
	};

	this.getLeg = function () {
		if (me.getItem(88)) {
			return me.getItem(88);
		}

		Pather.useWaypoint(4); // get leg
		Precast.doPrecast(true);
		Pather.moveToPreset(me.area, 1, 737, 8, 8);
		Pather.usePortal(38);
		Pather.moveTo(25048, 5177);
		Quest.collectItem(88, 268);
		Pickit.pickItems();
		Town.goToTown();

		return me.getItem(88);
	};

	this.getBook = function () {
		Town.move(NPC.Akara);
		let npc = getUnit(1, NPC.Akara);

		if (!npc || !npc.openMenu() || !Misc.useMenu(0x0D44)) {
			print("ÿc9SoloLevelingÿc0: Failed to buy tome");

			return false;
		}

		delay(500 + me.ping);
		let book = npc.getItem(518);

		if (book && Storage.Inventory.CanFit(book)) {
			try {
				print('ÿc9SoloLevelingÿc0: bought Tome of Town Portal');
				book.buy();
			} catch (e1) {
				print("ÿc9SoloLevelingÿc0: Failed to buy tome");

				return false;
			}
		} else {
			return false;
		}

		return true;
	};

	this.openPortal = function (portalID, ...classIDS) {
		if (!Town.openStash()) {
			print('ÿc9SoloLevelingÿc0: Failed to open stash. (openPortal)');
		}

		if (!Cubing.emptyCube()) {
			print('ÿc9SoloLevelingÿc0: Failed to empty cube. (openPortal)');
		}

		let cubingItem;

		for (let classID of classIDS) {
			cubingItem = me.getItem(classID);

			if (!cubingItem || !Storage.Cube.MoveTo(cubingItem)) {
				return false;
			}
		}

		while (!Cubing.openCube()) {
			delay(1 + me.ping * 2);
			Packet.flash(me.gid);
		}

		let cowPortal;
		let tick = getTickCount();

		while (getTickCount() - tick < 5000) {
			if (Cubing.openCube()) {
				transmute();
				delay(750 + me.ping);
				cowPortal = Pather.getPortal(portalID);

				if (cowPortal) {
					break;
				}
			}
		}

		me.cancel();

		return true;
	};

	if (me.gametype === 0 && !Misc.checkQuest(26, 0) || !Misc.checkQuest(40, 0) || !Misc.checkQuest(4, 0) || Misc.checkQuest(4, 10)) {
		return true;
	}

	Town.townTasks();
	print('ÿc9SoloLevelingÿc0: starting cows');
	me.overhead("cows");
	this.getLeg();
	this.getBook();
	this.openPortal(39, 88, 518);
	Town.doChores();
	Pather.usePortal(39);
	Precast.doPrecast(true);
	this.clearCowLevel();

	return true;
}