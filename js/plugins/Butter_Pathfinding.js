var Butter = Butter || {};
Butter.Pathfinding = Butter.Pathfinding || {};

Butter.Pathfinding = function(start, end) {
	this.start = start;
	this.end = end;
	this.grid = [];
	for(var i = 0; i <= this.end.x - this.start.x; ++i) {
		this.grid[i] = [];
		for(var j = 0; j <= this.end.y - this.start.y; ++j) {
			this.grid[i][j] = {};
		}
	}
	//var test = this.FindPath({x: 15, y: 9}, {x: 0, y: 0});
	//console.log(test);
}

Butter.Pathfinding.prototype.Heuristic = function(pos0, pos1) {
	var d1 = Math.abs (pos1.x - pos0.x);
    var d2 = Math.abs (pos1.y - pos0.y);
    return d1 + d2;
}

Butter.Pathfinding.prototype.IsInGrid = function(pos) {
	return (pos.x >= this.start.x)
			&& (pos.x <= this.end.x)
			&& (pos.y >= this.start.y)
			&& (pos.y <= this.end.y);
}

Butter.Pathfinding.prototype.Neighbors = function(pos) {
	var ret = [];
	var left = {x: pos.x - 1, y: pos.y};
	var right = {x: pos.x + 1, y: pos.y};
	var up = {x: pos.x, y: pos.y - 1};
	var down = {x: pos.x, y: pos.y + 1};
	if(this.IsInGrid(left) && $gameMap.isPassable(left.x, left.y, 4)) {
		ret.push(left);
	}
	if(this.IsInGrid(right) && $gameMap.isPassable(right.x, right.y, 6)) {
		ret.push(right);
	}
	if(this.IsInGrid(up) && $gameMap.isPassable(up.x, up.y, 8)) {
		ret.push(up);
	}
	if(this.IsInGrid(down) && $gameMap.isPassable(down.x, down.y, 2)) {
		ret.push(down);
	}
	return ret;
}

Butter.Pathfinding.prototype.FindPath = function(from, to) {
	// convert global coordinate to local coordinate
	var fromLocal = {x: from.x - this.start.x, y: from.y - this.start.y};
	var toLocal = {x: to.x - this.start.x, y: to.y - this.start.y};

	// check valid
	if(!this.IsInGrid(fromLocal) || !this.IsInGrid(toLocal)) {
		return [];
	}

	// initialize grid
	for(var i = 0; i <= this.end.x - this.start.x; ++i) {
		for(var j = 0; j <= this.end.y - this.start.y; ++j) {
			this.grid[i][j].g = Infinity;
			this.grid[i][j].h = this.Heuristic({x: i, y: j}, toLocal);
			this.grid[i][j].parent = null;
		}
	}

	// push starting point to openList
	var openList = [];
	openList.push(fromLocal);
	this.grid[fromLocal.x][fromLocal.y].g = 0;

	while(openList.length > 0) {
		// grab the node with the lowest cost from open list
		var minimumCostIndex = 0;
		for(var i = 0; i < openList.length; ++i) {
			if(this.grid[openList[i].x][openList[i].y].f < this.grid[openList[minimumCostIndex].x][openList[minimumCostIndex].y].f) {
				minimumCostIndex = i;
			}
		}
		var currentNode = openList[minimumCostIndex];

		// if this node is the goal then return the result
		if((currentNode.x == toLocal.x) && (currentNode.y == toLocal.y)) {
			var current = currentNode;
			var ret = [];
			while(this.grid[current.x][current.y].parent != null) {
				ret.push({x: current.x + this.start.x, y: current.y + this.start.y});
				current = this.grid[current.x][current.y].parent;
			}
			return ret.reverse();
		}

		// current node is not the goal, remove it from the openList
		openList.splice(minimumCostIndex, 1);

		// process all of its neighbors
		var neighbors = this.Neighbors({x: currentNode.x + this.start.x, y: currentNode.y + this.start.y });
		for(var i = 0; i < neighbors.length; ++i) {
			var neighbor = neighbors[i];
			var neighborLocal = {x: neighbor.x - this.start.x, y: neighbor.y - this.start.y};

			// gScore is the best score from the previous node to this neighbor
			var gScore = this.grid[currentNode.x][currentNode.y].g + 1;

			// we might have visited this neighbor before from another route, compare with the recorded gScore
			// if this is the first time we visit this neighbor, the recorded gscore would have been Infinity
			// if we have a better score, we update the parent, the gscore, and the gscore + heuristic score
			if(gScore < this.grid[neighborLocal.x][neighborLocal.y].g) {
				this.grid[neighborLocal.x][neighborLocal.y].parent = currentNode;
				this.grid[neighborLocal.x][neighborLocal.y].g = gScore;
				this.grid[neighborLocal.x][neighborLocal.y].f = this.grid[neighborLocal.x][neighborLocal.y].g + this.grid[neighborLocal.x][neighborLocal.y].h;

				// only add it to the open list if there's not already one
				var indexInOpenList = openList.findIndex(element => element.x == neighborLocal.x && element.y == neighborLocal.y);
				if(indexInOpenList == -1) {
					openList.push(neighbor);
				}
			}
		}
	}

	// no result was found -- empty array signifies failure to find path
	return [];
}
