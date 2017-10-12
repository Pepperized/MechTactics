var MECHSCALE = 1.5;


function Mech(x, y) {
    this.spriteName = 'missileMech';
    this.sprite = null;
    this.x = x;
    this.y = y;
    this.truex = hexGrid.hexTiles[x][y].truex;
    this.truey = hexGrid.hexTiles[x][y].truey;
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
                this.abilities[i].draw();
            }
        
    }
    this.changePosition = function(x, y) {
        this.x = x;
        this.y = y;
        this.truex = hexGrid.hexTiles[x][y].truex;
        this.truey = hexGrid.hexTiles[x][y].truey;
        this.sprite.x = this.truex;
        this.sprite.y = this.truey;
        hexGrid.hexTiles[x][y].mech = this;
    }
    
    hexGrid.hexTiles[x][y].mech = this;
}

function Ability(mech) {
    this.spriteName = 'moveCard';
    this.sprite = null;
    this.mech = mech;
    this.range = 2;
    this.draw = function() {
        this.sprite = game.add.sprite(32, 450, this.spriteName);
        this.sprite.scale.setTo(0.25);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickEvent, this);
    }
    this.clickEvent = function() {
        selected_ability = this;
        this.rangeDraw();
    }
    this.rangeDraw = RangeNormal;
    this.effect = function(clickX, clickY) { 
        if (cube_distance(oddr_to_cube(clickX, clickY), oddr_to_cube(selected_mech.x, selected_mech.y)) <= this.range) {
            selected_mech.changePosition(clickX, clickY);
            current_grid_state = grid_state.select;
            for (i=0; i < hexGrid.hexTiles.length; i++) {
                for (j=0;j < hexGrid.hexTiles[i].length; j++){
                    hexGrid.hexTiles[i][j].changeSprite('hexagon');
                }
            }
            for (i=0; i < selected_mech.abilities.length; i++) {
                selected_mech.abilities[i].sprite.destroy();
            }
        }
    }
}

function RangeNormal() {
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
                    console.log(new cube(dx, dy, dz));
                    var cubicCoOrd = cube_add( new cube(dx, dy, dz), oddr_to_cube(x, y));
                    var offsetCoOrd = cube_to_oddr(cubicCoOrd);
                    if (validateGridRef(offsetCoOrd[0], offsetCoOrd[1]))
                        hexGrid.hexTiles[offsetCoOrd[0]][offsetCoOrd[1]].changeSprite('hexagonRed');
                }
            }
        }
    }
}