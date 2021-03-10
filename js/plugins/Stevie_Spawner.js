function Spawner(event){
	var mapId = $gameMap._mapId;
	var spawnedEventId = event.getSelfVariableValue(mapId, event._eventId, 101);
	if(spawnedEventId == 0){
		var lastSpawnedEventId = $gameMap.LastSpawnedEventID();
		Yanfly.SpawnEventAt(3, 1, 2, 2);
		event.setSelfVariableValue(mapId, event._eventId, 101, lastSpawnedEventId + 1);
	}else{
		console.log(spawnedEventId);
		var spawnedEvent = $gameMap.event(spawnedEventId);
		console.log("reached1");
		if(spawnedEvent === null){
			console.log("reached2");
			event.setSelfVariableValue(mapId, event._eventId, 101, 0);
		}
	}
}