define(["preloadjs", "world/ludo/Ludo", "world/map/Map", "world/messages/Message"], function (preload, Ludo, Map, Message) {
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
            Ludo.init(stage, loader, Map.getCollision, Map.getTriggers);

            Message.init(stage, loader);

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
                {src: "assets/LudoSprite.png", id: "Ludo"},
                {src: "assets/map/MapaLudo.json", id: "MapJSON"},
                {src: "assets/map/MapaLudo.png", id: "MapImage"},
                {src: "assets/map/messages/messages.json", id: "MapMessages"},

              ];

            loader = new window.createjs.LoadQueue(false);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest);

        };


        return GameWorld;
    }
);