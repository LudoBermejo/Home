define(["preloadjs", "world/ludo/Ludo", "world/map/Map", "world/messages/Message"], function (preload, Ludo, Map, Message) {
        //return an object to define the "my/shirt" module.

        var GameWorld = {};

        var manifest;
        var loader;
        var stage;


        var loaderWidth = 300;
        var loaderColor;
        var loaderBar;
        var bar;

        var handleComplete = function () {

            stage.removeChild(loaderBar);

            loaderBar = null;

            //window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED;
            window.createjs.Ticker.addEventListener("tick", tick);


            window.createjs.Ticker.setFPS(40);


            Map.init(stage, loader);
            Ludo.init(stage, loader, Map.getCollision, Map.getTriggers);
            Message.init(stage, loader);

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

        function makeLoaderBar()
        {
            var barHeight = 20;
            loaderColor = createjs.Graphics.getRGB(247,0,0);
            loaderBar = new createjs.Container();

            bar = new createjs.Shape();
            bar.graphics.beginFill(loaderColor).drawRect(0, 0, 1, barHeight).endFill();


            var bgBar = new createjs.Shape();
            var padding = 3
            bgBar.graphics.setStrokeStyle(1).beginStroke(loaderColor).drawRect(-padding/2, -padding/2, loaderWidth+padding, barHeight+padding);

            loaderBar.x = stage.width - loaderWidth>>1;
            loaderBar.y = stage.height - barHeight>>1;
            loaderBar.addChild(bar, bgBar);
            stage.addChild(loaderBar)


        }

        function handleProgress(event) {
            bar.scaleX = event.loaded * loaderWidth;
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
                {src: "assets/map/Jobs.json", id: "JobsJSON"},
                {src: "assets/map/Interior.png", id: "SecundaryImage"},
                {src: "assets/web/Formation.html", id: "Formation"}

              ];

            makeLoaderBar();
            loader = new window.createjs.LoadQueue(false);
            loader.addEventListener("progress", handleProgress);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest);


        };




        return GameWorld;
    }
);