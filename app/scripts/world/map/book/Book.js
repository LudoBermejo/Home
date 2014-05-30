define([], function () {
        //return an object to define the "my/shirt" module.

        var Book = {};

        var spriteBook;

        var loader;
        var wBook=30;
        var hBook=30;

        var scaleBook=0.8;



        var createSprite = function () {
            var data = {
                images: [loader.getResult("Book")],
                frames: {width: wBook, height: hBook}
            };

            var spriteSheetBook = new window.createjs.SpriteSheet(data);

            spriteBook = new window.createjs.Sprite(spriteSheetBook);
            spriteBook.scaleX = spriteBook.scaleY = scaleBook;

        };



        Book.init = function (load) {

            loader = load;
            createSprite();
        };

        Book.width = function () {

            return wBook*scaleBook;
        };

        Book.height = function () {

            return hBook*scaleBook;
        };



        Book.getClone = function () {


            return spriteBook.clone();

        };


        return Book;
    }
)
;