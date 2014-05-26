define(["preloadjs"], function () {
        //return an object to define the "my/shirt" module.

        var Map = {};

        var st;

        var mapData;


        var background;

        var collision = new Array();


        Map.init = function (stage, load) {

            background = new createjs.Container();
            // layer initialization
            function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {


                var layer = new createjs.Container;
                for ( var y = 0; y < layerData.height; y++) {

                    for ( var x = 0; x < layerData.width; x++) {

                        // create a new Bitmap for each cell
                        var cellBitmap = new createjs.Sprite(tilesetSheet);
                        // layer data has single dimension array
                        var idx = x + y * layerData.width;
                        // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)

                        cellBitmap.gotoAndStop(layerData.data[idx] - 1);
                        // isometrix tile positioning based on X Y order from Tiled
                        cellBitmap.x = x * tilewidth - (x);

                        cellBitmap.y = y * tileheight - (y);

                        //cellBitmap.setTransform(-1,-1)
                        // add bitmap to stage
                        layer.addChildAt(cellBitmap,0);


                        if(layerData.name.indexOf("Collision") >-1)
                        {
                            var text = new createjs.Text(x + ":" + y, "10px Arial", "#ff7700"); text.x =  x * tilewidth; text.y = y* tileheight;

                            if(layerData.data[idx]  != 0)
                            {


                                if(collision[x] == undefined)
                                {
                                    collision[x] = new Array();
                                }

                                collision[x][y] = true;

                                console.log("Añdo en " + x + ":" + y)


                            }

                            layer.addChildAt(text, 0);
                        }




                    }


                }

                background.addChild(layer);

            }

            this.getCollision = function(obj)
            {

                return (collision[obj.x][obj.y] !=  undefined);
            }


            st = stage;
            loader = load;

            mapData = load.getResult("MapJSON");

            // compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
            var w = mapData.tilesets[0].tilewidth;
            var h = mapData.tilesets[0].tileheight;

            var imageData = {
                images : [ load.getResult("MapImage") ],
                frames : {
                    width : w+1,
                    height : h+1
                }
            };
            // create spritesheet
            var tilesetSheet = new createjs.SpriteSheet(imageData);

            // loading each layer at a time
            for (var idx = 0; idx < mapData.layers.length; idx++) {
                var layerData = mapData.layers[idx];
                if (layerData.type == 'tilelayer')
                    initLayer(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
            }

            st.addChild(background)

        }



        return Map;
    }
);