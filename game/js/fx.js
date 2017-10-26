var tween;
var fxSpeed = 3;
var deleteAfterAnim = [];
var queue = [];
var animInProgress = false;
var updateQueue = [];

function projectileEffect(sX, sY, eX, eY, spriteName) {
    animInProgress = true;
    var sHex = hexGrid.hexTiles[sX][sY];
    var eHex = hexGrid.hexTiles[eX][eY];
    var coefX = eHex.truex - sHex.truex;
    var coefY = eHex.truey - sHex.truey;
    var distance = Math.sqrt(Math.pow(coefX,2) + Math.pow(coefY, 2));
    var angleRad = Math.atan(coefY / coefX);
    if (coefY - coefX < 0 && angleRad > 0) angleRad = angleRad + Math.PI;
    if (coefY - coefX > 0 && angleRad <= 0) angleRad = angleRad + Math.PI;
    var bulletSprite = game.add.sprite(sHex.truex, sHex.truey, spriteName);
    bulletSprite.anchor.set(0.5);
    bulletSprite.scale.setTo(2);
    bulletSprite.rotation = angleRad + (Math.PI / 2);
    tween = game.add.tween(bulletSprite).to({x: eHex.truex, y: eHex.truey}, distance * fxSpeed);
    tween.onComplete.add(function() {
        bulletSprite.destroy();
        var expl = game.add.sprite(eHex.truex, eHex.truey, 'explosion');
        expl.anchor.set(0.5);
        expl.scale.setTo(2);
        var anim = expl.animations.add('explode');
        expl.animations.play('explode', 15, false);
        anim.onComplete.add(function() {
            expl.destroy();
            afterEffect();
        }, this);
    }, this);
    tween.start();
}

function prepareForEffect() {
    
}

function afterEffect() {
    animInProgress = false;
    for (i = 0; i < deleteAfterAnim.length; i++) {
        deleteAfterAnim[i].destroy();
    }
    deleteAfterAnim = [];
}

function Score(x, y) {
    this.x = x;
    this.y = y;
    this.score = 0;
    this.style = { font: "24pt Tarrget", fill: "#ff0044", align: "left" };
    this.textObject = null;
    this.draw = function() {
        this.textObject = game.add.text(this.x, this.y, "Score: " + this.score, this.style);
        this.textObject.stroke = '#000000';
        this.textObject.strokeThickness = 6;
    }
    this.addScore = function(amount) {
        this.score = this.score + amount;
        this.updateText();
    }
    this.removeScore = function(amount) {
        this.score = this.score - amount;
        if (this.score < 0) {
            this.score = 0;
        }
        this.updateText();
    }
    this.updateText = function() {
        this.textObject.text = "Score: " + this.score;
    }
    
    this.draw();
}

function SpawnWarning(x, y, turns) {
    this.spriteName = 'spawnWarning';
    this.turns = turns;
    this.style = { font: "24pt Tarrget", fill: "#ff0044", align: "center" };
    this.sprite = null;
    this.textObject = null;
    this.animBool = true;
    this.x = x;
    this.y = y;
    this.truex = hexGrid.hexTiles[this.x][this.y].truex;
    this.truey = hexGrid.hexTiles[this.x][this.y].truey;
    this.draw = function() {
        this.sprite = game.add.sprite(this.truex, this.truey + 5, this.spriteName);
        this.textObject = game.add.text(this.truex, this.truey, this.turns, this.style);
        this.textObject.stroke = '#000000';
        this.textObject.strokeThickness = 4;
        this.textObject.anchor.setTo(0.5);
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(1);
    }
    this.endTurnEvent = function() {
        this.turns -= 1;
        this.textObject.text = this.turns;
    }
    this.update = function() {
        if(this.animBool) {
            this.sprite.angle += 1;
            if (this.sprite.angle > 35) this.animBool = false;
        } else {
            this.sprite.angle -= 1;
            if (this.sprite.angle < -35) this.animBool = true;
        }
    }
    this.destroy = function() {
        this.textObject.destroy();
        this.sprite.destroy();
    }
    
    this.draw();
    updateQueue.push(this);
}