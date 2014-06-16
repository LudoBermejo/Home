define(["world/map/totoro/Totoro", "world/map/portal/Portal", "world/map/book/Book", "preloadjs", "collisionDetection"], function (Totoro, Portal, Book) {
        //return an object to define the "my/shirt" module.

        var TechnologiesArea = {};

        var st;

        var mapData;

        var wTile;
        var hTile;

        var background;
        var arrayCollision = [];

        var customSprite;


        var layerObjects;
        var layerTotoros;
        var layerPortals;
        var layerBooks;

        var lastWebOpen;
        var cloudContainer;
        var techContainer;

        var originalPos = 0;
        var portal;

        TechnologiesArea.init = function (stage, load, internalName, backgroundImage) {


            Totoro.init(load);
            Portal.init(load);
            Book.init(load);

            this.message = null;

            var self = this;

            this.stopHeroMove = true;
            this.width = 0;
            this.height = 0;
            this.startPlayerPosition = {};

            background = new window.createjs.Container();


            function removeAll()
            {
                if (layerObjects) {
                    st.removeChild(layerObjects);
                    layerObjects = null;
                }



                st.removeChild(techContainer);
                st.removeChild(cloudContainer);
                st.removeChild(background);
                st.removeChild(portal);

                background = null;
                cloudContainer = null;
                techContainer = null;
                portal = null;


                if (layerPortals) {
                    st.removeChild(layerPortals);
                    layerTotoros = null;
                }
                if (layerTotoros) {
                    st.removeChild(layerTotoros);
                    layerTotoros = null;
                }

                st.removeChild(portal);

                if (layerBooks) {
                    st.removeChild(layerBooks);
                    layerBooks = null;
                }
                for (var j = 0; j <= self.onExitArea.length - 1; j++) {
                    self.onExitArea[j]();
                }
            }

            // layer initialization
            function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {


                var layer = new window.createjs.Container();

                layer.name = layerData.name;

                if (layerData.name.indexOf("Collision") > -1) {

                }
                for (var y = 0; y < layerData.height; y++) {

                    for (var x = 0; x < layerData.width; x++) {

                        // create a new Bitmap for each cell
                        var cellBitmap = new window.createjs.Sprite(tilesetSheet);
                        // layer data has single dimension array
                        var idx = x + y * layerData.width;
                        // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)

                        if (layerData.data[idx] - 1 > -1) {
                            cellBitmap.gotoAndStop(layerData.data[idx] - 1);
                            // isometrix tile positioning based on X Y order from Tiled
                            cellBitmap.x = x * tilewidth - (x);
                            cellBitmap.y = y * tileheight - (y);

                            //cellBitmap.setTransform(-1,-1)
                            // add bitmap to stage
                            layer.addChildAt(cellBitmap, 0);

                            if (layerData.name.indexOf("Collision") > -1) {
                                //var text = new window.createjs.Text(x + ":" + y, "10px Arial", "#ff7700"); text.x =  x * tilewidth; text.y = y* tileheight;
                                //layer.addChildAt(text, 0);

                                arrayCollision[x + ":" + y] = cellBitmap;
                                cellBitmap.name = layerData.name + ":" + x + ":" + y;


                            }

                        }


                    }


                }

                self.width = layerData.width * tilewidth - layerData.width * 2;
                self.height = layerData.height * tileheight - layerData.height * 2;




                var layer2 = layer.clone(true);
                layer2.x = self.width + 23;

                var layer3 = layer.clone(true);
                layer3.x = self.width * 2 + 46;

                background.addChild(layer);
                background.addChild(layer2);
                background.addChild(layer3);

            }

            this.moveOnHorizontal = function (speed) {

                originalPos += -speed;

                if (originalPos > 0) {
                    originalPos = 0;
                }
                else {
                    background.x += -speed;
                    portal.x += -speed;


                    moveClouds(-speed / 2);
                    moveSigns(-speed);
                    var maxMinPos = 0;
                    var toChange;
                    for (var i = 0; i <= background.getNumChildren() - 1; i++) {

                        var actual = background.getChildAt(i);

                        if (speed > 0) {
                            if (actual.x > maxMinPos) {
                                maxMinPos = actual.x;
                            }
                            if ((actual.x + self.width) + background.x < 0) {
                                toChange = actual;

                                background.x += self.width / 2;

                            }
                        }
                        else {
                            if (actual.x < maxMinPos) {
                                maxMinPos = actual.x;
                            }
                            if (background.x > -200) {
                                toChange = actual;

                                background.x -= self.width / 2;

                            }
                        }

                    }

                }
            }


            function initObjects(objects) {
                if (layerObjects == undefined) {
                    layerObjects = new window.createjs.Container();
                    layerTotoros = new window.createjs.Container();
                    layerPortals = new window.createjs.Container();
                    layerBooks = new window.createjs.Container();
                }


                for (var i = 0; i <= objects.length - 1; i++) {
                    var shape = new window.createjs.Shape();
                    shape.visible = false;
                    shape.graphics.beginFill("red").drawRect(0, 0, objects[i].width, objects[i].height);
                    shape.x = objects[i].x - objects[i].x / wTile;
                    shape.y = objects[i].y - objects[i].y / wTile;
                    shape.name = objects[i].name + "_" + objects[i].type;
                    shape.width = objects[i].width;
                    shape.height = objects[i].height;


                    layerObjects.addChild(shape)


                    if (objects[i].type == "Message") {
                        var totoro = Totoro.getClone();
                        layerTotoros.addChild(totoro);


                        totoro.x = shape.x + shape.width / 2 - Totoro.width() / 2;
                        totoro.y = shape.y + shape.height / 2 - Totoro.height() / 2;

                        totoro.gotoAndPlay(1);

                    }

                    else if (objects[i].type == "GotoArea") {
                        var portal = Portal.getClone();
                        layerPortals.addChild(portal)


                        portal.x = shape.x + shape.width / 2 - Totoro.width() / 2;
                        portal.y = shape.y + shape.height / 2 - Totoro.height() / 2;

                        portal.gotoAndPlay(1);
                    }
                    else if (objects[i].type == "StartPlayer") {
                        self.startPlayerPosition = {x: shape.x + shape.width / 2, y: shape.y + shape.height }
                    }
                    else if (objects[i].type == "OpenWeb") {
                        var book = Book.getClone();
                        layerBooks.addChild(book)


                        book.x = shape.x + shape.width / 2 - Book.width() / 2;
                        book.y = shape.y + shape.height / 2 - Book.height() / 2;

                        book.gotoAndPlay(1);
                    }


                }


            }


            this.onSpaceKey = function()
            {
                removeAll();
            }
            this.getCollision = function (obj, x, y) {


                var rectTrigger = { x: portal.x, y: portal.y, width: portal.width, height: portal.height}
                var collision = obj.x >= rectTrigger.x;

                if(collision)
                {
                   removeAll();


                }
                return collision;

            };

            function moveClouds(speed) {
                for (var i = 0; i <= cloudContainer.getNumChildren() - 1; i++) {

                    cloudContainer.getChildAt(i).x += speed
                }


            }

            function moveSigns(speed) {
                var arrayRemove = [];
                for (var i = 0; i <= techContainer.getNumChildren() - 1; i++) {

                    techContainer.getChildAt(i).x += speed
                }


            }


            function makeCloud() {
                var randomCloud = Math.round(Math.random() * 2 + 1);

                var img = load.getResult("Cloud" + randomCloud);
                var cloud = new createjs.Bitmap(img);

                cloud.scaleX = cloud.scaleY = 0.2;

                cloud.y = Math.random() * self.height / 2 - 10;

                if (cloud.y < 0) cloud.y = 0;
                cloud.width = img.width;
                cloud.height = img.height;

                cloud.x = self.width + cloud.width + 10;


                cloudContainer.addChild(cloud)
                return cloud;
            }

            function perhapsMakeCloud() {
                var randomTotal = Math.round(Math.random() * 20);

                if (randomTotal == 1) makeCloud();


            }

            function makeCloudsContainer(w) {

                cloudContainer = new createjs.Container();

                for (var i = 0; i <= 100; i++) {
                    var cloud = makeCloud();
                    cloud.x = Math.random() * w;
                }


                return cloudContainer;

            }

            function makeTechContainer() {
                techContainer = new createjs.Container();
                var techData = load.getResult("Technologies");
                var originalX = self.width;
                for (var i in techData) {

                    originalX += 100;
                    var w = makeSignalArea(i, originalX);

                    originalX += w + 100;

                    for (var j = 0; j <= techData[i].length - 1; j++) {
                        w = makeSignal(techData[i][j], originalX);
                        originalX += 100;
                    }
                }

                techContainer.width = originalX;

                return techContainer
            }

            function makeSignalArea(textO, pos) {
                var signBitmap = new window.createjs.Bitmap(load.getResult("SignArea"));
                signBitmap.x = pos;
                signBitmap.y = self.height / 2 - load.getResult("SignArea").height + 25;

                var text = new createjs.Text(textO, "16px  VT323", "#FFFFFF");
                text.x = signBitmap.x + load.getResult("SignArea").width / 2 - text.getMeasuredWidth() / 2;
                text.y = signBitmap.y + 21;
                text.textBaseline = "alphabetic";
                techContainer.addChild(signBitmap);
                techContainer.addChild(text);
                return load.getResult("SignArea").height;
            }

            function makeSignal(textO, pos) {
                var signBitmap = new window.createjs.Bitmap(load.getResult("Sign" + textO.level));
                signBitmap.x = pos;
                signBitmap.y = self.height / 2 - load.getResult("Sign" + textO.level).height + 25;

                var text = new createjs.Text(textO.title, "14px  VT323", "#FFFFFF");
                text.x = signBitmap.x + load.getResult("Sign" + textO.level).width / 2 - text.getMeasuredWidth() / 2;
                text.y = signBitmap.y + 21;
                text.textBaseline = "alphabetic";
                techContainer.addChild(signBitmap);
                techContainer.addChild(text);
                return load.getResult("Sign" + textO.level).height;
            }

            var checkIntersection = function (rect1, rect2) {
                if (rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y) return false;
                return true;
            }

            this.onChangeArea = null;

            this.onExitArea = null;

            this.getTriggers = function (obj) {




            };


            st = stage;

            mapData = load.getResult(internalName + "JSON");

            // compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
            wTile = mapData.tilesets[0].tilewidth;
            hTile = mapData.tilesets[0].tileheight;

            var imageData = {
                images: [ load.getResult("SecundaryImage") ],
                frames: {
                    width: wTile,
                    height: hTile
                }
            };
            // create spritesheet
            var tilesetSheet = new window.createjs.SpriteSheet(imageData);

            // loading each layer at a time
            for (var idx = 0; idx < mapData.layers.length; idx++) {
                var layerData = mapData.layers[idx];
                if (layerData.type === 'tilelayer') {
                    initLayer(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
                }
                else if (layerData.objects != undefined) {
                    initObjects(layerData.objects);
                }

            }

            background.x = -200;

            if (layerObjects) {
                st.addChild(layerObjects);
            }


            background.x = 0;
            st.addChild(background);


            if (layerTotoros) {
                st.addChild(layerTotoros);
            }


            if (layerBooks) {
                st.addChild(layerBooks);
            }


            makeTechContainer()
            st.addChild(makeCloudsContainer(techContainer.width))

            st.addChild(techContainer)

            portal = Portal.getClone();

            portal.x = techContainer.width;

            portal.y = self.height - self.height/4;
            portal.scaleX = 3;
            portal.scaleY = 3;
            portal.gotoAndPlay(1);

            st.addChild(portal);

            var lastTextFieldMessage = new window.createjs.Text("Press SPACE to exit", "24px VT323", "#ffffff");
            lastTextFieldMessage.x = 50;
            st.addChild(lastTextFieldMessage);


            background.cache(0, 0, mapData.tilewidth * mapData.width * 3, mapData.tileheight * mapData.height);

            var shape = new window.createjs.Shape();

            shape.width = self.width;
            shape.height = self.height;

            st.parent.addChild(shape)
            st.mask = shape;


        };


        return TechnologiesArea;
    }
);