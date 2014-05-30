define(["preloadjs", "collisionDetection"], function () {
        //return an object to define the "my/shirt" module.

        var Totoro = {};

        var spriteTotoro;

        var loader;
        var wTotoro=29;
        var hTotoro=32;

        var scaleTotoro=0.8;



        var createSprite = function () {
            var data = {
                images: [loader.getResult("Totoro")],
                frames: {width: wTotoro, height: hTotoro}

            };

            var spriteSheetTotoro = new window.createjs.SpriteSheet(data);

            spriteTotoro = new window.createjs.Sprite(spriteSheetTotoro);
            spriteTotoro.scaleX = spriteTotoro.scaleY = scaleTotoro;

        };



        Totoro.init = function (load) {

            loader = load;
            createSprite();
        };

        Totoro.width = function () {

            return wTotoro*scaleTotoro;
        };

        Totoro.height = function () {

            return hTotoro*scaleTotoro;
        };



        Totoro.getClone = function () {


            return spriteTotoro.clone();

        };


        return Totoro;
    }
)
;