/*:
@author Stevie Giovanni
@plugindesc Tweak for YEP_SmartJump to work on pixel based movement

@help
This is some help text
*/

Game_CharacterBase.prototype.isSmartJumpValid = function(x, y) {
    if (this.isThrough()) return true;
    var events = $gameMap.eventsXyNt(x, y);
    var length = events.length;
    var regionId = $gameMap.regionId(x, y);
    if (Yanfly.Param.JumpEqualRegion.contains(regionId)) {
      if (this.regionId() !== regionId) return false;
    }
    for (var i = 0; i < length; ++i) {
      var ev = events[i];
      if (!ev) continue;
      if (ev.isThrough()) continue;
      if (ev.isNormalPriority()) return false;
      if (ev.isSmartJumpBlocked()) return false;
    }
    var regionId = $gameMap.regionId(x, y);
    if (regionId > 0 && Yanfly.Param.JumpEqualRegion.contains(regionId)) {
      if (this.regionId() === regionId) return true;
    }
    console.log(x+","+y+" is passable: "+$gameMap.isPassable(x, y, this._direction));
    return $gameMap.isPassable(Math.round(x), Math.round(y), this._direction);
};