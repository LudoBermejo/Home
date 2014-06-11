define(["preloadjs", "world/ludo/Ludo", "world/map/Map", "world/messages/Message","world/intro/Intro"], function (preload, Ludo, Map, Message,Intro) {
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
            window.createjs.Ticker.setFPS(40);


            Intro.init(stage,loader);

            Intro.onEnd = function()
            {
              window.createjs.Ticker.addEventListener("tick", tick);

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
                {src: "assets/CursorSprite.png", id: "Cursor"},
                {src: "assets/Cloud.png", id: "Cloud1"},
                {src: "assets/Cloud2.png", id: "Cloud2"},
                {src: "assets/Cloud3.png", id: "Cloud3"},
                {src: "assets/Sign1.png", id: "Sign1"},
                {src: "assets/Sign2.png", id: "Sign2"},
                {src: "assets/Sign3.png", id: "Sign3"},
                {src: "assets/SignArea.png", id: "SignArea"},
                {src: "assets/PortalSprite.png", id: "Portal"},
                {src: "assets/BookSprite.png", id: "Book"},
                {src: "assets/messages/TotoroAvatar.jpg", id: "TotoroAvatar"},
                {src: "assets/map/Training.json", id: "TrainingJSON"},
                {src: "assets/map/Interests.json", id: "InterestsJSON"},
                {src: "assets/map/Technologies.json", id: "TechnologiesJSON"},
                {src: "assets/map/Talks.json", id: "TalksJSON"},
                {src: "assets/intro/intro.json", id: "IntroJSON"},
                {src: "assets/map/Jobs.json", id: "JobsJSON"},
                {src: "assets/map/Patents.json", id: "PatentsJSON"},
                {src: "assets/map/Languages.json", id: "LanguagesJSON"},
                {src: "assets/map/Interior.png", id: "SecundaryImage"},
                {src: "assets/map/sky.jpg", id: "Sky"},
                {src: "assets/web/Formation.html", id: "Formation"},
                {src: "assets/web/Jobs.html", id: "Jobs"},
                {src: "assets/web/Languages.html", id: "Languages"},
                {src: "assets/web/Patents.html", id: "Patents"},
                {src: "assets/web/Interests.html", id: "Interests"},
                {src: "assets/web/Talks.html", id: "Talks"},
                {src: "assets/web/Technologies.json", id: "Technologies"}

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