/*jshint es5: false */
/*global Phaser*/
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var graphics;
var hexGrid;
var endTurnButton;
var enemyQueue = [];
var turns = {player: 0,
            enemy: 1};
var turn = turns.player;
var score;
var warning;
var spawnChance = 0;

function preload() {

    this.game.smoothed = false;
    
    game.load.image('hexagon', "assets/hexagon.png");
    game.load.image('hexagonRed', "assets/hexagon_red.png");
    game.load.image('hexagonGreen', "assets/hexagonGreen.png");
    game.load.image('missileMech', "assets/MissileMech.png");
    game.load.image('moveCard', "assets/framemove.png");
    game.load.image('cancelCard', "assets/framecancel.png");
    game.load.image('endTurn', "assets/frameend.png");
    game.load.image('enemyTurn', "assets/frameenemyturn.png");
    game.load.image('fireCard', "assets/framefire.png");
    game.load.image('health', "assets/health.png");
    game.load.image('enemyMech', "assets/enemy.png");
    game.load.image('playerBullet', "assets/playerBullet.png");
    game.load.image('enemyBullet', "assets/enemyBullet.png");
    game.load.spritesheet('explosion', "assets/explosion.png", 14, 14);
    game.load.image('spawnWarning', "assets/spawnWarning.png");
}

function create() {
    
    game.stage.backgroundColor = "#4488AA";
    hexGrid = new HexGrid(10, 9, 40, 50, 50);
    hexGrid.construct();
    hexGrid.draw();
    
    endTurnButton = game.add.sprite((game.world.centerX * 2) - 60, 40, 'endTurn');
    endTurnButton.anchor.set(0.5);
    endTurnButton.scale.setTo(CARDSCALE);
    endTurnButton.inputEnabled = true;
    endTurnButton.events.onInputDown.add(function() {
        console.log("End turn");
        changeTurn(turns.enemy);
        enemyQueue = enemies.slice();
        endTurnButton.loadTexture('enemyTurn');
        for (i=0; i < spawns.length; i++) {
            spawns[i].endTurnEvent();
        }
        
        for (i=0; i < mechs.length; i++) {
            for (j=0; j < mechs[i].abilities.length; j++) {
                mechs[i].abilities[j].used = false;
            }
        }
        
        var randInt = getRandomInt(2, 6);
        if (spawnChance >= randInt) createRandomSpawn();
        else spawnChance++;
    }, this);
    
    
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
    
    var enemyMech = new EnemyMech(3, 2);
    enemyMech.draw();
    
    enemyMech = new EnemyMech(1, 2);
    enemyMech.draw();
    
    enemyMech = new EnemyMech(7, 2);
    enemyMech.draw();
    
    score = new Score(10, 10);
    
}

var t = 0;

function update() {
    if(turn === turns.enemy && !animInProgress) {
        if (t >= 15) {
            t = 0;
            console.log(turn);
            processQueue();
        } else t++;
    }
    for (i=0; i < updateQueue.length; i++) {
        updateQueue[i].update();
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function remove(array, element) {
    const index = array.indexOf(element);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function changeTurn(newTurn) {
    turn = newTurn;
    if (newTurn === turns.player) {
        for (x = 0; x < hexGrid.hexTiles.length; x++) {
            for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
                hexGrid.hexTiles[x][y].sprite.inputEnabled = true;
            }
        }
        endTurnButton.inputEnabled = true;
        endTurnButton.loadTexture('endTurn');
    } else {
        for (x = 0; x < hexGrid.hexTiles.length; x++) {
            for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
                hexGrid.hexTiles[x][y].sprite.inputEnabled = false;
            }
        }
        endTurnButton.inputEnabled = false;
    }
}

function processQueue() {
    if (enemyQueue.length == 0) {
        changeTurn(turns.player);
    } else {
        var item = enemyQueue.pop();
        item.routine();
    }
    if (mechs.length === 0) {
        endGame();
        
    }
}

function endGame() {
    endTurnButton.destroy();
    changeTurn(turns.enemy);
    var style = { font: "24pt Tarrget", fill: "#ff0044", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER\nYour score is: " + score.score, style);
    text.anchor.setTo(0.5);
    text.stroke = '#000000';
    text.strokeThickness = 6;
    score.textObject.destroy();
}

