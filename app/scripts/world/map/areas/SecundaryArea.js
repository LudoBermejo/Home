define(["world/map/totoro/Totoro", "world/map/portal/Portal", "world/map/book/Book", "preloadjs", "collisionDetection"], function (Totoro, Portal, Book) {
        //return an object to define the "my/shirt" module.

        var SecundaryArea = {};

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


        SecundaryArea.init = function (stage, load, internalName, backgroundImage) {


            Totoro.init(load);
            Portal.init(load);
            Book.init(load);

            this.message = null;

            var self = this;

            this.width = 0;
            this.height = 0;
            this.startPlayerPosition = {};

            background = new window.createjs.Container();

            if(backgroundImage)
            {
                background.addChild(new createjs.Bitmap(load.getResult(backgroundImage)));
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

                self.width = layerData.width * tilewidth - layerData.width*2;
                self.height = layerData.height * tileheight - layerData.height*2;




                background.addChild(layer);

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

                    else if (objects[i].type == "GotoArea")
                    {
                        var portal = Portal.getClone();
                        layerPortals.addChild(portal)


                        portal.x = shape.x + shape.width / 2 - Totoro.width() / 2;
                        portal.y = shape.y + shape.height / 2 - Totoro.height() / 2;

                        portal.gotoAndPlay(1);
                    }
                    else if (objects[i].type == "StartPlayer")
                    {
                        self.startPlayerPosition = {x: shape.x + shape.width / 2, y: shape.y + shape.height }
                    }
                    else if (objects[i].type == "OpenWeb")
                    {
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

            }

            this.getCollision = function (obj, x, y) {

                if (customSprite === undefined) {
                    customSprite = obj.clone();

                    //customSprite.scaleX = customSprite.scaleY = 0.5;
                    customSprite.visible = false;


                    stage.addChild(customSprite);

                }


                var rect = obj.getBounds();

                rect.x = Math.floor((obj.x + x) / (wTile - 1));
                rect.y = Math.floor((obj.y + y) / (hTile - 1));
                rect.width = Math.ceil((rect.width + x) / (wTile - 1));
                rect.height = Math.ceil((rect.height + y) / (hTile - 1));


                var arrayCheck = [];

                for (var i = rect.x; i <= rect.x + rect.width; i++) {
                    for (var j = rect.y; j <= rect.y + rect.height; j++) {

                        if (arrayCollision[i + ":" + j] !== undefined) {
                            arrayCheck.push(arrayCollision[i + ":" + j]);
                        }
                    }
                }


                if (arrayCheck.length) {

                    customSprite.x = obj.x;// + (obj.width / 2 - obj.width * 0.5 / 2);
                    customSprite.y = obj.y;// + (obj.height / 2 - obj.height * 0.5 / 2);

                    customSprite.x += x;
                    customSprite.y += y;


                    for (i = 0; i <= arrayCheck.length - 1; i++) {
                        var collision = window.ndgmr.checkPixelCollision(arrayCheck[i], customSprite, 0, true);


                        if (collision) {

                            if(x > 0 && ((collision.x) > customSprite.x + obj.width/4))
                                return true;

                            if(x < 0 && ((collision.x) > customSprite.x ))
                                return true;

                            if(y > 0 && ((collision.y) > customSprite.y + obj.height/2))
                                return true;

                            if(y < 0 && ((collision.y) > customSprite.y ))
                                return true;
                        }

                    }


                }


                return false;

            };

            var checkIntersection = function (rect1, rect2) {
                if (rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y) return false;
                return true;
            }

            this.onChangeArea = null;

            this.onExitArea = null;

            this.getTriggers = function (obj) {

                var rectHero = obj.getBounds();
                rectHero.x = obj.x;
                rectHero.y = obj.y;
                for (var i = 0; i <= layerObjects.getNumChildren() - 1; i++) {


                    var rectTrigger = { x: layerObjects.getChildAt(i).x, y: layerObjects.getChildAt(i).y, width: layerObjects.getChildAt(i).width, height: layerObjects.getChildAt(i).height}


                    var collision = checkIntersection(rectHero, rectTrigger)



                    if (collision) {

                        console.log(layerObjects.getChildAt(i).name);

                        if (layerObjects.getChildAt(i).name.split("_")[1] == "Message") {
                            self.message.draw(layerObjects.getChildAt(i).name.split("_")[0])
                        }
                        else if(layerObjects.getChildAt(i).name.split("_")[1] == "GotoArea") {

                            if(layerObjects.getChildAt(i).name.split("_")[0] == "Exit")
                            {
                                if (layerObjects) {
                                    st.removeChild(layerObjects);
                                    layerObjects = null;
                                }


                                st.removeChild(background);
                                background = null;

                                if (layerTotoros) {
                                    st.removeChild(layerTotoros);
                                    layerTotoros = null;
                                }

                                if (layerPortals) {
                                    st.removeChild(layerPortals);
                                    layerPortals = null;
                                }

                                if (layerBooks) {
                                    st.removeChild(layerBooks);
                                    layerBooks = null;
                                }
                                for(var j= 0;j<=self.onExitArea.length-1;j++)
                                {


                                    self.onExitArea[j]();
                                }
                            }

                        }
                        else if(layerObjects.getChildAt(i).name.split("_")[1] == "OpenWeb") {

                            if(lastWebOpen !== layerObjects.getChildAt(i).name.split("_")[0])
                            {
                                lastWebOpen = layerObjects.getChildAt(i).name.split("_")[0]
                                window.createjs.Ticker.setPaused(true);
                                document.getElementById("info").innerHTML = load.getResult(lastWebOpen);
                                document.getElementById("info").style.display="";
                            }
                        }
                        else
                        {
                            lastWebOpen = null;
                        }

                        return true;
                    }

                }

                self.message.undraw();


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


            if (layerObjects) {
                st.addChild(layerObjects);
            }


            st.addChild(background);


            if (layerTotoros) {
                st.addChild(layerTotoros);
            }

            if (layerPortals) {
                st.addChild(layerPortals);
            }

            if (layerBooks) {
                st.addChild(layerBooks);
            }

            background.cache(0, 0, mapData.tilewidth * mapData.width, mapData.tileheight * mapData.height);

        };


        return SecundaryArea;
    }
);