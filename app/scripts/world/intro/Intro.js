define([], function () {
        //return an object to define the "my/shirt" module.

        var Intro = {}
        var ludo;
        var spriteLudo;
        var spriteCursor;
        var spritePortal;
        var spriteBook;
        var spirteTotoro;
        var loader;

        var wLudo = 32;
        var hLudo = 48;

        var stage;
        var layerMessageWindow;

        var messages;
        var actualMessage = 0;
        var text = null;
        var KEYCODE_SPACE = 32;		//usefull keycode

        var KEYCODE_ESCAPE = 27;		//usefull keycode
        var actualLetter = 0;

        var intervalText;

        var actualSprite = null;
        var intro = null;


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

        var createSprite = function (sprite) {

            if(sprite == "Portal") {
                var wPortal = 31;
                var hPortal = 32;
                var data = {
                    images: [loader.getResult("Portal")],
                    frames: {width: wPortal, height: hPortal}
                };

                var spriteSheetPortal = new window.createjs.SpriteSheet(data);

                spritePortal = new window.createjs.Sprite(spriteSheetPortal);


                spritePortal.framerate = 15;
                return spritePortal;
            } else if(sprite == "Totoro")
            {
                var wTotoro=29;
                var hTotoro=32;

                var data = {
                    images: [loader.getResult("Totoro")],
                    frames: {width: wTotoro, height: hTotoro}
                };

                var spriteSheetTotoro = new window.createjs.SpriteSheet(data);

                spriteTotoro = new window.createjs.Sprite(spriteSheetTotoro);


                spriteTotoro.framerate = 15;
                return spriteTotoro;
            } else if(sprite == "Book")
            {
                var wBook=32;
                var hBook=32;

                var data = {
                    images: [loader.getResult("Book")],
                    frames: {width: wBook, height: hBook}
                };

                var spriteSheetBook = new window.createjs.SpriteSheet(data);

                spriteBook = new window.createjs.Sprite(spriteSheetBook);


                spriteBook.framerate = 15;
                return spriteBook
            }

        };



        var createMessageWindow = function()
        {
            layerMessageWindow = new window.createjs.Container();

            var backgroundWindow = new window.createjs.Shape();

            backgroundWindow.graphics.beginFill("gray").drawRoundRect(25,25,525,250,5);
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
                    var textEscape = new window.createjs.Text("Press escape to skip", "32px VT323", "#ffffff");

                    textSpace.x = 220;
                    textSpace.y = 180;

                    textEscape.x = 270;
                    textEscape.y = 230;

                    layerMessageWindow.addChild(textSpace);
                    layerMessageWindow.addChild(textEscape);
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
                console.log("EO");
                if(spriteCursor) spriteCursor.visible = false;
            }

            if(messages[actualMessage].sprite != undefined)
            {
                if(actualSprite != null)
                {
                    layerMessageWindow.removeChild(actualSprite);
                    actualSprite = null;
                }
                actualSprite = createSprite(messages[actualMessage].sprite)
                actualSprite.x = 440;
                actualSprite.y = 110;

                layerMessageWindow.addChild(actualSprite);

                actualSprite.scaleX = actualSprite.scaleY = messages[actualMessage].scale;
                actualSprite.play();
            }
            else
            {
                if(actualSprite) actualSprite.visible = false;
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
                            if(actualMessage <= messages.length-1)
                            {
                                doMessaging();
                            }
                            else
                            {
                                st.removeChild(intro);
                                document.onkeyup = null;
                                Intro.onEnd();
                                Intro = null;
                            }

                        }
                        break;
                    case KEYCODE_ESCAPE:

                        st.removeChild(intro);
                        document.onkeyup = null;
                        Intro.onEnd();
                        Intro = null;
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


            intro = new createjs.Container();

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