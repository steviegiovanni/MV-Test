var Butter = Butter || {};
Butter.OnMapBattle = Butter.OnMapBattle || {};

Butter.OnMapBattle.StartBattle = function() {
	console.log("starting battle");
	BattleManager.playBattleBgm();
	BattleManager.startBattle();
}

