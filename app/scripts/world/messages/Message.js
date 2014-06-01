define([], function (Font) {
        //return an object to define the "my/shirt" module.

        var Message = {}
        var stage;
        var messages;
        var avatar;
        var layerMessage;
        var layerMessageWindow;

        var lastMessage;
        var lastTextFieldMessage;

        var lastMessageWindow;
        var lastTextFieldMessageWindow;


        var self = Message;
        Message.init = function (st, load) {


            stage = st;

            messages = load.getResult("MapMessages");
            avatar = new createjs.Bitmap(load.getResult("TotoroAvatar"));

            avatar.x = 20;
            layerMessage = new window.createjs.Container();

            var background = new window.createjs.Shape();

            background.graphics.beginFill("gray").drawRoundRect(25,0,stage.canvas.width-50,100,5);
            background.graphics.beginFill("blue").drawRoundRect(35,10,stage.canvas.width-70,80,5);

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

            layerMessageWindow = new window.createjs.Container();

            var backgroundWindow = new window.createjs.Shape();

            backgroundWindow.graphics.beginFill("gray").drawRoundRect(25,25,stage.canvas.width-50,stage.canvas.height-50,5);
            backgroundWindow.graphics.beginFill("blue").drawRoundRect(50,50,stage.canvas.width-100,stage.canvas.height-100,5);

            backgroundWindow.x = 0;
            backgroundWindow.y = 0;

            background.alpha = 0.6;
            layerMessageWindow.addChild(backgroundWindow);
            //layerMessage.visible = false;
            stage.addChild(layerMessageWindow);

            layerMessageWindow.alpha = 0.01;


        };

        Message.draw = function (text) {

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

        Message.drawWindow = function (text) {

            if(lastMessageWindow != text)
            {
                lastMessageWindow = text;
                layerMessageWindow.alpha = 1;


                for(var i in messages)
                {
                    if(i === text)
                    {
                        lastTextFieldMessageWindow.text = messages[i];

                        layerMessageWindow.visible = true;

                        break;
                    }
                }


            }
        };

        Message.undraw = function (text) {

            lastMessage = null;
            lastMessageWindow = null;
            layerMessage.visible = false;
            layerMessageWindow.visible = false;

        };




        return Message;
    }
);