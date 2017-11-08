/*jshint es5: false */
/*global Phaser*/
//game setup
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gamediv', { preload: preload, create: create, update: update });
var hexGrid;
var endTurnButton;
var enemyQueue = [];
var turns = {player: 0,
            enemy: 1};
var turn = turns.player;
var score;
var warning;
var spawnChance = 0;

//called when page is loaded
function preload() {
    //Disable anti-aliasing so that sprites retain their "pixel" feel
    this.game.smoothed = false;
    
    //loads all images used and stores keys to access them
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
    game.load.image('spawnWarning', "assets/spawnWarning.png");
    //Loads a spritesheet of the explosion animation, the last two arguments are the size of each frame in the file
    game.load.spritesheet('explosion', "assets/explosion.png", 14, 14);
}

//called after preload is finished
function create() {
    //Sets a background colour
    game.stage.backgroundColor = "#383838";
    //Creates a new HexGrid object with arguments specifiying the amount of rows, collumns, hexagon size and grid center
    hexGrid = new HexGrid(10, 9, 40, 50, 50);
    //Populates the grid with HexTile objects using the variables stored within the HexGrid
    hexGrid.construct();
    //Adds the sprites for each HexTile into the scene
    hexGrid.draw();
    
    //Creates a new sprite of the end turn button
    endTurnButton = game.add.sprite((game.world.centerX * 2) - 60, 40, 'endTurn');
    //The 'anchor' is refers to where the pivot of the sprite is, by default it is top left, this sets it to center.
    endTurnButton.anchor.set(0.5);
    //Scales the sprite to an appropriate size
    endTurnButton.scale.setTo(CARDSCALE);
    //Enables input events
    endTurnButton.inputEnabled = true;
    //When the sprite is clicked
    endTurnButton.events.onInputDown.add(function() {
        //Changes the turn to the enemy turn
        changeTurn(turns.enemy);
        //Gets a shallow copy of the enemies array
        enemyQueue = enemies.slice();
        //Changes the sprite to "Enemy Turn..." 
        endTurnButton.loadTexture('enemyTurn');
        //for each spawn
        for (i=0; i < spawns.length; i++) {
            //fires off the endTurnEvent function
            spawns[i].endTurnEvent();
        }
        //for each player unit
        for (i=0; i < mechs.length; i++) {
            //for each ability in that mech
            for (j=0; j < mechs[i].abilities.length; j++) {
                //set the used bool to false, allowing the abilities to be used again
                mechs[i].abilities[j].used = false;
            }
        }
        //get a random integer between 2 and 6 inclusive
        var randInt = getRandomInt(2, 6);
        //if the spawnChance, default 0, is equal or greater than the random integer create a random enemy spawn
        if (spawnChance >= randInt) createRandomSpawn();
        //else increase the chance of it happening next time
        else spawnChance++;
    }, this);
    
    //new player unit at grid position 4, 4
    var mech = new Mech(4, 4);
    //draw it
    mech.draw();
    //add it to the appropriate hexTiles mech property
    hexGrid.hexTiles[4,4].mech = mech;
    //make a new ability, giving it the mech that it will be attached to
    var move = new Ability(mech);
    //set the effect to MoveEffect, a function
    move.effect = MoveEffect;
    //set the ability's sprite to moveCard
    move.spriteName = 'moveCard';
    //make a new ability
    var shoot = new Ability(mech);
    //set the effect to FireEffect, a function
    shoot.effect = FireEffect;
    shoot.spriteName = 'fireCard';
    //sets the range visuals to RangeTarget, opposed to the default value which is RangeMove
    shoot.rangeDraw = RangeTarget;
    //sets the range of tiles
    shoot.range = 4;
    //adds those abilities to the mech
    mech.abilities = [move, shoot];
    
    //another mech set up
    var mech2 = new Mech(2,3);
    mech2.health = 2;
    mech2.draw();
    hexGrid.hexTiles[2,3].mech = mech2;
    move = new Ability(mech2);
    move.effect = MoveEffect;
    move.spriteName = 'moveCard';
    mech2.abilities = [move];
    
    //enemy mechs instantiated
    var enemyMech = new EnemyMech(3, 2);
    enemyMech.draw();
    
    enemyMech = new EnemyMech(1, 2);
    enemyMech.draw();
    
    enemyMech = new EnemyMech(7, 2);
    enemyMech.draw();
    
    //creates the score object and postions it at 10px, 10px
    score = new Score(10, 10);
    
}

//t is a frame counter
var t = 0;

//called each frame
function update() {
    //if it's the enemy turn and no animations are happening
    if(turn === turns.enemy && !animInProgress) {
        //if it has been at least 15 frames since the last action
        if (t >= 15) {
            //reset frame counter
            t = 0;
            //do the next queued enemy action
            processQueue();
        //else increase frame counter by 1
        } else t++;
    }
    //for each object in the update queue, used for animations that are continuous and looping
    for (i=0; i < updateQueue.length; i++) {
        //call their update function
        updateQueue[i].update();
    }
}

//found online, random integer inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//found online, removes an element from an array safely
function remove(array, element) {
    const index = array.indexOf(element);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
}

//changes the turn
function changeTurn(newTurn) {
    //changes the turn global variable
    turn = newTurn;
    //if it's the player's turn
    if (newTurn === turns.player) {
        //enable the input of everything
        for (x = 0; x < hexGrid.hexTiles.length; x++) {
            for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
                hexGrid.hexTiles[x][y].sprite.inputEnabled = true;
            }
        }
        endTurnButton.inputEnabled = true;
        endTurnButton.loadTexture('endTurn');
    //if it's the enemies' turn
    } else {
        //disable the input of everything
        for (x = 0; x < hexGrid.hexTiles.length; x++) {
            for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
                hexGrid.hexTiles[x][y].sprite.inputEnabled = false;
            }
        }
        endTurnButton.inputEnabled = false;
    }
}

//enemy action queue
function processQueue() {
    //if there's nothing left to do
    if (enemyQueue.length == 0) {
        //change it to the player's turn
        changeTurn(turns.player);
    } else {
        //remove the next enemy from the array and return it
        var item = enemyQueue.pop();
        //do the routine of the enemy
        item.routine();
    }
    //if there are no player mechs left
    if (mechs.length === 0) {
        //call the endGame function
        endGame();
        
    }
}

//called when the game is over
function endGame() {
    //removes the end turn button
    endTurnButton.destroy();
    //makes it the enemy turn, to disable input
    changeTurn(turns.enemy);
    //css style of the font
    var style = { font: "24pt Tarrget", fill: "#ff0044", align: "center" };
    //adds the game over text
    var text = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER\nYour score is: " + score.score, style);
    text.anchor.setTo(0.5);
    //adds an outline
    text.stroke = '#000000';
    text.strokeThickness = 6;
    //removes the score object
    score.textObject.destroy();
}

