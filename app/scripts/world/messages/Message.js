define([], function () {
        //return an object to define the "my/shirt" module.

        var Message = {}
        var stage;
        var messages;
        var layerMessage;


        Message.init = function (st, load) {

            stage = st;
            messages = load.getResult("MapMessages");

            layerMessage = new window.createjs.Container();

            var background = new window.createjs.Shape();

            background.graphics.beginFill("blue").drawRoundRect(25,0,stage.canvas.width-50,100,5)

            background.x = 0;
            background.y = stage.canvas.height - 110;

            background.alpha = 0.6;

            layerMessage.addChild(background);

            stage.addChild(layerMessage);



        }

        Message.draw = function (text) {



        }



        return Message;
    }
);