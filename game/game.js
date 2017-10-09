/*jshint es5: false */
/*global Phaser*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var graphics;
var hexGrid;

function preload() {
    game.load.image('hexagon', "assets/hexagon.png");
    game.load.image('hexagonRed', "assets/hexagon_red.png")
}

function create() {
    game.stage.backgroundColor = "#4488AA";
    hexGrid = new HexGrid(10, 9, 40, 50, 50);
    hexGrid.construct();
    hexGrid.draw();
    
}

function update() {
    
}
