//scale of the mech sprites
var MECHSCALE = 1.5;
//scale of the ability cards
var CARDSCALE = 0.25;
//scale of the health tiles
var HEALTHSCALE = 2;
//the cancel action card
var cancelCard = new CancelCard();
//teams enum
var teams = {player: 0,
            enemy: 1};
//player mech array
var mechs = [];

//player mech object
function Mech(x, y) {
    //name of sprite for mech
    this.spriteName = 'missileMech';
    this.sprite = null;
    //the value of the mech in score, not used
    this.score = 100;
    //grid x postion
    this.x = x;
    //and y
    this.y = y;
    //x positon in pixels
    this.truex = hexGrid.hexTiles[x][y].truex;
    //and y
    this.truey = hexGrid.hexTiles[x][y].truey;
    //team that this mech belongs to
    this.team = teams.player;
    //amount of health the mech has
    this.health = 3;
    //array for storing the sprites for health
    this.healthSprites = [];
    //array for storing abilities
    this.abilities = [];
    //currently unused
    this.exhausted = false;
    //draw function
    this.draw = function() {
        //adds the sprite and stores it
        this.sprite = game.add.sprite(this.truex, this.truey, this.spriteName);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(MECHSCALE);
        //draws the health sprites
        this.drawHealth();
    }
    //on clicked
    this.clickEvent = function () {
            //draw the ability cards on screen
            for (i=0; i < this.abilities.length; i++){
                this.abilities[i].draw(i);
            }
            cancelCard.draw(this.abilities.length);
        
    }
    //draw health function
    this.drawHealth = function() {
        //remove all previous sprites in the array
        for (i=0; i < this.healthSprites.length; i++) {
            this.healthSprites[i].destroy();
        }
        //sets the array to a new array, for safety
        this.healthSprites = [];
        //for each health point
        for (i=0; i < this.health; i++) {
            //width between health sprites
            var spriteWidth = 8;
            //aligns them top center of mech
            var healthSprite = game.add.sprite(this.truex + (spriteWidth * i) - (this.health * (spriteWidth / 2)) + spriteWidth / 2, this.truey - 30, 'health');
            healthSprite.anchor.setTo(0.5);
            healthSprite.scale.setTo(HEALTHSCALE);
            //adds the sprite to the health sprites array
            this.healthSprites.push(healthSprite);
        }
    }
    
    //changes the postion to the specified grid coordinates
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
    
    //removes and cleanups object
    this.destroy = function() {
        this.sprite.destroy();
        for (i=0; i < this.healthSprites.length; i++) {
            this.healthSprites[i].destroy();
        }
        hexGrid.hexTiles[this.x][this.y].mech = null;
        remove(mechs, this);
    }
    
    //adds the mech to the appropriate place by default
    hexGrid.hexTiles[x][y].mech = this;
    //adds the mech to the array of player mechs
    mechs.push(this);
}

//cancel action card object
function CancelCard() {
    this.spriteName = 'cancelCard';
    this.sprite = null;
    //draw takes the amount of abilities the mech has as the argument, used for positioning
    this.draw = function(n) {
        this.sprite = game.add.sprite((n + 1) * 150, 450, this.spriteName);
        this.sprite.scale.setTo(CARDSCALE);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickEvent, this);
        
    }
    this.clickEvent = function () {
        //cancels the ability
        AfterTargeting();
    }
}

//ability object
function Ability(mech) {
    this.spriteName = 'moveCard';
    this.sprite = null;
    this.mech = mech;
    this.range = 2;
    this.used = false;
    this.draw = function(n) {
        this.sprite = game.add.sprite((n * 200) + 30, 450, this.spriteName);
        this.sprite.scale.setTo(CARDSCALE);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickEvent, this);
    }
    this.clickEvent = function() {
        selected_ability = this;
        this.rangeDraw();
    }
    this.rangeDraw = RangeNormal;
    this.effect = null;
}

function MoveEffect(clickX, clickY) {
    if (cube_distance(oddr_to_cube(clickX, clickY), oddr_to_cube(selected_mech.x, selected_mech.y)) <= this.range && !hexGrid.hexTiles[clickX][clickY].mech) {
        var x = selected_mech.x;
        var y = selected_mech.y;
        selected_mech.changePosition(clickX, clickY);
        AfterTargeting();
        this.used = true;
    }
}

function RangeNormal() {
    ResetHexes();
    var x = this.mech.x;
    var y = this.mech.y;
    
    for (var dx = -this.range; -this.range <= dx && this.range >= dx; dx++) {
        for (var dy = -this.range; -this.range <= dy && this.range >= dy; dy++) {
            for (var dz = -this.range; -this.range <= dz && this.range >= dz; dz++) {
                if (dx + dy + dz == 0) {
                    var cubicCoOrd = cube_add( new cube(dx, dy, dz), oddr_to_cube(x, y));
                    var offsetCoOrd = cube_to_oddr(cubicCoOrd);
                    if (validateGridRef(offsetCoOrd[0], offsetCoOrd[1]))
                        if(!hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].mech)
                            hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonGreen');
                        else {
                            hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed')
                        }
                }
            }
        }
    }
}

function RangeTarget() {
    ResetHexes();
    var x = this.mech.x;
    var y = this.mech.y;
    
    
    for (var dx = -this.range; -this.range <= dx && this.range >= dx; dx++) {
        for (var dy = -this.range; -this.range <= dy && this.range >= dy; dy++) {
            for (var dz = -this.range; -this.range <= dz && this.range >= dz; dz++) {
                if (dx + dy + dz == 0) {
                    var cubicCoOrd = cube_add( new cube(dx, dy, dz), oddr_to_cube(x, y));
                    var offsetCoOrd = cube_to_oddr(cubicCoOrd);
                    if (validateGridRef(offsetCoOrd[0], offsetCoOrd[1]))
                        if(hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].mech) {
                            if(hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].mech.team == teams.enemy) {
                                hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonGreen'); 
                            }
                            else {
                                hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed');
                            }
                        }
                        else {
                             hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed');
                        }
                    
                }
            }
        }
    }
}

function FireEffect(clickX, clickY) {
    var x = selected_mech.x;
    var y = selected_mech.y;
    if (cube_distance(oddr_to_cube(clickX, clickY), oddr_to_cube(selected_mech.x, selected_mech.y)) <= this.range && hexGrid.hexTiles[clickX][clickY].mech) {
        var targetMech = hexGrid.hexTiles[clickX][clickY].mech;
        if (targetMech.team === teams.enemy){
            targetMech.health--;
            targetMech.drawHealth();
            if (targetMech.health <= 0) {
                deleteAfterAnim.push(targetMech);
            }
            projectileEffect(x, y, clickX, clickY, 'playerBullet');
            AfterTargeting();
            this.used = true;
        }
    }
}