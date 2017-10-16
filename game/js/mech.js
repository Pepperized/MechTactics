var MECHSCALE = 1.5;
var CARDSCALE = 0.25;
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
    this.abilities = [];
    this.activated = false;
    this.draw = function() {
        console.log("Draw!");
        this.sprite = game.add.sprite(this.truex, this.truey, this.spriteName);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(MECHSCALE);
    }
    this.clickEvent = function () {
            for (i=0; i < this.abilities.length; i++){
                this.abilities[i].draw(i);
            }
            cancelCard.draw(this.abilities.length);
        
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
    this.spriteName = null;
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
    
    /*for (i=0; i < 6; i++) {
        var cubicCoOrd = cube_getNeighborInDir(oddr_to_cube(x, y), cube_directions[i]);
        var offsetCoOrd = cube_to_oddr(cubicCoOrd);
        
        hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed');
        
    }*/
    
    for (var dx = -this.range; -this.range <= dx && this.range >= dx; dx++) {
        for (var dy = -this.range; -this.range <= dy && this.range >= dy; dy++) {
            for (var dz = -this.range; -this.range <= dz && this.range >= dz; dz++) {
                if (dx + dy + dz == 0) {
                    var cubicCoOrd = cube_add( new cube(dx, dy, dz), oddr_to_cube(x, y));
                    var offsetCoOrd = cube_to_oddr(cubicCoOrd);
                    if (validateGridRef(offsetCoOrd[0], offsetCoOrd[1]))
                        if(!hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].mech)
                            hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed');
                }
            }
        }
    }
}