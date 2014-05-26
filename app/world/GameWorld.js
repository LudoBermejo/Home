define(["preloadjs", "world/ludo/Ludo", "world/map/Map"], function (preload, Ludo, Map) {
        //return an object to define the "my/shirt" module.

        var GameWorld = {};

        var manifest;
        var loader;


        var handleComplete = function () {


            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", tick);

            Map.init(stage, loader);
            Ludo.init(stage, loader, Map.getCollision);

            stage.update();

        }

        function tick(event) {
            Ludo.movement();
            //stage.update(event);
        }

        GameWorld.init = function () {


            stage = new createjs.Stage("worldCanvas");

            stage.customUpdate = function()
            {
                stage.update();
            }


            // grab canvas width and height for later calculations:
            w = stage.canvas.width;
            h = stage.canvas.height;

            manifest = [
                {src: "app/assets/LudoSprite.png", id: "Ludo"},
                {src: "app/assets/map/desert.json", id: "MapJSON"},
                {src: "app/assets/map/SpriteDesert.png", id: "MapImage"}

            ];

            loader = new createjs.LoadQueue(false);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest);

        }


        return GameWorld;
    }
);