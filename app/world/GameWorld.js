define(["preloadjs", "world/ludo/Ludo", "world/map/Map"], function (preload, Ludo, Map) {
        //return an object to define the "my/shirt" module.

        var GameWorld = {};

        var manifest;
        var loader;
        var stage;


        var handleComplete = function () {


            window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED;
            window.createjs.Ticker.addEventListener("tick", tick);

            window.createjs.Ticker.framerate = 60;

            Map.init(stage, loader);
            Ludo.init(stage, loader, Map.getCollision);

            stage.update();

        };

        function tick() {
            Ludo.movement();
        }

        GameWorld.init = function () {


            stage = new window.createjs.Stage("worldCanvas");


            stage.customUpdate = function()
            {
                stage.update();
            };


            manifest = [
                {src: "app/assets/LudoSprite.png", id: "Ludo"},
                {src: "app/assets/map/MapaLudo.json", id: "MapJSON"},
                {src: "app/assets/map/MapaLudo.png", id: "MapImage"}

            ];

            loader = new window.createjs.LoadQueue(false);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest);

        };


        return GameWorld;
    }
);