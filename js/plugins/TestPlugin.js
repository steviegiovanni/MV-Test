/*:
@author Stevie Giovanni
@plugindesc My test plugin

@param Parameter Name
@type Text
@default Default Value

@help
This is some help text
*/

/**
   * Direction
   * Utility for managing MV's directions
   */
  function Direction() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    Direction.DOWN_LEFT = 1;
    Direction.DOWN = 2;
    Direction.DOWN_RIGHT = 3;
    Direction.LEFT = 4;
    Direction.RIGHT = 6;
    Direction.UP_LEFT = 7;
    Direction.UP = 8;
    Direction.UP_RIGHT = 9;

    Direction.isUp = function( d ) {
      return d >= 7;
    };

    Direction.isRight = function( d ) {
      return d % 3 == 0;
    };

    Direction.isDown = function( d ) {
      return d <= 3;
    };

    Direction.isLeft = function( d ) {
      return ( d + 2 ) % 3 == 0;
    };

    Direction.fromVector = function( vx, vy ) {
      if ( vx && vy ) {
        if ( vy < 0 ) {
          if ( vx < 0 ) {
            return Direction.UP_LEFT;
          } else {
            return Direction.UP_RIGHT;
          }
        } else {
          if ( vx < 0 ) {
            return Direction.DOWN_LEFT;
          } else {
            return Direction.DOWN_RIGHT;
          }
        }
      } else if ( vx < 0 ) {
        return Direction.LEFT;
      } else if ( vx > 0 ) {
        return Direction.RIGHT;
      } else if ( vy < 0 ) {
        return Direction.UP;
      }
      return Direction.DOWN;
    };

    Direction.normalize = function( vx, vy, length ) {
      length = length || Math.sqrt( vx * vx + vy * vy );
      return { x: vx / length, y: vy / length, l: length };
    };

    Direction.normalizeSquare = function( vx, vy, length ) {
      var angle = Math.atan2( vy, vx );
      var cos = Math.cos( angle );
      var sin = Math.sin( angle );
      if ( !length ) {
        var absCos = Math.abs( cos );
        var absSin = Math.abs( sin );
        if ( absSin <= absCos ) {
          length = 1 / absCos;
        } else {
          length = 1 / absSin;
        }
      }
      return { x: vx * length, y: vy * length, l: length };
    };

  } )();

(function TestFunction(){
	var params = PluginManager.parameters("TestPlugin");
	var text = params["Parameter Name"];

	console.log(text);
})();

function Test2(){
	console.log("this is a test");
};

Game_Player.prototype.getInputDirection = function() {
    return Input.dir8;
};

//Game_CharacterBase.prototype.canPass = function(x, y, d) {
	/*var vy = Direction.isUp( d ) ? -1 : ( Direction.isDown( d ) ? 1 : 0 );
    var vx = Direction.isLeft( d ) ? -1 : ( Direction.isRight( d ) ? 1 : 0 );
    var length = Math.sqrt( vx * vx + vy * vy );
  	vx /= length;
  	vy /= length;
  	move = { x: vx * 0.7, y: vy * 0.7};

  	var x2;
  	var y2;
  	if(move.x < 0){
  		if(x+move.x - Math.ceil(x+move.x) <= -0.5){
  			x2 = $gameMap.roundX(Math.floor(x+move.x));
  		}else{
  			x2 = $gameMap.roundX(Math.ceil(x+move.x));
  		}
  	}else{
  		if(x+move.x - Math.floor(x+move.x) >= 0.5){
  			x2 = $gameMap.roundX(Math.ceil(x+move.x));
  		}else{
  			x2 = $gameMap.roundX(Math.floor(x+move.x));
  		}
  	}

  	if(move.y < 0){
  		if(y+move.y - Math.ceil(y+move.y) <= -0.5){
  			y2 = $gameMap.roundY(Math.floor(y+move.y));
  		}else{
  			y2 = $gameMap.roundY(Math.ceil(y+move.y));
  		}
  	}else{
  		if(y+move.y - Math.floor(y+move.y) >= 0.5){
  			y2 = $gameMap.roundY(Math.ceil(y+move.y));
  		}else{
  			y2 = $gameMap.roundY(Math.floor(y+move.y));
  		}
  	}

    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }*/
    //console.log("dir"+Direction.fromVector(vx,0));
    //console.log("is map passable?"+x1+","+y1);
    /*if (!this.isMapPassable(x1, y1, Direction.fromVector(vx,0))
    	|| !this.isMapPassable(x1, y1, Direction.fromVector(0,vy))) {
        return false;
    }*/
    /*if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
    }*/
   // return true;
