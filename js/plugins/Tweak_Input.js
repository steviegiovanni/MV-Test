var Tweak = Tweak || {};

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

Tweak.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function() {
    Tweak.Scene_Map_updateScene.call(this);

    if(Input.isTriggered('special')){
        $gameScreen.showPicture(1,'crosshair',1,0,0,50,50,255,0);
    }

};