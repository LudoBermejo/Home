define(["preloadjs", "collisionDetection"], function () {
        //return an object to define the "my/shirt" module.

        var Ludo = {};

        var st;
        var w;
        var h;

        var wLudo = 32;
        var hLudo = 48;
        var spriteLudo;

        var loader;
        var hasMoveLeft;
        var hasMoveRight;
        var hasMoveDown;
        var hasMoveUp;

        var getCollision;
        var getTriggers;

        var speed = 5;

        var KEYCODE_UP = 38;		//usefull keycode
        var KEYCODE_DOWN = 40;		//usefull keycode
        var KEYCODE_LEFT = 37;		//usefull keycode
        var KEYCODE_RIGHT = 39;		//usefull keycode
        var KEYCODE_W = 87;			//usefull keycode
        var KEYCODE_A = 65;			//usefull keycode
        var KEYCODE_D = 68;			//usefull keycode
        var KEYCODE_S = 83;			//usefull keycode


        var createKeyboard = function () {
            //allow for WASD and arrow control scheme
            function handleKeyDown(e) {
                //cross browser issues exist
                if (!e) {
                    e = window.event;
                }
                switch (e.keyCode) {
                    case KEYCODE_UP:
                    case KEYCODE_S:
                        hasMoveUp = true;
                        break;
                    case KEYCODE_DOWN:
                    case KEYCODE_A:
                        hasMoveDown = true;
                        break;
                    case KEYCODE_LEFT:
                    case KEYCODE_D:
                        hasMoveLeft = true;
                        break;
                    case KEYCODE_RIGHT:
                    case KEYCODE_W:
                        hasMoveRight = true;
                        break;

                    default:
                }
            }

            function handleKeyUp(e) {
                if (!e) {
                    e = window.event;
                }
                switch (e.keyCode) {
                    case KEYCODE_UP:
                    case KEYCODE_S:
                        hasMoveUp = false;
                        break;
                    case KEYCODE_DOWN:
                    case KEYCODE_A:
                        hasMoveDown = false;
                        break;
                    case KEYCODE_LEFT:
                    case KEYCODE_D:
                        hasMoveLeft = false;
                        break;
                    case KEYCODE_RIGHT:
                    case KEYCODE_W:
                        hasMoveRight = false;
                        break;

                    default:
                }

            }

            document.onkeydown = handleKeyDown;
            document.onkeyup = handleKeyUp;
        };

        var createSprite = function () {
            var data = {
                images: [loader.getResult("Ludo")],
                frames: {width: wLudo, height: hLudo},
                animations: {stop: [0], down: [0, 3], left: [4, 7], right: [8, 11], up: [12, 15]},
                framerate: 180
            };
            var spriteSheetLudo = new window.createjs.SpriteSheet(data);

            spriteLudo = new window.createjs.Sprite(spriteSheetLudo, "stop");

            spriteLudo.scaleX = spriteLudo.scaleY *= 0.8;
            spriteLudo.x = 0;
            spriteLudo.y = 0;

            spriteLudo.width = wLudo * spriteLudo.scaleX;
            spriteLudo.height = hLudo * spriteLudo.scaleY;

            spriteLudo.x = 0;

            spriteLudo.y = 100;


            st.addChild(spriteLudo);
        };


        Ludo.init = function (stage, load, gc, gt) {

            st = stage;
            loader = load;
            getCollision = gc;
            getTriggers = gt;

            // grab canvas width and height for later calculations:
            w = stage.canvas.width;
            h = stage.canvas.height;

            createSprite();
            createKeyboard();


        };



        Ludo.movement = function () {


            if (hasMoveUp) {
                if (spriteLudo.currentAnimation !== "up") {
                    spriteLudo.gotoAndPlay("up", 1);
                }


                if (!getCollision(spriteLudo,0,-speed)) {
                    spriteLudo.y -= speed;
                    getTriggers(spriteLudo);
                    st.customUpdate();

                }
            }
            else if (hasMoveDown) {
                if (spriteLudo.currentAnimation !== "down") {
                    spriteLudo.gotoAndPlay("down", 1);
                }

                if (!getCollision(spriteLudo,0, speed)) {
                    spriteLudo.y += speed;
                    getTriggers(spriteLudo);
                    st.customUpdate();
                }
            }

            if (hasMoveLeft) {
                if (!hasMoveUp && !hasMoveDown) {
                    if (spriteLudo.currentAnimation !== "left") {
                        spriteLudo.gotoAndPlay("left", 1);
                    }
                }

                if (!getCollision(spriteLudo,-speed,0)) {
                    spriteLudo.x -= speed;
                    getTriggers(spriteLudo);
                    st.customUpdate();
                }
            }
            else if (hasMoveRight) {
                if (!hasMoveUp && !hasMoveDown) {
                    if (spriteLudo.currentAnimation !== "right") {
                        spriteLudo.gotoAndPlay("right", 1);
                    }
                }

                if (!getCollision(spriteLudo,speed,0)) {
                    spriteLudo.x += speed;
                    getTriggers(spriteLudo);
                    st.customUpdate();
                }
            }

            if (!hasMoveUp && !hasMoveDown && !hasMoveRight && !hasMoveLeft) {spriteLudo.currentAnimationFrame = 0;}


        };


        return Ludo;
    }
)
;