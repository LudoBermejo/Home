define([], function () {
        //return an object to define the "my/shirt" module.

        var Font = {};
        var stage;

        var charMap = " !\"#$%?()*+,-./0123456789:;?=???ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]???abcdefghijklmnopqrstuvwxyz(|)";

        var fontSheet;


        Font.init = function (st, font) {
            //loader.getResult("FontMessages")
            stage = st;
            fontSheet = new createjs.SpriteSheet({
                images: [font],
                frames: {width: 16, height: 16, count: charMap.length}
            });



        };

        var getCharImg = function (pChar) {

            var index = charMap.indexOf(pChar);
            return window.createjs.SpriteSheetUtils.extractFrame(fontSheet, index);
        };

        Font.setText = function (pText) {

            var message = new window.createjs.Container();
            var i;
            var count = pText.length;
            for (i = 0; i < count; i++) {
                var char = pText.charAt(i);
                var chatImg = getCharImg(char);
                var bmp = new createjs.Bitmap(chatImg);
                message.addChild(bmp);
                bmp.x = i * 16;
            }
        };


        return Font;
    }
);