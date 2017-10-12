/*jshint es5: false */
/*global Phaser*/
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var graphics;
var hexGrid;

function preload() {

    this.game.smoothed = false;
    
    game.load.image('hexagon', "assets/hexagon.png");
    game.load.image('hexagonRed', "assets/hexagon_red.png")
    game.load.image('missileMech', "assets/MissileMech.png")
    game.load.image('moveCard', "assets/framemove.png")
    game.load.image('cancelCard', "assets/framecancel.png")
}

function create() {
    game.stage.backgroundColor = "#4488AA";
    hexGrid = new HexGrid(10, 9, 40, 50, 50);
    hexGrid.construct();
    hexGrid.draw();
    
    var mech = new Mech(4, 4);
    mech.draw();
    hexGrid.hexTiles[4][4].mech = mech;
    mech.abilities = [new Ability(mech)];
    
    var mech2 = new Mech(2,3);
    mech2.draw();
    hexGrid.hexTiles[2,3].mech = mech2;
    mech2.abilities = [new Ability(mech2)];

    
}

function update() {
    
}
