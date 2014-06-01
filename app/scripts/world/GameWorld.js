define(["preloadjs", "world/ludo/Ludo", "world/map/Map", "world/messages/Message"], function (preload, Ludo, Map, Message) {
        //return an object to define the "my/shirt" module.

        var GameWorld = {};

        var manifest;
        var loader;
        var stage;


        var handleComplete = function () {


            //window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED;
            window.createjs.Ticker.addEventListener("tick", tick);


            window.createjs.Ticker.setFPS(40);


            Map.init(stage, loader);
            Ludo.init(stage, loader, Map.getCollision, Map.getTriggers);
            Message.init(stage, loader);

            console.log(Message);

            Map.message = Message;

            Map.onChangeArea = function(area)
            {
                Ludo.changeArea(area);
            };


            stage.update();

        };

        function tick(event) {
            if(event.paused) return;
            Ludo.movement();
            stage.update(event);
        }

        GameWorld.init = function () {


            var ctx = document.getElementById("worldCanvas").getContext("2d");

            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;


            stage = new window.createjs.Stage("worldCanvas");
            stage.width =  parseInt(document.getElementById("worldCanvas").getAttribute("width"));
            stage.height =  parseInt(document.getElementById("worldCanvas").getAttribute("height"));



            stage.customUpdate = function()
            {
                //stage.update();
            };


            manifest = [
                {src: "assets/LudoSprite.png", id: "Ludo"},
                {src: "assets/map/MapaLudo.json", id: "MapJSON"},
                {src: "assets/map/MapaLudo.png", id: "MapImage"},
                {src: "assets/messages/messages.json", id: "MapMessages"},
                {src: "assets/TotoroSprite.png", id: "Totoro"},
                {src: "assets/PortalSprite.png", id: "Portal"},
                {src: "assets/BookSprite.png", id: "Book"},
                {src: "assets/messages/TotoroAvatar.jpg", id: "TotoroAvatar"},
                {src: "assets/map/Training.json", id: "TrainingJSON"},
                {src: "assets/map/Interior.png", id: "TrainingImage"},
                {src: "assets/web/Formation.html", id: "Formation"}

              ];

            loader = new window.createjs.LoadQueue(false);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest);

        };


        return GameWorld;
    }
);