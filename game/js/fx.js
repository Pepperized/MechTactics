var tween;
var fxSpeed = 3;

function projectileEffect(sX, sY, eX, eY, spriteName) {
    var sHex = hexGrid.hexTiles[sX][sY];
    var eHex = hexGrid.hexTiles[eX][eY];
    var coefX = eHex.truex - sHex.truex;
    var coefY = eHex.truey - sHex.truey;
    var distance = Math.sqrt(Math.pow(coefX,2) + Math.pow(coefY, 2));
    var angleRad = Math.atan(coefY / coefX);
    var angle = (angleRad * 180 / Math.PI )+ 90;
    var bulletSprite = game.add.sprite(sHex.truex, sHex.truey, spriteName);
    bulletSprite.anchor.set(0.5);
    bulletSprite.scale.setTo(2);
    bulletSprite.angle = angle;
    tween = game.add.tween(bulletSprite).to({x: eHex.truex, y: eHex.truey}, distance * fxSpeed);
    tween.onStart.add(prepareForEffect, this);
    tween.onComplete.add(function() {
        bulletSprite.destroy();
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
}

function afterEffect() {
    for (x = 0; x < hexGrid.hexTiles.length; x++) {
        for(y = 0; y < hexGrid.hexTiles[x].length; y++) {
            hexGrid.hexTiles[x][y].sprite.inputEnabled = true;
        }
    }
}