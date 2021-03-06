define(["preloadjs", "collisionDetection"], function () {
        //return an object to define the "my/shirt" module.

        var Ludo = {};

        var st;
        var w;
        var h;

        var wLudo = 32;
        var hLudo = 48;
        var spriteLudo;

        var stopHeroMove = false;
        var loader;
        var hasMoveLeft;
        var hasMoveRight;
        var hasMoveDown;
        var hasMoveUp;

        var onSpaceKey;

        var getCollision;
        var getTriggers;

        var speed = 5;

        var moveOnHorizontal;

        var KEYCODE_SPACE = 32;		//usefull keycode
        var KEYCODE_UP = 38;		//usefull keycode
        var KEYCODE_DOWN = 40;		//usefull keycode
        var KEYCODE_LEFT = 37;		//usefull keycode
        var KEYCODE_RIGHT = 39;		//usefull keycode
        var KEYCODE_W = 87;			//usefull keycode
        var KEYCODE_A = 65;			//usefull keycode
        var KEYCODE_D = 68;			//usefull keycode
        var KEYCODE_S = 83;			//usefull keycode


        var actualPath = [];
        var originalData = {};

        var enabled = true;
        var autoMove = false;
        var cSprite;
        var wTile;
        var hTile;


        var createKeyboard = function () {

            //allow for WASD and arrow control scheme
            function handleKeyDown(e) {

                function getPos(el) {
                    var my = el;
                    // yay readability
                    for (var lx = 0, ly = 0;
                         el != null;
                         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
                    return {x: lx, y: ly, width: my.offsetWidth, height: my.offsetTop};
                }

                //cross browser issues exist
                if (!e) {
                    e = window.event;
                }

                if (document.getElementById("timeline")) {
                    var timeline = document.getElementById("timeline");

                    for (var i = 0; i <= timeline.getElementsByClassName("radio").length - 1; i++) {
                        if (timeline.getElementsByClassName("radio")[i].checked) {
                            var before = i - 1;
                            var after = i + 1;
                            if (before < 0) before = 0;
                            if (after > timeline.getElementsByClassName("radio").length - 1) after = timeline.getElementsByClassName("radio").length - 1;

                            var current = timeline.getElementsByClassName("radio")[i];
                            before = timeline.getElementsByClassName("radio")[before];
                            after = timeline.getElementsByClassName("radio")[after];
                            break;
                        }
                    }

                }

                switch (e.keyCode) {
                    case KEYCODE_SPACE:
                        if (onSpaceKey) onSpaceKey();
                        window.createjs.Ticker.setPaused(false);
                        document.getElementById("info").style.display = "none";
                        break;
                    case KEYCODE_UP:
                    case KEYCODE_W:
                        if (before) {
                            current.checked = false;
                            before.checked = true;

                            if (getPos(after.parentNode).y + getPos(document.getElementById("timeline")).y < parseInt(st.canvas.height)) {
                                document.getElementById("info").scrollTop -= 200;
                            }
                        }

                        hasMoveUp = true;
                        break;
                    case KEYCODE_DOWN:
                    case KEYCODE_S:
                        if (after) {
                            current.checked = false;
                            after.checked = true;
                            if (getPos(after.parentNode).y > parseInt(st.canvas.height) - getPos(document.getElementById("timeline")).y) {
                                document.getElementById("info").scrollTop += 200;
                            }

                        }
                        hasMoveDown = true;
                        break;
                    case KEYCODE_LEFT:
                    case KEYCODE_A:
                        if (before) {
                            current.checked = false;
                            before.checked = true;
                        }
                        hasMoveLeft = true;
                        break;
                    case KEYCODE_RIGHT:
                    case KEYCODE_D:
                        if (after) {
                            current.checked = false;
                            after.checked = true;
                            if (getPos(after.parentNode).y > parseInt(st.canvas.height) - getPos(document.getElementById("timeline")).y) {
                                document.getElementById("info").scrollTop += 200;
                            }
                        }
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

            spriteLudo.scaleX = spriteLudo.scaleY *= 0.67;
            spriteLudo.x = 0;
            spriteLudo.y = 0;

            spriteLudo.width = wLudo * spriteLudo.scaleX;
            spriteLudo.height = hLudo * spriteLudo.scaleY;

            spriteLudo.x = 0;

            spriteLudo.y = 100;


            st.addChild(spriteLudo);
        };

        Ludo.setEnabled = function (b) {
            enabled = b;
        }


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

            getCollision(spriteLudo, 0, 0);
        };


        Ludo.changeArea = function (area) {
            moveOnHorizontal = area.moveOnHorizontal;
            stopHeroMove = area.stopHeroMove

            onSpaceKey = area.onSpaceKey;
            originalData = {x: spriteLudo.x, y: spriteLudo.y, scale: spriteLudo.scaleX, lastSpeed: speed, getCollision: getCollision, getTriggers: getTriggers, stage: spriteLudo.parent};

            spriteLudo.scaleX = spriteLudo.scaleY = 1;
            spriteLudo.width = wLudo * spriteLudo.scaleX;
            spriteLudo.height = hLudo * spriteLudo.scaleY;

            spriteLudo.framerate = 10;

            spriteLudo.gotoAndStop("stop");

            //speed *= 1.5;

            getCollision = area.getCollision;
            getTriggers = area.getTriggers;

            area.onExitArea.push(function () {
                moveOnHorizontal = null;
                stopHeroMove = false;
                onSpaceKey = null;
                hasMoveRight = hasMoveLeft = hasMoveDown = hasMoveUp = false;
                spriteLudo.scaleX = spriteLudo.scaleY = originalData.scale;
                spriteLudo.width = wLudo * spriteLudo.scaleX;
                spriteLudo.height = hLudo * spriteLudo.scaleY;

                spriteLudo.x = originalData.x;
                spriteLudo.y = originalData.y;
                speed = originalData.lastSpeed;
                getCollision = originalData.getCollision;
                getTriggers = originalData.getTriggers;

                originalData.stage.addChild(spriteLudo);
            });


            if (area.startPlayerPosition != null) {
                spriteLudo.x = area.startPlayerPosition.x;
                spriteLudo.y = area.startPlayerPosition.y;
            }

            area.container.addChild(spriteLudo)


            getCollision(spriteLudo,0,0);
        }

        Ludo.gotoPath = function (path, customSprite, w, h) {
            enabled = false;
            autoMove = true;

            actualPath = path;
            cSprite = customSprite;
            wTile = w;
            hTile = h;
        }

        function doAutoMove() {
            if (actualPath.length == 0) {
                enabled = true;
                autoMove = false;
                getTriggers(spriteLudo);
                spriteLudo.gotoAndStop("stop");

            }
            else {
                var x = Math.floor((cSprite.x) / (wTile - 1));
                var y = Math.floor((cSprite.y) / (hTile - 1));

                var xSpeed = 0;
                var ySpeed = 0;
                if (x < actualPath[0].x) {
                    xSpeed = speed*2;
                }

                if (x > actualPath[0].x) {
                    xSpeed = -speed*2;
                }

                if (y < actualPath[0].y) {
                    ySpeed = speed*2;
                }

                if (y > actualPath[0].y) {
                    ySpeed = -speed*2;
                }

                if (xSpeed == 0 && ySpeed == 0) {
                    actualPath.shift();


                    spriteLudo.currentAnimationFrame = 0;

                }
                else {
                    cSprite.x += xSpeed;
                    cSprite.y += ySpeed;

                    spriteLudo.x = cSprite.x;
                    spriteLudo.y = cSprite.y - spriteLudo.height/2;





                    if (ySpeed < 0) {

                        if (spriteLudo.currentAnimation !== "up") {
                            spriteLudo.gotoAndPlay("up", 1);
                        }

                    }
                    else if (ySpeed > 0) {
                        if (spriteLudo.currentAnimation !== "down") {
                            spriteLudo.gotoAndPlay("down", 1);
                        }

                    }

                    if (xSpeed < 0) {
                        if (!hasMoveUp && !hasMoveDown) {
                            if (spriteLudo.currentAnimation !== "left") {

                                spriteLudo.gotoAndPlay("left", 1);
                            }
                        }

                    }
                    else if (xSpeed > 0) {
                        if (!hasMoveUp && !hasMoveDown) {
                            if (spriteLudo.currentAnimation !== "right") {
                                console.log("DERECHA")
                                spriteLudo.gotoAndPlay("right");
                            }
                        }

                    }

                }
            }
        }

        Ludo.movement = function () {

            if (autoMove) {
                doAutoMove();
                return;
            }

            if (hasMoveUp) {

                if (spriteLudo.currentAnimation !== "up") {
                    spriteLudo.gotoAndPlay("up", 1);
                }


                if (!getCollision(spriteLudo, 0, -speed) && (spriteLudo.y - speed > 0)) {

                    if (!stopHeroMove) {
                        spriteLudo.y -= speed;
                        getTriggers(spriteLudo);
                    }
                }
            }
            else if (hasMoveDown) {
                if (spriteLudo.currentAnimation !== "down") {
                    spriteLudo.gotoAndPlay("down", 1);
                }

                if (!getCollision(spriteLudo, 0, speed) && (spriteLudo.y + speed < spriteLudo.parent.height)) {

                    if (!stopHeroMove) {
                        spriteLudo.y += speed;
                        getTriggers(spriteLudo);
                    }

                }
            }

            if (hasMoveLeft) {
                if (!hasMoveUp && !hasMoveDown) {
                    if (spriteLudo.currentAnimation !== "left") {
                        spriteLudo.gotoAndPlay("left", 1);
                    }
                }


                if (!getCollision(spriteLudo, -speed, 0) && (spriteLudo.x - speed > 0)) {
                    if (!stopHeroMove) {
                        spriteLudo.x -= speed;
                        getTriggers(spriteLudo);
                    }

                    if (moveOnHorizontal) moveOnHorizontal(-speed);

                }
            }
            else if (hasMoveRight) {
                if (!hasMoveUp && !hasMoveDown) {
                    if (spriteLudo.currentAnimation !== "right") {
                        spriteLudo.gotoAndPlay("right");
                    }
                }


                if (!getCollision(spriteLudo, speed, 0) && (spriteLudo.x + speed < spriteLudo.parent.width)) {
                    if (!stopHeroMove) {
                        spriteLudo.x += speed;
                        getTriggers(spriteLudo);
                    }

                    if (moveOnHorizontal) moveOnHorizontal(speed);
                }
            }

            if (!hasMoveUp && !hasMoveDown && !hasMoveRight && !hasMoveLeft) {

                spriteLudo.currentAnimationFrame = 0;
                spriteLudo.gotoAndStop("stop");

            }


        };


        return Ludo;
    }
)
;