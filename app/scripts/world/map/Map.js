define(["world/map/totoro/Totoro","world/map/portal/Portal","world/map/book/Book","world/map/areas/SecundaryArea","world/map/areas/TechnologiesArea","preloadjs", "collisionDetection"], function (Totoro, Portal, Book, SecundaryArea, TechnologiesArea) {
        //return an object to define the "my/shirt" module.

        var Map = {};

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
        var disabled;
        var lastArea = "";
        var lastWebOpen;



        Map.init = function (stage, load, mg) {


            Totoro.init(load);
            Portal.init(load);

            this.message = null;

            var self = this;

            background = new window.createjs.Container();
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


                background.addChild(layer);

            }

            function initObjects(objects) {
                if (layerObjects == undefined) {
                    layerObjects = new window.createjs.Container();
                    layerTotoros = new window.createjs.Container();
                    layerPortals = new window.createjs.Container();
                }


                for (var i = 0; i <= objects.length - 1; i++) {
                    var shape = new window.createjs.Shape();
                    shape.visible = false;
                    shape.graphics.beginFill("red").drawRect(0, 0, objects[i].width, objects[i].height);
                    shape.x = objects[i].x - objects[i].x / wTile;
                    shape.y = objects[i].y - objects[i].y / wTile
                    shape.name = objects[i].name + "_" + objects[i].type;
                    shape.width = objects[i].width;
                    shape.height = objects[i].height;


                    layerObjects.addChild(shape)


                    if(objects[i].type == "Message")
                    {
                        var totoro = Totoro.getClone();
                        layerTotoros.addChild(totoro)


                        totoro.x = shape.x + shape.width/2 - Totoro.width()/2;
                        totoro.y = shape.y + shape.height/2 - Totoro.height()/2;

                        totoro.gotoAndPlay(1);

                    }

                    else

                    {
                        var portal = Portal.getClone();
                        layerPortals.addChild(portal)


                        portal.x = shape.x + shape.width/2 - Totoro.width()/2;
                        portal.y = shape.y + shape.height/2 - Totoro.height()/2;

                        portal.gotoAndPlay(1);
                    }








                }


            }



            this.getCollision = function (obj, x, y) {


                if(disabled) return false;
                if (customSprite === undefined) {
                    customSprite = obj.clone();

                    customSprite.scaleX = customSprite.scaleY = 0.5;
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

                    customSprite.x = obj.x + (obj.width / 2 - obj.width * 0.5 / 2);
                    customSprite.y = obj.y + (obj.height / 2 - obj.height * 0.5 / 2);

                    customSprite.x += x;
                    customSprite.y += y;


                    for (i = 0; i <= arrayCheck.length - 1; i++) {
                        var collision = window.ndgmr.checkPixelCollision(arrayCheck[i], customSprite, 0, true);


                        if (collision) {
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

            this.disable = function()
            {
                disabled = true;

                for(var i=0;i<=layerTotoros.getNumChildren()-1;i++)
                {
                    layerTotoros.getChildAt(i).stop();
                }

                for(i=0;i<=layerPortals.getNumChildren()-1;i++)
                {
                    layerPortals.getChildAt(i).stop();
                }
            }

            this.enable = function()
            {
                disabled = false;

                for(var i=0;i<=layerTotoros.getNumChildren()-1;i++)
                {
                    layerTotoros.getChildAt(i).gotoAndPlay(1);
                }

                for(i=0;i<=layerPortals.getNumChildren()-1;i++)
                {
                    layerPortals.getChildAt(i).gotoAndPlay(1);
                }
            }


            this.onChangeArea = null;

            this.getTriggers = function (obj) {

                if(disabled) return false;
                var rectHero = obj.getBounds();
                rectHero.x = obj.x;
                rectHero.y = obj.y;
                var hasLastArea = false;
                for (var i = 0; i <= layerObjects.getNumChildren() - 1; i++) {



                    var rectTrigger = { x: layerObjects.getChildAt(i).x, y: layerObjects.getChildAt(i).y, width: layerObjects.getChildAt(i).width, height: layerObjects.getChildAt(i).height}


                    var collision = checkIntersection(rectHero, rectTrigger)


                    if (collision) {



                        if(layerObjects.getChildAt(i).name.split("_")[1] == "Message") {
                            self.message.draw(layerObjects.getChildAt(i).name.split("_")[0])
                        }
                        else if(layerObjects.getChildAt(i).name.split("_")[1] == "OpenWeb") {

                            if(lastWebOpen !== layerObjects.getChildAt(i).name.split("_")[0])
                            {
                                lastWebOpen = layerObjects.getChildAt(i).name.split("_")[0]
                                window.createjs.Ticker.setPaused(true);
                                document.getElementById("info").innerHTML = load.getResult(lastWebOpen);
                                document.getElementById("info").style.display="";
                                document.getElementById("info").focus();
                            }
                        }
                        else if(layerObjects.getChildAt(i).name.split("_")[1] == "GotoArea") {


                            var checkName = layerObjects.getChildAt(i).name.split("_")[0].split("&")[0];
                            var backgroundName= layerObjects.getChildAt(i).name.split("_")[0].split("&")[1];

                            if(lastArea != checkName ) {

                                lastArea = checkName;
                                hasLastArea = true;

                                if(checkName != "Technologies") {
                                    var area = SecundaryArea;
                                }
                                else
                                {
                                    var area = TechnologiesArea;
                                }

                                self.disable();

                                var areaContainer = new window.createjs.Container();
                                var grey = new window.createjs.Shape();

                                grey.graphics.beginFill("darkgray").drawRect(0, 0, stage.width, stage.height);
                                grey.alpha = .5;

                                st.addChild(grey);


                                stage.addChild(areaContainer);

                                areaContainer.scaleX = areaContainer.scaleY = 2;

                                area.init(areaContainer, load, checkName,backgroundName);
                                areaContainer.width = area.width;
                                areaContainer.height = area.height;

                                area.onExitArea = [];
                                area.onExitArea.push(function () {
                                    st.removeChild(grey);
                                    while (area.container.length) {
                                        area.container.removeChildAt(0);
                                    }

                                    st.removeChild(areaContainer);


                                    self.enable();
                                })

                                area.message = self.message;
                                areaContainer.x = stage.width / 2 - area.width * areaContainer.scaleX / 2;
                                areaContainer.y = stage.height / 2 - area.height * areaContainer.scaleY / 2;

                                area.container = areaContainer;

                                self.onChangeArea(area);

                            }
                            else
                            {
                                hasLastArea = true;
                            }




                        }



                        if(!hasLastArea) lastArea = null;
                        return true;
                    }

                }

                if(!hasLastArea) lastArea = null;

                self.message.undraw();


            };


            st = stage;

            mapData = load.getResult("MapJSON");

            // compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
            wTile = mapData.tilesets[0].tilewidth;
            hTile = mapData.tilesets[0].tileheight;

            var imageData = {
                images: [ load.getResult("MapImage") ],
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

            background.cache(0, 0, mapData.tilewidth * mapData.width, mapData.tileheight * mapData.height);

        };


        return Map;
    }
);