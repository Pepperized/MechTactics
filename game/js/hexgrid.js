var selected_mech = null;
var selected_ability = null;
var grid_state = {select: 0,
                  target: 1};
var current_grid_state = grid_state.select;

//HexGrid Object
function HexGrid(rows, cols, tileSize, gridCenterX, gridCenterY) {
    //number of rows
    this.rows = rows;
    //number of collumns
    this.cols = cols;
    //pixel location of center
    this.gridCenterX = gridCenterX;
    this.gridCenterY = gridCenterY;
    //size of each hexagon
    this.tileSize = tileSize;
    //container for the hextiles
    this.hexTiles = [];
    
    //populates the hexTiles
    this.construct = function() {
        for (var i = 0; i < this.rows; i++) {
        //first contruct a 2d array
        this.hexTiles[i] = [];
            for (var j = 0; j < this.cols; j++) {
                //give it 0 as default value
                this.hexTiles[i][j] = 0;
            }
        }
        //height calculation
        var height = this.tileSize * 2;
        //verticle distance between hexes
        var vertDis = height * (3 / 4);
        //horizontal distance between hexes
        var horizDis = (Math.sqrt(3) / 2) * height;
        //toggle variable for whether it is on a row that needs to be offset, in order to align with the previous row
        var offset = false;
        for (var col = 0; col < this.cols; col++) {
            for (var row = 0; row < this.rows; row++) {
                //populate the array
                if (offset) {
                    this.hexTiles[row][col] = new HexTile(row, col, this.gridCenterX + (horizDis * row) + (horizDis * 0.5), this.gridCenterY + (vertDis * col), this.tileSize);
                } else {
                    this.hexTiles[row][col] = new HexTile(row, col, this.gridCenterX + (horizDis * row), this.gridCenterY + (vertDis * col), this.tileSize);
                }
                
            }
            //toggle the offset each row
            offset = !offset;
        }
    }
    //draw all the tiles
    this.draw = function() {
        for (var i=0; i < this.hexTiles.length; i++) {
            for (var j=0; j < this.hexTiles[i].length; j++) {
                this.hexTiles[i][j].draw();
            }
        }
    }
}

//HexTile object
function HexTile(gridx, gridy, truex, truey, size) {
    //where it is on grid
    this.gridx = gridx;
    this.gridy = gridy;
    //where it is in pixels
    this.truex = truex;
    this.truey = truey;
    //size of sprite
    this.size = size;
    //container for sprite
    this.sprite = null;
    //height of itself
    this.spriteHeight = size * 2;
    //width of itself
    this.spriteWidth = this.spriteHeight * (Math.sqrt(3) / 2);
    //mech on object
    this.mech = null;
    //draw func
    this.draw = function() {
        this.sprite = game.add.sprite(this.truex, this.truey, 'hexagon');
        this.sprite.anchor.set(0.5);
        this.sprite.height = this.spriteHeight;
        this.sprite.width = this.spriteWidth;
        //enable input
        this.sprite.inputEnabled = true;
        //add clickEvent to click event
        this.sprite.events.onInputDown.add(this.clickEvent, this);
    }
    //changes the sprite
    this.changeSprite = function(key) {
        this.sprite.loadTexture(key);
    }
    //when clicked
    this.clickEvent = function() {
        //if we are selecting a mech
        if (current_grid_state === grid_state.select) {
            //if there is a mech on this tile
            if (this.mech) {
                //and that mech is a player mech
                if (this.mech.team === teams.player) {
                    //make the selected_mech the mech on this tile
                    selected_mech = this.mech;
                    //tell the game we have selected a mech
                    current_grid_state = grid_state.target;
                    //run the clickEvent of that mech, to show abilities
                    this.mech.clickEvent();
                }
            }
        //if we have already selected a mech
        } else if (current_grid_state === grid_state.target) {
            //if the selected ability hasn't been used
            if (!selected_ability.used) {
                //use that ability with the click location as the TARGET
                selected_ability.effect(this.gridx, this.gridy);
            } else {
                //if the ability has been used, cancel targeting
                AfterTargeting();
                console.log("Ability already used this turn.");
            }
        }
    }   
}

//check if the given grid location exists
function validateGridRef(x, y) {
    if  (hexGrid.hexTiles[x] !== void 0) {
        if (hexGrid.hexTiles[x][y] !== void 0) {
            return true;
        }
    }
    return false;
}

//function found online, used for some other algorithms found online, converts offset coordinates to cubic coordinates
function oddr_to_cube(col, row) {
      x = col - (row - (row & 1)) / 2;
      z = row;
      y = -x-z;
      return new cube(x, y, z);
}
//found online, converts cubic coordinates to offset coordinates
function cube_to_oddr(cube) {
      col = cube.x + (cube.z - (cube.z & 1)) / 2;
      row = cube.z;
      return [col, row];
}

//an array of all possible directions in cubic coordinates
var cube_directions = [
   new cube(+1, -1,  0), new cube(+1,  0, -1), new cube(0, +1, -1),
   new cube(-1, +1,  0), new cube(-1,  0, +1), new cube(0, -1, +1)
];

//a basic wrapper for cubic coordinates
function cube(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.toArray = function() {
        return [this.x, this.y, this.z]
    }
}

//get an adjacent tile in the given direction
function cube_getNeighborInDir(cubicCoOrd, cubicDirection){
    return cube_add(cubicCoOrd, cubicDirection);
}

//algoritm found online, adds cubic coordinates together
function cube_add(firstCubic, secondCubic){
    x = firstCubic.x + secondCubic.x;
    y = firstCubic.y + secondCubic.y;
    z = firstCubic.z + secondCubic.z;
    
    return new cube(x, y, z);
}

//algoritm found online, finds distance between cubic coordinates
function cube_distance(a, b) {
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
}


//cleanup function for targeting
function AfterTargeting() {
    //we no longer have a selected mech
    current_grid_state = grid_state.select;
    //makes all hexes white
    ResetHexes();
    for (i=0; i < selected_mech.abilities.length; i++) {
        //destroys the sprites of abilities
        selected_mech.abilities[i].sprite.destroy();
    }
    //destroys the sprite of the cancel gui element
    cancelCard.sprite.destroy();
}

//makes all hexes white
function ResetHexes() {
    for (i=0; i < hexGrid.hexTiles.length; i++) {
        for (j=0;j < hexGrid.hexTiles[i].length; j++){
            hexGrid.hexTiles[i][j].changeSprite('hexagon');
        }
    }
}

//finds a random empty tile
function findRandomEmptyTile() {
    //get a random tile
    var x = getRandomInt(1, hexGrid.rows);
    var y = getRandomInt(1, hexGrid.cols);
    //if it's empty, return it
    if(!hexGrid.hexTiles[x][y].mech) return [x, y];
    //otherwise try again
    else return findRandomEmptyTile();
}