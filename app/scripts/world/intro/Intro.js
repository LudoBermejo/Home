define([], function () {
        //return an object to define the "my/shirt" module.

        var Intro = {}
        var ludo;
        var spriteLudo;
        var spriteCursor;
        var loader;

        var wLudo = 32;
        var hLudo = 48;

        var stage;
        var layerMessageWindow;

        var messages;
        var actualMessage = 0;
        var text = null;
        var KEYCODE_SPACE = 32;		//usefull keycode

        var actualLetter = 0;

        var intervalText;


        var createSpriteLudo = function () {
            var data = {
                images: [loader.getResult("Ludo")],
                frames: {width: wLudo, height: hLudo},
                animations: {stop: [0], down: [0, 3], left: [4, 7], right: [8, 11], up: [12, 15]},
                framerate: 180
            };

            var spriteSheetLudo = new window.createjs.SpriteSheet(data);

            spriteLudo = new window.createjs.Sprite(spriteSheetLudo, "stop");

            spriteLudo.scaleX = spriteLudo.scaleY *= 0.8;


            spriteLudo.scaleX = spriteLudo.scaleY = 5;


            return spriteLudo;


        };

        var createSpriteCursor = function () {
            var data = {
                images: [loader.getResult("Cursor")],
                frames: {width: 118, height: 80},
                animations: {up: [0], down: [1], left: [2], right: [3]},
                framerate: 180
            };

            var spriteSheetCursor = new window.createjs.SpriteSheet(data);

            spriteCursor = new window.createjs.Sprite(spriteSheetCursor, "up");




            return spriteCursor;


        };


        var createMessageWindow = function()
        {
            layerMessageWindow = new window.createjs.Container();

            var backgroundWindow = new window.createjs.Shape();

            backgroundWindow.graphics.beginFill("gray").drawRoundRect(25,25,525,225,5);
            backgroundWindow.graphics.beginFill("blue").drawRoundRect(50,50,475,175,5);

            backgroundWindow.alpha = 0.6;

            layerMessageWindow.width = 500;
            layerMessageWindow.height = 175;


            layerMessageWindow.addChild(backgroundWindow);

            layerMessageWindow.x = st.width/2 - layerMessageWindow.width/2;
            layerMessageWindow.y = st.height/2- layerMessageWindow.height;


            return layerMessageWindow;

        }

        var doMessaging = function()
        {

            actualLetter = 1;
            if(messages[actualMessage].text != undefined)
            {
                if(text == null) {
                    text = new window.createjs.Text("", "48px VT323", "#ffffff");
                    text.x = 75;
                    text.y = 50;
                    layerMessageWindow.addChild(text);
                    var textSpace = new window.createjs.Text("Press space to continue", "32px VT323", "#ffffff");

                    textSpace.x = 220;
                    textSpace.y = 180;

                    layerMessageWindow.addChild(textSpace);
                }
                else
                {
                    text.text ="";
                }

                intervalText = setInterval(function()
                {
                    text.text = messages[actualMessage].text.substr(0, actualLetter);

                    if(actualLetter == messages[actualMessage].text.length)
                    {
                        clearInterval(intervalText);
                        intervalText = null;
                    }
                    actualLetter++;

                    st.update();
                },20);

            }

            if(messages[actualMessage].cursor != undefined)
            {
                if(spriteCursor == null)
                {
                    spriteCursor = createSpriteCursor();
                    layerMessageWindow.addChild(spriteCursor);
                }

                spriteCursor.x = 380;
                spriteCursor.y = 100;

                spriteCursor.gotoAndStop(messages[actualMessage].cursor );
            }
            else
            {
                if(spriteCursor) spriteCursor.visible = false;
            }

            if(messages[actualMessage].portal != undefined)
            {
                if(spriteCursor == null)
                {
                    spriteCursor = createSpriteCursor();
                    layerMessageWindow.addChild(spriteCursor);
                }

                spriteCursor.x = 380;
                spriteCursor.y = 100;

                spriteCursor.gotoAndStop(messages[actualMessage].cursor );
            }
            else
            {
                if(spriteCursor) spriteCursor.visible = false;
            }


            if(messages[actualMessage].animation != undefined)
            {
                spriteLudo.gotoAndPlay(messages[actualMessage].animation);

            }







        }

        var createKeyboard = function () {
            //allow for WASD and arrow control scheme
            function handleKeyUp(e) {
                //cross browser issues exist
                if (!e) {
                    e = window.event;
                }



                switch (e.keyCode) {
                    case KEYCODE_SPACE:

                        if(intervalText)
                        {
                            text.text = messages[actualMessage].text;
                            clearInterval(intervalText);
                            intervalText = null;
                        }
                        else {
                            actualMessage++;
                            doMessaging();
                        }
                        break;


                    default:
                }
            }


            document.onkeyup = handleKeyUp;
        };


        Intro.onEnd = null;

        Intro.init = function (stage, load) {

            st = stage;

            loader = load;


            var intro = new createjs.Container();

            intro.addChild(createSpriteLudo());

            intro.addChild(createMessageWindow());

            spriteLudo.x = stage.width/2 - wLudo/2*spriteLudo.scaleX*2 - layerMessageWindow.width/2;
            spriteLudo.y = stage.height/2 - hLudo/2*spriteLudo.scaleY+ layerMessageWindow.height/2;

            st.addChild(intro);

            messages = loader.getResult("IntroJSON").messages;

            doMessaging();

            createKeyboard();

            //window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED;
            window.createjs.Ticker.setFPS(40);

            window.createjs.Ticker.addEventListener("tick", function(evt)
            {
                stage.update(evt);
            });


        };



        return Intro;
    }
)
;