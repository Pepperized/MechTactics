var MECHSCALE = 1.5;
var CARDSCALE = 0.25;
var HEALTHSCALE = 2;
var cancelCard = new CancelCard();
var teams = {player: 0,
            enemy: 1};

function Mech(x, y) {
    this.spriteName = 'missileMech';
    this.sprite = null;
    this.x = x;
    this.y = y;
    this.truex = hexGrid.hexTiles[x][y].truex;
    this.truey = hexGrid.hexTiles[x][y].truey;
    this.team = teams.player;
    this.health = 3;
    this.healthSprites = [];
    this.abilities = [];
    this.exhausted = false;
    this.draw = function() {
        this.sprite = game.add.sprite(this.truex, this.truey, this.spriteName);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(MECHSCALE);
        this.drawHealth();
    }
    this.clickEvent = function () {
            for (i=0; i < this.abilities.length; i++){
                this.abilities[i].draw(i);
            }
            cancelCard.draw(this.abilities.length);
        
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

function CancelCard() {
    this.spriteName = 'cancelCard';
    this.sprite = null;
    this.draw = function(n) {
        this.sprite = game.add.sprite((n + 1) * 150, 450, this.spriteName);
        this.sprite.scale.setTo(CARDSCALE);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickEvent, this);
        
    }
    this.clickEvent = function () {
        AfterTargeting();
    }
}

function Ability(mech) {
    this.spriteName = 'moveCard';
    this.sprite = null;
    this.mech = mech;
    this.range = 2;
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
    if (cube_distance(oddr_to_cube(clickX, clickY), oddr_to_cube(selected_mech.x, selected_mech.y)) <= this.range && hexGrid.hexTiles[clickX][clickY].mech) {
        var targetMech = hexGrid.hexTiles[clickX][clickY].mech;
        if (targetMech.team === teams.enemy){
            targetMech.health--;
            targetMech.drawHealth();
            if (targetMech.health <= 0) {
                targetMech.destroy();
            }
            AfterTargeting();
        }
    }
}