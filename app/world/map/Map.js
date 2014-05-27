define(["preloadjs"], function () {
        //return an object to define the "my/shirt" module.

        var Map = {};

        var st;

        var mapData;

        var wTile;
        var hTile;

        var background;
        var arrayCollision = [];
        var border;



        Map.init = function (stage, load) {

            border = new createjs.Shape();
            background = new createjs.Container();
            // layer initialization
            function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {



                var layer = new createjs.Container;

                layer.name =layerData.name;

                if(layerData.name.indexOf("Collision") >-1)
                {

                }
                for ( var y = 0; y < layerData.height; y++) {

                    for ( var x = 0; x < layerData.width; x++) {

                        // create a new Bitmap for each cell
                        var cellBitmap = new createjs.Sprite(tilesetSheet);
                        // layer data has single dimension array
                        var idx = x + y * layerData.width;
                        // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)

                        if(layerData.data[idx] - 1 > -1) {
                            cellBitmap.gotoAndStop(layerData.data[idx] - 1);
                            // isometrix tile positioning based on X Y order from Tiled
                            cellBitmap.x = x * tilewidth - (x);

                            cellBitmap.y = y * tileheight - (y);

                            //cellBitmap.setTransform(-1,-1)
                            // add bitmap to stage
                            layer.addChildAt(cellBitmap, 0);

                            if(layerData.name.indexOf("Collision") >-1)
                            {
                                //var text = new createjs.Text(x + ":" + y, "10px Arial", "#ff7700"); text.x =  x * tilewidth; text.y = y* tileheight;
                                //layer.addChildAt(text, 0);

                                arrayCollision[x + ":" + y] = cellBitmap;


                            }

                        }





                    }


                }

                background.addChild(layer);

            }

            var checkIntersection = function(rect1,rect2) {
                if ( rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y ) return false;
                return true;
            }

            this.getCollision = function(obj, x, y)
            {

                var rect = obj.getBounds();

                console.log(rect);
                rect.x = Math.floor(obj.x/(wTile));
                rect.y = Math.floor(obj.y/(hTile));
                rect.width = Math.ceil((rect.width)/(wTile))+1;
                rect.height = Math.ceil((rect.height)/(hTile))+1;

                border.graphics.clear();
                border.graphics.beginStroke("#000");
                border.graphics.setStrokeStyle(1);
                border.snapToPixel = true;
                border.graphics.drawRect(0, 0, rect.width*wTile, rect.height*wTile);
                border.x = rect.x*wTile;
                border.y = rect.y*hTile;

                stage.addChild(border);


                var arrayCheck = [];

                console.log("---")
                console.log(rect.x)
                console.log(rect.width)
                for(var i= rect.x;i<=rect.x+rect.width;i++)
                {
                    for(var j=rect.y;j<=rect.y+rect.height;j++)
                    {
                        console.log("Busco " + i + ":" + j)

                        if(arrayCollision[i+":"+j] != undefined)
                        {
                            arrayCheck.push(arrayCollision[i+":"+j])
                        }
                    }
                }


                if(arrayCheck.length)
                {
                    console.log("GOLPEO");
                    var rect1 = { x: obj.x+obj.width/2+x, y: obj.y+obj.height/2+y, width: 5, height: 5}




                    console.log(rect1);
                    for(var i=0;i<= arrayCheck.length-1;i++){
                            var sprite =  arrayCheck[i];
                            var rect2 = { x: sprite.x, y: sprite.y, width: wTile, height: hTile}

                            sprite.visible = false;


                            if(checkIntersection(rect1, rect2))
                            {
                                console.log("SI");
                                return true;
                            }
                    }

                }







                return false;
                //return (collision[obj.x][obj.y] !=  undefined);
            }


            st = stage;
            loader = load;

            mapData = load.getResult("MapJSON");

            // compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
            wTile = mapData.tilesets[0].tilewidth;
            hTile = mapData.tilesets[0].tileheight;

            console.log(wTile);
            var imageData = {
                images : [ load.getResult("MapImage") ],
                frames : {
                    width : wTile,
                    height : hTile
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

            //background.cache(0,0, mapData.tilewidth*mapData.width, mapData.tileheight*mapData.height)

        }



        return Map;
    }
);