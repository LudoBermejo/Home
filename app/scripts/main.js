
require.config({
    baseUrl: 'scripts',
    paths: {
        "components": "../bower_components",
        "modernizr": "../bower_components/modernizr/modernizr",
        'easeljs': '../../bower_components/easeljs/lib/easeljs-0.7.1.min',
        'preloadjs': '../../bower_components/PreloadJS/lib/preloadjs-NEXT.min',
        "collisionDetection": "components/ndgmr.Collision",
        "text": "components/text"
    },
    shim: {
        'preloadjs': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['easeljs']
        }
    }
});

require(["world/GameWorld"], function(gameWorld)
{
    gameWorld.init();
});