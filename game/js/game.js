/*jshint es5: false */
/*global Phaser*/
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var graphics;
var hexGrid;
var enemyMech;

function preload() {

    this.game.smoothed = false;
    
    game.load.image('hexagon', "assets/hexagon.png");
    game.load.image('hexagonRed', "assets/hexagon_red.png");
    game.load.image('hexagonGreen', "assets/hexagonGreen.png");
    game.load.image('missileMech', "assets/MissileMech.png");
    game.load.image('moveCard', "assets/framemove.png");
    game.load.image('cancelCard', "assets/framecancel.png");
    game.load.image('fireCard', "assets/framefire.png");
    game.load.image('health', "assets/health.png");
    game.load.image('enemyMech', "assets/enemy.png");
    game.load.image('playerBullet', "assets/playerBullet.png");
    game.load.image('enemyBullet', "assets/enemyBullet.png");
}

function create() {
    game.stage.backgroundColor = "#4488AA";
    hexGrid = new HexGrid(10, 9, 40, 50, 50);
    hexGrid.construct();
    hexGrid.draw();
    
    
    var mech = new Mech(4, 4);
    mech.draw();
    hexGrid.hexTiles[4,4].mech = mech;
    var move = new Ability(mech);
    move.effect = MoveEffect;
    move.spriteName = 'moveCard';
    var shoot = new Ability(mech);
    shoot.effect = FireEffect;
    shoot.spriteName = 'fireCard';
    shoot.rangeDraw = RangeTarget;
    shoot.range = 4;
    mech.abilities = [move, shoot];
    
    var mech2 = new Mech(2,3);
    mech2.health = 2;
    mech2.draw();
    hexGrid.hexTiles[2,3].mech = mech2;
    move = new Ability(mech2);
    move.effect = MoveEffect;
    move.spriteName = 'moveCard';
    mech2.abilities = [move];
    
    enemyMech = new EnemyMech(3, 2);
    enemyMech.draw();
    
    
}

var t = 0;

function update() {
    //take action every 30 frames
    if (t >= 300) {
        t = 0;
        projectileEffect(1,1,8,8,'playerBullet');
    } else {
        t++;
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


