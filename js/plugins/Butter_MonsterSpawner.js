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

Game_Event.prototype.SetUpMonsterSpawnerEvent = function() {
	var ev = this.event();
	if (ev.note.match(/<(?:MONSTER SPAWNER):[ ](\d+),[ ](\d+)>/i)) {
		this.monsterSpawnerEvent = true;
		this.monsterSpawnerMapId = parseInt(RegExp.$1);
		this.monsterSpawnerEventId = parseInt(RegExp.$2);
		this.monsterSpawnerTillSpawned = 0.0;
		this.monsterSpawnerSpawnedEventId = 0;
	}
}

Butter.MonsterSpawner.SpawnMonster = function(event, mapIdOfSpawned, eventIdOfSpawned) {
	if(!event.monsterSpawnerEvent) {
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

	var spawnedEventId = event.monsterSpawnerSpawnedEventId;
	if(spawnedEventId == 0) {
		// spawnedEventId == 0 means the spawner hasn't spawned anything, so we can spawn
		var spawnX = event.x + +spawnOffsetX;
		var spawnY = event.y + +spawnOffsetY;
		Yanfly.SpawnEventAt(mapIdOfSpawned, eventIdOfSpawned, spawnX, spawnY, false);
		event.monsterSpawnerSpawnedEventId = $gameMap.LastSpawnedEventID();
	} else {
		// the spawner had spawned an event in the past, check whether the spawned event is still active
		var spawnedEvent = $gameMap.event(spawnedEventId);
		if(spawnedEvent._pageIndex == -1) {
			// spawned event is gone, set the spawned event id back to 0
			event.monsterSpawnerSpawnedEventId = 0;
		}
	}
}
