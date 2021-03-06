Input.gamepadMapper = {
    0: 'ok',        // A
    1: 'cancel',    // B
    2: 'melee',      // X
    3: 'shift',     // Y
    4: 'pageup',    // LB
    5: 'pagedown',  // RB
    6: 'special',    // LT
    7: 'ranged',  // RT
    //8: 'menu', // Back
    9: 'menu',  // Start
    //10: 'menu', //L3
    //11: 'menu', //R3
    12: 'up',       // D-pad up
    13: 'down',     // D-pad down
    14: 'left',     // D-pad left
    15: 'right',    // D-pad right
};

Scene_Map.prototype.updateButtonEvents = function() {
    for (var key in Yanfly.Param.BCEList) {
      var eventId = Yanfly.Param.BCEList[key];
      if (eventId <= 0) continue;
      if (!Input.isRepeated(key)) continue;
      $gameTemp.reserveCommonEvent(eventId);
      break;
    }

    if(Input.isTriggered('attack'))
        $gameTemp.reserveCommonEvent(2);
    //$game
};