//};

Game_CharacterBase.prototype.canBeMoved = function(x,y,move){
	console.log("direction: "+Direction.fromVector(move.x,move.y));
	var x2 = $gameMap.roundXWithDirection(x, Direction.fromVector(move.x,move.y));
    var y2 = $gameMap.roundYWithDirection(y, Direction.fromVector(move.x,move.y));
    console.log(x+">"+x2+","+y+">"+y2);
    if (!$gameMap.isValid(x2, y2)) {
    	console.log("gamemap invalid");
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }
    //if (!this.isMapPassable(x, y, d)) {
    //    return false;
    //}
    console.log("canPass reached");
    if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
    }
    return true;
}

Game_CharacterBase.prototype.moveStraight = function(d) {
	var vy = Direction.isUp( d ) ? -1 : ( Direction.isDown( d ) ? 1 : 0 );
    var vx = Direction.isLeft( d ) ? -1 : ( Direction.isRight( d ) ? 1 : 0 );
    var length = Math.sqrt( vx * vx + vy * vy );
  	vx /= length;
  	vy /= length;
  	move = { x: vx * 0.2, y: vy * 0.2};
  	//this.setMovementSuccess(true);
    this.setMovementSuccess(this.canBeMoved(this._x, this._y,move));
    if (this.isMovementSucceeded()) {
        this.setDirection(d);
        this._x = $gameMap.roundX( this._x + move.x );
		this._y = $gameMap.roundY( this._y + move.y );
		this._realX = this._x - move.x;
		this._realY = this._y - move.y;
        this.increaseSteps();
    } else {
        this.setDirection(d);
        this.checkEventTriggerTouchFront(d);
    }
};

/*Game_Map.prototype.xWithDirection = function(x, d) {
    return x + ((d === 6) || (d === 9) || (d === 3)? 1 : (d === 4) || (d === 7) || (d === 1) ? -1 : 0);
};

Game_Map.prototype.yWithDirection = function(y, d) {
    return y + ((d === 2) || (d === 1) || (d === 3) ? 1 : (d === 8) || (d === 7) || (d === 9) ? -1 : 0);
};

Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + ((d === 6) || (d === 9) || (d === 3)? 1 : (d === 4) || (d === 7) || (d === 1) ? -1 : 0));
};

Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + ((d === 2) || (d === 1) || (d === 3) ? 1 : (d === 8) || (d === 7) || (d === 9) ? -1 : 0));
};*/

var Game_CharacterBase_isMoving = Game_CharacterBase.prototype.isMoving;
      Game_CharacterBase.prototype.isMoving = function() {
        return Game_CharacterBase_isMoving.call( this ) || this._isMoving;
      };


Game_Player.prototype.update = function( sceneActive ) {
        var lastScrolledX = this.scrolledX();
        var lastScrolledY = this.scrolledY();
        var wasMoving = this._wasMoving;
        this.updateDashing();
        if ( sceneActive ) {
          this.moveByInput();
        }
        Game_Character.prototype.update.call( this );
        this.updateScroll( lastScrolledX, lastScrolledY );
        this.updateVehicle();
        if ( !this._isMoving ) {
          this.updateNonmoving( wasMoving );
        }
        this._followers.update();
      };

/*var Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
//this._x++;
//this._y++;

Game_CharacterBase_update.call( this );
};*/