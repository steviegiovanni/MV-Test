var Butter = Butter || {};
Butter.MonsterSpawner = Butter.MonsterSpawner || {};

/*:
 * @param ---General---
 * @default
 *
 * @param SpawnOffsetX
 * @text Spawn Offset X
 * @parent ---General---
 * @type number
 * @min -1
 * @max 1
 * @default 0

 * @param SpawnOffsetY
 * @text Spawn Offset Y
 * @parent ---General---
 * @type number
 * @min -1
 * @max 1
 * @default 1
 */

Butter.MonsterSpawner.Monsters = [
	{ MapId: 3, EventId: 2, RespawnTimer: 3000 },
	{ MapId: 3, EventId: 3, RespawnTimer: 3000 }
]

// called in pre-copy of the event copier that copies the spawner
Game_Event.prototype.SetUpMonsterSpawnerEvent = function() {
	var ev = this.event();
	if (ev.note.match(/<(?:MONSTER SPAWNER):[ ](\d+)>/i)) {
		this.monsterSpawnerEvent = true;
		this.monsterSpawnerId = parseInt(RegExp.$1);
		this.monsterSpawnerSpawnTime = 0;
		this.monsterSpawnerSpawnedEventId = 0;
	}
}

Butter.MonsterSpawner.SpawnMonster = function(event) {
	if(!event.monsterSpawnerEvent || $gameParty.inBattle()) {
		return;
	}

	// get params
	var params = PluginManager.parameters("Butter_MonsterSpawner");
	var spawnOffsetX = params["SpawnOffsetX"];
	var spawnOffsetY = params["SpawnOffsetY"];

	// sanity check
	if((spawnOffsetX == 0) && (spawnOffsetY == 0)) {
		console.error("Can't spawn event with (0, 0) offset (same place as the spawner)");
		return;
	}

	// get spawn info
	var spawnInfo = Butter.MonsterSpawner.Monsters[event.monsterSpawnerId];
	if(!spawnInfo) {
		return;
	}

	var spawnedEventId = event.monsterSpawnerSpawnedEventId;
	if(spawnedEventId == 0) {
		// spawnedEventId == 0 means the spawner hasn't spawned anything, so we can spawn
		if(event.monsterSpawnerSpawnTime <= 0) {
			// only spawn if the respawn timer is fulfilled
			var spawnX = event.x + +spawnOffsetX;
			var spawnY = event.y + +spawnOffsetY;
			Yanfly.SpawnEventAt(spawnInfo.MapId, spawnInfo.EventId, spawnX, spawnY, false);
			event.monsterSpawnerSpawnedEventId = $gameMap.LastSpawnedEventID();
		}
		else
		{
			event.monsterSpawnerSpawnTime -= 1000 * 1 / Graphics._fpsMeter.fps;
		}
	} else {
		// the spawner had spawned an event in the past, check whether the spawned event is still active
		var spawnedEvent = $gameMap.event(spawnedEventId);
		if(spawnedEvent._pageIndex == -1) {
			// spawned event is gone, set the spawned event id back to 0
			event.monsterSpawnerSpawnedEventId = 0;
			event.monsterSpawnerSpawnTime = spawnInfo.RespawnTimer;
		}
	}
}
