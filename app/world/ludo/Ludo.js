define(["preloadjs", "collisionDetection"], function () {
        //return an object to define the "my/shirt" module.

        var Ludo = {};

        var st;
        var w;
        var h;
        var spriteLudo;

        var loader;
        var hasMoveLeft;
        var hasMoveRight;
        var hasMoveDown;
        var hasMoveUp;

        var speed = 15;

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
                    var e = window.event;
                }
                switch (e.keyCode) {
                    case KEYCODE_UP:
                    case KEYCODE_S:
                        hasMoveUp = true; break;
                    case KEYCODE_DOWN:
                    case KEYCODE_A:
                        hasMoveDown = true;break;
                    case KEYCODE_LEFT:
                    case KEYCODE_D:
                        hasMoveLeft = true;break;
                    case KEYCODE_RIGHT:
                    case KEYCODE_W:
                        hasMoveRight = true;break;

                    default:
                        console.log("NONE")
                }
            }

            function handleKeyUp(e) {
                if (!e) {
                    var e = window.event;
                }
                switch (e.keyCode) {
                    case KEYCODE_UP:
                    case KEYCODE_S:
                        hasMoveUp = false;break;
                    case KEYCODE_DOWN:
                    case KEYCODE_A:
                        hasMoveDown = false;break;
                    case KEYCODE_LEFT:
                    case KEYCODE_D:
                        hasMoveLeft = false;break;
                    case KEYCODE_RIGHT:
                    case KEYCODE_W:
                        hasMoveRight = false;break;

                    default:
                        console.log("NONE")
                }

            }

            document.onkeydown = handleKeyDown;
            document.onkeyup = handleKeyUp;
        }

        var createSprite = function () {
            var data = {
                images: [loader.getResult("Ludo")],
                frames: {width: 32, height: 48},
                animations: {stop: [0], down: [0, 3], left: [4, 7], right: [8, 11], up: [12, 15]}
            };
            var spriteSheetLudo = new createjs.SpriteSheet(data);


            spriteLudo = new createjs.Sprite(spriteSheetLudo, "stop");
            spriteLudo.x = 0;
            spriteLudo.y = 0 ;
            spriteLudo.framerate = 5;



            st.addChild(spriteLudo);
            console.log(st);
        }



        Ludo.init = function (stage, load) {

            st = stage;
            loader = load;

            // grab canvas width and height for later calculations:
            w = stage.canvas.width;
            h = stage.canvas.height;

            createSprite();
            createKeyboard();


        }


        Ludo.movement = function() {


            if (hasMoveUp) {
                if(spriteLudo.currentAnimation != "up")
                    spriteLudo.gotoAndPlay("up",1);
                spriteLudo.y -= speed
            }
            else if (hasMoveDown) {
                if(spriteLudo.currentAnimation != "down")
                    spriteLudo.gotoAndPlay("down",1);
                spriteLudo.y += speed
            }

            if (hasMoveLeft) {
                if(!hasMoveUp && !hasMoveDown)
                    if(spriteLudo.currentAnimation != "left")
                        spriteLudo.gotoAndPlay("left",1);
                spriteLudo.x -= speed
            }
            else if (hasMoveRight) {
                if(!hasMoveUp && !hasMoveDown)
                    if(spriteLudo.currentAnimation != "right")
                        spriteLudo.gotoAndPlay("right",1);
                spriteLudo.x += speed
            }

            if(!hasMoveUp && !hasMoveDown && !hasMoveRight && !hasMoveLeft) spriteLudo.currentAnimationFrame = 0;


        }


        return Ludo;
    }
);