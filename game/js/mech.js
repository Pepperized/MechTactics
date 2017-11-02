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
    //name of the sprite for the ability
    this.spriteName = 'moveCard';
    //sprite variable
    this.sprite = null;
    //mech that this ability is for
    this.mech = mech;
    //range of ability
    this.range = 2;
    //has the ability been used this turn
    this.used = false;
    //draw function, n is the order that this ability is the list of abilities
    this.draw = function(n) {
        //position the sprite according to what order it is
        this.sprite = game.add.sprite((n * 200) + 30, 450, this.spriteName);
        //scale it
        this.sprite.scale.setTo(CARDSCALE);
        //enable input
        this.sprite.inputEnabled = true;
        //add the clickEvent function when it is clicked
        this.sprite.events.onInputDown.add(this.clickEvent, this);
    }
    //when clicked
    this.clickEvent = function() {
        //change the selected ability to this
        selected_ability = this;
        //draw the range indicator
        this.rangeDraw();
    }
    //by default, RangeNormal
    this.rangeDraw = RangeNormal;
    //effect when used
    this.effect = null;
}

//basic move function
function MoveEffect(clickX, clickY) {
    //if within range and doesn't contain a mech
    if (cube_distance(oddr_to_cube(clickX, clickY), oddr_to_cube(selected_mech.x, selected_mech.y)) <= this.range && !hexGrid.hexTiles[clickX][clickY].mech) {
        //change the coordinates of the mech to the clicked coords
        var x = selected_mech.x;
        var y = selected_mech.y;
        selected_mech.changePosition(clickX, clickY);
        //call the cleanup function
        AfterTargeting();
        //make the ability used
        this.used = true;
    }
}

//basic range drawing for move
function RangeNormal() {
    //make all hexes white
    ResetHexes();
    var x = this.mech.x;
    var y = this.mech.y;
    //find all hex coordinates in range
    for (var dx = -this.range; -this.range <= dx && this.range >= dx; dx++) {
        for (var dy = -this.range; -this.range <= dy && this.range >= dy; dy++) {
            for (var dz = -this.range; -this.range <= dz && this.range >= dz; dz++) {
                if (dx + dy + dz == 0) {
                    var cubicCoOrd = cube_add( new cube(dx, dy, dz), oddr_to_cube(x, y));
                    var offsetCoOrd = cube_to_oddr(cubicCoOrd);
                    //if the coordinate exists
                    if (validateGridRef(offsetCoOrd[0], offsetCoOrd[1]))
                        //if it doesn't contain a mech
                        if(!hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].mech)
                            //make the tile green
                            hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonGreen');
                        //if it does contain a mech
                        else {
                            //make the tile red
                            hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed')
                        }
                }
            }
        }
    }
}

//basic range drawing for targeting
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


//basic fire effect
function FireEffect(clickX, clickY) {
    var x = selected_mech.x;
    var y = selected_mech.y;
    //if clicked location is in range
    if (cube_distance(oddr_to_cube(clickX, clickY), oddr_to_cube(selected_mech.x, selected_mech.y)) <= this.range && hexGrid.hexTiles[clickX][clickY].mech) {
        var targetMech = hexGrid.hexTiles[clickX][clickY].mech;
        //if clicked location has an enemy on it
        if (targetMech.team === teams.enemy){
            //subtract the health from enemy
            targetMech.health--;
            //redraw their health
            targetMech.drawHealth();
            //if target mech is 0 or less health
            if (targetMech.health <= 0) {
                //flag for deletion
                deleteAfterAnim.push(targetMech);
            }
            //create animation for shot
            projectileEffect(x, y, clickX, clickY, 'playerBullet');
            //make all the hexes white
            AfterTargeting();
            //make the ability used
            this.used = true;
        }
    }
}