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
	this.FindPath({x: 0, y: 0}, {x: 2, y: 2});
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
	// initialize grid
	for(var i = 0; i <= this.end.x - this.start.x; ++i) {
		for(var j = 0; j <= this.end.y - this.start.y; ++j) {
			this.grid[i][j].f = 0;
			this.grid[i][j].g = 0;
			this.grid[i][j].h = 0;
			this.grid[i][j].parent = null;
		}
	}

	var openList = [];
	var closedList = [];
	var fromLocal = {x: from.x - this.start.x, y: from.y - this.start.y};
	var toLocal = {x: to.x - this.start.x, y: to.y - this.start.y};
	openList.push(fromLocal);

	while(openList.length > 0) {
		// grab the lowest f(x) to process next
		var minimumCostIndex = 0;
		for(var i = 0; i < openList.length; ++i) {
			if(this.grid[openList[i].x][openList[i].y].f < this.grid[openList[minimumCostIndex].x][openList[minimumCostIndex].y].f) {
				minimumCostIndex = i;
			}
		}
		var currentNode = openList[minimumCostIndex];

		// end case --  result has been found, return traced path
		if((currentNode.x == toLocal.x) && (currentNode.y == toLocal.y)) {
			var current = currentNode;
			var ret = [];
			while(this.grid[current.x][current.y].parent != null) {
				ret.push({x: current.x + this.start.x, y: current.y + this.start.y});
				current = this.grid[current.x][current.y].parent;
			}
			console.log(ret);
			return ret.reverse;
		}

		// normal case -- move currentNode from open to closed, process each of its neighbors
		openList.splice(minimumCostIndex, 1);
		closedList.push(currentNode);
		var neighbors = this.Neighbors({x: currentNode.x + this.start.x, y: currentNode.y + this.start.y });
		//console.log(neighbors);

		for(var i = 0; i < neighbors.length; ++i) {
			var neighbor = neighbors[i];
			var neighborLocal = {x: neighbor.x - this.start.x, y: neighbor.y - this.start.y};
			if(closedList.findIndex(element => element.x == neighborLocal.x && element.y == neighborLocal.y) != -1) {
				continue;
			}

			// g score is the shortest distance from start to current node, we need to check if
			// the path we have arrived at this neighbor is the shortest one we have seen yet
			var gScore = this.grid[currentNode.x][currentNode.y].g + 1;
			var gScoreIsBest = false;
			var indexInOpenList = openList.findIndex(element => element.x == neighborLocal.x && element.y == neighborLocal.y);
			if(indexInOpenList == -1) {
				gScoreIsBest = true;
				//console.log(this.grid);
				this.grid[neighborLocal.x][neighborLocal.y].h = this.Heuristic(neighborLocal, toLocal);
				openList.push(neighbor);
			}
			else if (this.grid[neighborLocal.x][neighborLocal.y].g > gScore){
				gScoreIsBest = true;
			}

			if(gScoreIsBest) {
				this.grid[neighborLocal.x][neighborLocal.y].parent = currentNode;
				this.grid[neighborLocal.x][neighborLocal.y].g = gScore;
				this.grid[neighborLocal.x][neighborLocal.y].f = this.grid[neighborLocal.x][neighborLocal.y].g + this.grid[neighborLocal.x][neighborLocal.y].h;
			}
		}
		//console.log(openList);
	}

	// no result was found -- empty array signifies failure to find path
	console.log("no path found");
	return [];
}


//Butter.Pathfinding.InitializeGrid = function(grid) {
	/*var xLength = grid.end.x - grid.start.x;
	var yLength = grid.end.y - grid.start.y;
	for(var i = 0; i < xLength; ++i) {
		for(var j = 0; j < yLength; ++j) {
			var node = grid[i][j];
			node.parent = null;
		}
	}
	console.log(grid);*/
//}