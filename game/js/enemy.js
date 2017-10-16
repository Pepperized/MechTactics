function EnemyMech(x, y) {
    this.spriteName = 'enemyMech';
    this.sprite = null;
    this.x = x;
    this.y = y;
    this.truex = hexGrid.hexTiles[x][y].truex;
    this.truey = hexGrid.hexTiles[x][y].truey;
    this.team = teams.enemy;
    this.health = 2;
    this.healthSprites = [];
    this.abilities = [];
    this.exhausted = false;
    this.routine = function () {
        EnemyMove(this);
    }
    this.clickEvent = function() {
        this.routine();
    }
    this.draw = function() {
        this.sprite = game.add.sprite(this.truex, this.truey, this.spriteName);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(MECHSCALE);
        this.drawHealth();
    }
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
    
    this.destroy = function() {
        this.sprite.destroy();
        for (i=0; i < this.healthSprites.length; i++) {
            this.healthSprites[i].destroy();
        }
        hexGrid.hexTiles[this.x][this.y].mech = null;
    }
    
    hexGrid.hexTiles[x][y].mech = this;
}

function EnemyMove(mech) {
    var direction = cube_directions[getRandomInt(0, 5)];
    var target = cube_getNeighborInDir(oddr_to_cube(mech.x, mech.y), direction);
    var offsetCoOrds = cube_to_oddr(target);
    var i = 0;
    //unwound recursion
    while (!validateGridRef(offsetCoOrds[0], offsetCoOrds[1]) && i < 30){
        direction = cube_directions[getRandomInt(0, 5)];
        target = cube_getNeighborInDir(oddr_to_cube(mech.x, mech.y), direction);
        offsetCoOrds = cube_to_oddr(target);
        i++;
    }
    if (!hexGrid.hexTiles[offsetCoOrds[0]][offsetCoOrds[1]].mech)
        mech.changePosition(offsetCoOrds[0], offsetCoOrds[1]);
}