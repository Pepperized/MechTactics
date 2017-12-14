//Holds the tween animation
var tween;
//Speed of animations
var fxSpeed = 3;
//Sprites to be deleted after current animation
var deleteAfterAnim = [];
var queue = [];
//Is animation in progress?
var animInProgress = false;
//Queue of objects to be updated each frame
var updateQueue = [];

//Effect for the missiles and bullets
function projectileEffect(sX, sY, eX, eY, spriteName) {
    //Sets the animation to be in progress
    animInProgress = true;
    //Start hex
    var sHex = hexGrid.hexTiles[sX][sY];
    //End hex
    var eHex = hexGrid.hexTiles[eX][eY];
    //Distance calculation
    var coefX = eHex.truex - sHex.truex;
    var coefY = eHex.truey - sHex.truey;
    var distance = Math.sqrt(Math.pow(coefX,2) + Math.pow(coefY, 2));
    //angle calculation
    var angleRad = Math.atan(coefY / coefX);
    if (coefY - coefX < 0 && angleRad > 0) angleRad = angleRad + Math.PI;
    if (coefY - coefX > 0 && angleRad <= 0) angleRad = angleRad + Math.PI;
    //Make projectile at appropriate location
    var bulletSprite = game.add.sprite(sHex.truex, sHex.truey, spriteName);
    bulletSprite.anchor.set(0.5);
    //set the scale
    bulletSprite.scale.setTo(2);
    //Set the rotation
    bulletSprite.rotation = angleRad + (Math.PI / 2);
    //Make the movment tween
    tween = game.add.tween(bulletSprite).to({x: eHex.truex, y: eHex.truey}, distance * fxSpeed);
    //When completed
    tween.onComplete.add(function() {
        //remove the projectile
        bulletSprite.destroy();
        //add explosion sprite
        var expl = game.add.sprite(eHex.truex, eHex.truey, 'explosion');
        expl.anchor.set(0.5);
        expl.scale.setTo(2);
        //add animation to the sprite
        var anim = expl.animations.add('explode');
        //play the animation
        expl.animations.play('explode', 15, false);
        //when complete destroy the sprite
        anim.onComplete.add(function() {
            expl.destroy();
            //after the effects delete all in deleteAfterAnim
            afterEffect();
        }, this);
    }, this);
    tween.start();
}

function prepareForEffect() {
    
}


//Used to delete all the flagged sprites
function afterEffect() {
    animInProgress = false;
    for (i = 0; i < deleteAfterAnim.length; i++) {
        deleteAfterAnim[i].destroy();
    }
    deleteAfterAnim = [];
}

//Score box object, takes x and y position in pixels
function Score(x, y) {
    //x and y position
    this.x = x;
    this.y = y;
    //score 
    this.score = 0;
    //style for the font
    this.style = { font: "24pt Tarrget", fill: "#00e500", align: "left" };
    //container for the text object
    this.textObject = null;
    //draw function
    this.draw = function() {
        //Adds the sprite into the game
        this.textObject = game.add.text(this.x, this.y, "Score: " + this.score, this.style);
        //Gives the text a black outline
        this.textObject.stroke = '#000000';
        this.textObject.strokeThickness = 6;
    }
    //Add score function, adds the score then updates the text
    this.addScore = function(amount) {
        this.score = this.score + amount;
        this.updateText();
    }
    //Similar but caps the minimum amount of score at 0
    this.removeScore = function(amount) {
        this.score = this.score - amount;
        if (this.score < 0) {
            this.score = 0;
        }
        this.updateText();
    }
    //Updates the text
    this.updateText = function() {
        this.textObject.text = "Score: " + this.score;
    }
    //Draws it
    this.draw();
}

//Visual effect object for a spawn warning
function SpawnWarning(x, y, turns) {
    //Holds the arrow sprite
    this.spriteName = 'spawnWarning';
    //Number of turns remaining
    this.turns = turns;
    //Style of the font
    this.style = { font: "24pt Tarrget", fill: "#ff0044", align: "center" };
    //Container for sprtie
    this.sprite = null;
    //Container for the text
    this.textObject = null;
    //Bool that changes the direction of the rotation
    this.animBool = true;
    //Position in hexTiles
    this.x = x;
    this.y = y;
    //Position in pixels
    this.truex = hexGrid.hexTiles[this.x][this.y].truex;
    this.truey = hexGrid.hexTiles[this.x][this.y].truey;
    //Draw function
    this.draw = function() {
        //Add arrow sprite
        this.sprite = game.add.sprite(this.truex, this.truey + 5, this.spriteName);
        //Add the text
        this.textObject = game.add.text(this.truex, this.truey, this.turns, this.style);
        //add outline to text
        this.textObject.stroke = '#000000';
        this.textObject.strokeThickness = 4;
        this.textObject.anchor.setTo(0.5);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(1);
    }
    //When the turn ends
    this.endTurnEvent = function() {
        //Reduce the turn count by one
        this.turns -= 1;
        //Update the text
        this.textObject.text = this.turns;
    }
    //Animation, called each frame.
    this.update = function() {
        if(this.animBool) {
            this.sprite.angle += 1;
            if (this.sprite.angle > 35) this.animBool = false;
        } else {
            this.sprite.angle -= 1;
            if (this.sprite.angle < -35) this.animBool = true;
        }
    }
    //Destroy function
    this.destroy = function() {
        this.textObject.destroy();
        this.sprite.destroy();
    }
    
    this.draw();
    //Add to update queue
    updateQueue.push(this);
}