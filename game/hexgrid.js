function HexGrid(rows, cols, tileSize, gridCenterX, gridCenterY) {
    this.rows = rows;
    this.cols = cols;
    this.gridCenterX = gridCenterX;
    this.gridCenterY = gridCenterY;
    this.tileSize = tileSize;
    this.hexTiles = [];
    
    this.construct = function() {
        for (var i = 0; i < this.rows; i++) {
        this.hexTiles[i] = [];
            for (var j = 0; j < this.cols; j++) {
                this.hexTiles[i][j] = 0;
            }
        }
    
        var height = this.tileSize * 2;
        var vertDis = height * (3 / 4);
        var horizDis = (Math.sqrt(3) / 2) * height;
        var offset = false;
        for (var col = 0; col < this.cols; col++) {
            for (var row = 0; row < this.rows; row++) {
                if (offset) {
                    this.hexTiles[row][col] = new HexTile(row, col, this.gridCenterX + (horizDis * row) + (horizDis * 0.5), this.gridCenterY + (vertDis * col), this.tileSize);
                } else {
                    this.hexTiles[row][col] = new HexTile(row, col, this.gridCenterX + (horizDis * row), this.gridCenterY + (vertDis * col), this.tileSize);
                }
                
            }
            offset = !offset;
        }
    }
    
    this.draw = function() {
        for (var i=0; i < this.hexTiles.length; i++) {
            for (var j=0; j < this.hexTiles[i].length; j++) {
                this.hexTiles[i][j].draw();
            }
        }
    }
}

function HexTile(gridx, gridy, truex, truey, size) {
    this.gridx = gridx;
    this.gridy = gridy;
    this.truex = truex;
    this.truey = truey;
    this.size = size;
    this.sprite = null;
    this.spriteHeight = size * 2;
    this.spriteWidth = this.spriteHeight * (Math.sqrt(3) / 2);
    this.draw = function() {
        this.sprite = game.add.sprite(this.truex, this.truey, 'hexagon');
        this.sprite.anchor.set(0.5);
        this.sprite.height = this.spriteHeight;
        this.sprite.width = this.spriteWidth;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickEvent, this);
        game.debug.text(gridx + ", " + gridy, this.truex-20, this.truey);
        //this.sprite.events.onInputOut.add(this.changeSprite2, this)
    }
    this.changeSprite = function() {
        this.sprite.loadTexture('hexagonRed');
    }
    this.clickEvent = function() {
        console.log("Event at :" + this.gridx + ", " + this.gridy);
        //console.log(oddr_to_cube(this.gridx, this.gridy));
        this.sprite.loadTexture('hexagonRed');
        for (var i=0; i < 6; i++) {
            var cubeCoOrd = oddr_to_cube(this.gridx, this.gridy);
            var direction = cube_directions[i];
            var resultCube = cube_getNeighborInDir(cubeCoOrd, direction);
            var offsetCoOrd = cube_to_oddr(resultCube);
            
            console.log("Direction " + direction.toArray() + ", ResultCubic: " + resultCube.toArray() + ", ResultOffset: " + offsetCoOrd);
            
            if  (validateGridRef(offsetCoOrd[0], offsetCoOrd[1])) {
                hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite();
            }
        }
    }
    /*this.changeSprite2 = function() {
        this.sprite.loadTexture('hexagon');
        for (var i=0; i < 6; i++) {
            var offsetCoOrd = cube_to_oddr(cube_add(oddr_to_cube(this.gridx, this.gridy), cube_directions[i]));
            console.log(offsetCoOrd);
        }
    }*/
    
}

function validateGridRef(x, y) {
    if  (hexGrid.hexTiles[x] !== void 0) {
        if (hexGrid.hexTiles[x][y] !== void 0) {
            return true;
        }
    }
    return false;
}

function oddr_to_cube(col, row) {
      x = col - (row - (row & 1)) / 2;
      z = row;
      y = -x-z;
      return new cube(x, y, z);
}

function cube_to_oddr(cube) {
      col = cube.x + (cube.z - (cube.z & 1)) / 2;
      row = cube.z;
      return [col, row];
}

var cube_directions = [
   new cube(+1, -1,  0), new cube(+1,  0, -1), new cube(0, +1, -1),
   new cube(-1, +1,  0), new cube(-1,  0, +1), new cube(0, -1, +1)
];

function cube(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.toArray = function() {
        return [this.x, this.y, this.z]
    }
}

function cube_getNeighborInDir(cubicCoOrd, cubicDirection){
    return cube_add(cubicCoOrd, cubicDirection);
}

function cube_add(firstCubic, secondCubic){
    x = firstCubic.x + secondCubic.x;
    y = firstCubic.y + secondCubic.y;
    z = firstCubic.z + secondCubic.z;
    
    return new cube(x, y, z);
}