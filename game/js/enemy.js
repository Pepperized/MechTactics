//array that holds all active enemies
var enemies = [];
//array that holds all active enemy spawns
var spawns = [];

//EnemyMech class takes, grid x and grid y
function EnemyMech(x, y) {
    //default value for the sprite key
    this.spriteName = 'enemyMech';
    //storage for the sprite
    this.sprite = null;
    //score 'bounty'
    this.score = 100;
    //grid x position
    this.x = x;
    //grid y position
    this.y = y;
    //pixel x location
    this.truex = hexGrid.hexTiles[x][y].truex;
    //pixel y location
    this.truey = hexGrid.hexTiles[x][y].truey;
    //team it belongs to
    this.team = teams.enemy;
    //range of weapons
    this.range = 3;
    //health of enemy
    this.health = 2;
    //array to store health tiles
    this.healthSprites = [];
    //bool if action is taken
    this.exhausted = false;
    //called each enemy turn
    this.routine = function () {
        //move randomly to a valid adjacent tile
        EnemyMove(this);
        //shoot a player in range
        EnemyShoot(this);
    }
    this.clickEvent = function() {
        
    }
    //called when sprite is first drawn
    this.draw = function() {
        this.sprite = game.add.sprite(this.truex, this.truey, this.spriteName);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(MECHSCALE);
        this.drawHealth();
    }
    //draws the health tiles
    this.drawHealth = function() {
        for (i=0; i < this.healthSprites.length; i++) {
            this.healthSprites[i].destroy();
        }
        this.healthSprites = [];
        for (i=0; i < this.health; i++) {
            var spriteWidth = 8;
            var healthSprite = game.add.sprite(this.truex + (spriteWidth * i) - (this.health * (spriteWidth / 2)) + spriteWidth / 2, this.truey - 30, 'health');
            healthSprite.anchor.setTo(0.5);
            healthSprite.scale.setTo(HEALTHSCALE);
            this.healthSprites.push(healthSprite);
        }
    }
    //function to move the unit to a position
    this.changePosition = function(x, y) {
        var oldx = this.x;
        var oldy = this.y;
        this.x = x;
        this.y = y;
        this.truex = hexGrid.hexTiles[x][y].truex;
        this.truey = hexGrid.hexTiles[x][y].truey;
        this.sprite.x = this.truex;
        this.sprite.y = this.truey;
        hexGrid.hexTiles[x][y].mech = this;
        hexGrid.hexTiles[oldx][oldy].mech = null;
        this.drawHealth();
    }
    ///called when mech is destroyed
    this.destroy = function() {
        score.addScore(this.score);
        this.sprite.destroy();
        for (i=0; i < this.healthSprites.length; i++) {
            this.healthSprites[i].destroy();
        }
        hexGrid.hexTiles[this.x][this.y].mech = null;
        remove(enemies, this);
    }
    //assigns itself to the mech field of the tile it is on
    hexGrid.hexTiles[x][y].mech = this;
    //adds itself to the active enemy array
    enemies.push(this);
}
//Enemy movement function
function EnemyMove(mech) {
    //get a random direction
    var direction = cube_directions[getRandomInt(0, 5)];
    //get the target tile in cubic coords, eg. x, y, z
    var target = cube_getNeighborInDir(oddr_to_cube(mech.x, mech.y), direction);
    //get the target coords in offset, eg. x, y
    var offsetCoOrds = cube_to_oddr(target);
    //unwound the recursion
    var i = 0;
    //unwound recursion to 30 iterations max, finds a valid tile
    while (!validateGridRef(offsetCoOrds[0], offsetCoOrds[1]) && i < 30){
        //find a random adjacent tile
        direction = cube_directions[getRandomInt(0, 5)];
        target = cube_getNeighborInDir(oddr_to_cube(mech.x, mech.y), direction);
        //sets offset coords to the new target
        offsetCoOrds = cube_to_oddr(target);
        i++;
    }
    //if the target location doesn't already contain a mech
    if (!hexGrid.hexTiles[offsetCoOrds[0]][offsetCoOrds[1]].mech)
        //change the location of the mech to the target location
        mech.changePosition(offsetCoOrds[0], offsetCoOrds[1]);
}

//Enemy shooting function
function EnemyShoot(mech) {
    var targetMech = FindPlayerInRange(mech, mech.range);
    if(targetMech !== null) {
        targetMech.health--;
        targetMech.drawHealth();
        projectileEffect(mech.x, mech.y, targetMech.x, targetMech.y, 'enemyBullet');
        if (targetMech.health <= 0) {
            deleteAfterAnim.push(targetMech);
        }
        
    }
}

function FindPlayerInRange(mech, range) {
    var targetMech = null;
    
    for (var hexX=0; hexX < hexGrid.hexTiles.length; hexX++) {
        for (var hexY=0; hexY < hexGrid.hexTiles[hexX].length; hexY++) {
            if (hexGrid.hexTiles[hexX][hexY].mech) {
                var targetMech = hexGrid.hexTiles[hexX][hexY].mech;
                if (targetMech.team === teams.player) {
                    var cubicEnemy = oddr_to_cube(mech.x, mech.y);
                    var cubicPlayer = oddr_to_cube(hexX, hexY);
                    if (cube_distance(cubicEnemy, cubicPlayer) <= range) {
                        return targetMech;
                    }
                }
            }
        }
    }
    return null;
}

function constructTank(x, y) {
    var enemyMech = new EnemyMech(x, y);
    enemyMech.draw();
}

function EnemySpawn(x, y, turns) {
    this.x = x;
    this.y = y;
    this.spawnWarning = new SpawnWarning(x, y, turns);
    this.turns = turns;
    this.mechConstructor = constructTank;
    this.endTurnEvent = function() {
        this.turns -= 1;
        this.spawnWarning.endTurnEvent();
        if (this.turns === 0) {
            this.mechConstructor(this.x, this.y);
            this.spawnWarning.destroy();
            remove(spawns, this);
        }
    }
    
    hexGrid.hexTiles[this.x][this.y].mech = this;
    spawns.push(this);
}

function createRandomSpawn() {
    var coOrd = findRandomEmptyTile();
    var x = coOrd[0];
    var y = coOrd[1];
    
    new EnemySpawn(x, y, 3);
}