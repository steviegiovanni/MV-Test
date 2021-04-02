var Butter = Butter || {};
Butter.Map = Butter.Map || {};


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

Butter.Map.SpawnMonster = function(interpreter, mapIdOfSpawned, eventIdOfSpawned) {
	// get params
	var params = PluginManager.parameters("Butter_Spawner");
	var spawnOffsetX = params["SpawnOffsetX"];
	var spawnOffsetY = params["SpawnOffsetY"];

	// sanity check
	if((spawnOffsetX == 0) && (spawnOffsetY == 0)) {
		console.error("Can't spawn event with (0, 0) offset (same place as the spawner)");
		return;
	}

	var spawnerEvent = $gameMap.event(interpreter._eventId);
	var mapId = $gameMap._mapId;

	// self variable id to store the spawned event id
	const spawnedEventIdVarId = 101;
	var spawnedEventId = interpreter.getSelfVariableValue(mapId, interpreter._eventId, spawnedEventIdVarId);

	if(spawnedEventId == 0) {
		// spawnedEventId == 0 means the spawner hasn't spawned anything, so we can spawn
		var spawnX = spawnerEvent.x + +spawnOffsetX;
		var spawnY = spawnerEvent.y + +spawnOffsetY;
		console.log(spawnX + ", " + spawnY);
		Yanfly.SpawnEventAt(mapIdOfSpawned, eventIdOfSpawned, spawnX, spawnY, false);
		interpreter.setSelfVariableValue(mapId, interpreter._eventId, spawnedEventIdVarId, $gameMap.LastSpawnedEventID());
	} else {
		// the spawner had spawned an event in the past, check whether the spawned event is still active
		var spawnedEvent = $gameMap.event(spawnedEventId);
		if(spawnedEvent._pageIndex == -1) {
			// spawned event is gone, set the spawned event id back to 0
			interpreter.setSelfVariableValue(mapId, interpreter._eventId, spawnedEventIdVarId, 0);
		}
	}
}

Butter.Map.SetMonsterEventSpawner = function(event, mapIdOfSpawned, eventIdOfSpawned, spawnDelay) {
	event.monsterSpawnerData = event.monsterSpawnerData || {};
	event.monsterSpawnerData.mapIdOfSpawned = mapIdOfSpawned;
	event.monsterSpawnerData.eventIdOfSpawned = eventIdOfSpawned;
	event.monsterSpawnerData.spawnDelay = spawnDelay;
}
