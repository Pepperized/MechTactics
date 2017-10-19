var tween;
var fxSpeed = 3;
var deleteAfterAnim = [];
var queue = [];

function projectileEffect(sX, sY, eX, eY, spriteName) {
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
    tween.onStart.add(prepareForEffect, this);
    tween.onComplete.add(function() {
        bulletSprite.destroy();
        var expl = game.add.sprite(eHex.truex, eHex.truey, 'explosion');
        expl.anchor.set(0.5);
        expl.scale.setTo(2);
        var anim = expl.animations.add('explode');
        expl.animations.play('explode', 15, false);
        anim.onComplete.add(function() {
            expl.destroy();
        }, this);
        afterEffect();
    }, this);
    tween.start();
}

function prepareForEffect() {
    for (x = 0; x < hexGrid.hexTiles.length; x++) {
        for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
            hexGrid.hexTiles[x][y].sprite.inputEnabled = false;
        }
    }
    endTurnButton.inputEnabled = false;
}

function afterEffect() {
    for (x = 0; x < hexGrid.hexTiles.length; x++) {
        for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
            hexGrid.hexTiles[x][y].sprite.inputEnabled = true;
        }
    }
    endTurnButton.inputEnabled = true;
    for (i = 0; i < deleteAfterAnim.length; i++) {
        deleteAfterAnim[i].destroy();
    }
    deleteAfterAnim = [];
}

function processQueue() {
    
}