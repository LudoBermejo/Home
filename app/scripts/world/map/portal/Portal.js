define([], function () {
        //return an object to define the "my/shirt" module.

        var Portal = {};

        var spritePortal;

        var loader;
        var wPortal=31;
        var hPortal=32;

        var scalePortal=0.8;



        var createSprite = function () {
            var data = {
                images: [loader.getResult("Portal")],
                frames: {width: wPortal, height: hPortal}
            };

            var spriteSheetPortal = new window.createjs.SpriteSheet(data);

            spritePortal = new window.createjs.Sprite(spriteSheetPortal);
            spritePortal.scaleX = spritePortal.scaleY = scalePortal;

            spritePortal.framerate = 15;

        };



        Portal.init = function (load) {

            loader = load;
            createSprite();
        };

        Portal.width = function () {

            return wPortal*scalePortal;
        };

        Portal.height = function () {

            return hPortal*scalePortal;
        };



        Portal.getClone = function () {


            return spritePortal.clone();

        };


        return Portal;
    }
)
;