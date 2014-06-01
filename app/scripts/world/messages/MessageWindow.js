define([], function (Font) {
        //return an object to define the "my/shirt" module.

        var MessageWindow = {}
        var stage;
        var messages;
        var avatar;
        var layerMessage;

        var lastMessage;
        var lastTextFieldMessage;

        var self = MessageWindow;
        MessageWindow.init = function (st, load) {


            stage = st;

            messages = load.getResult("MapMessages");
            avatar = new createjs.Bitmap(load.getResult("TotoroAvatar"));

            avatar.x = 20;
            layerMessage = new window.createjs.Container();

            var background = new window.createjs.Shape();

            background.graphics.beginFill("gray").drawRoundRect(10,10,stage.canvas.width-10,stage.canvas.height-10,5);
            background.graphics.beginFill("gray").drawRoundRect(20,20,stage.canvas.width-20,stage.canvas.height-20,5);

            background.x = 0;
            background.y = 0;

            layerMessage.y = stage.canvas.height - 110;

            background.alpha = 0.6;

            layerMessage.addChild(background);
            layerMessage.addChild(avatar);

            //layerMessage.visible = false;
            stage.addChild(layerMessage);


            lastTextFieldMessage = new window.createjs.Text("ForceLoad", "48px VT323", "#ffffff");
            lastTextFieldMessage.x = 150;
            lastTextFieldMessage.y = 25;

            lastTextFieldMessage.text = "PRER";
            layerMessage.addChild(lastTextFieldMessage);
            layerMessage.alpha = 0.01;

        };

        MessageWindow.draw = function (text) {

            if(lastMessage != text)
            {
                lastMessage = text;
                layerMessage.alpha = 1;


                for(var i in messages)
                {
                    if(i === text)
                    {
                        lastTextFieldMessage.text = messages[i];

                        layerMessage.visible = true;

                        break;
                    }
                }


            }
        };

        MessageWindow.undraw = function (text) {

            lastMessage = null;
            layerMessage.visible = false;





        };




        return Message;
    }
);