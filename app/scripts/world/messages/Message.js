define([], function () {
        //return an object to define the "my/shirt" module.

        var Message = {}
        var stage;
        var messages;
        var layerMessage;

        var lastMessage;


        Message.init = function (st, load) {

            stage = st;
            messages = load.getResult("MapMessages");

            layerMessage = new window.createjs.Container();

            var background = new window.createjs.Shape();

            background.graphics.beginFill("gray").drawRoundRect(25,0,stage.canvas.width-50,100,5);
            background.graphics.beginFill("blue").drawRoundRect(35,10,stage.canvas.width-70,80,5);

            background.x = 0;
            background.y = stage.canvas.height - 110;

            background.alpha = 0.6;

            layerMessage.addChild(background);
            //layerMessage.visible = false;
            stage.addChild(layerMessage);



        };

        Message.draw = function (text) {

            if(lastMessage != text)
            {
                console.log("Mi id es " + text);
                lastMessage = text;
                layerMessage.visible = true;
            }
        };

        Message.undraw = function (text) {

            lastMessage = null;
            layerMessage.visible = false;

        };




        return Message;
    }
);