require.config({
  // make components more sensible
  // expose jquery 
  paths: {
    "components": "../components",
    "jquery": "../components/jquery/dist/jquery",
    "modernizr": "../components/modernizr/modernizr",
    "createjs": "../components/EaselJS/lib/easeljs-NEXT.min",
    "preloadjs": "../components/PreloadJS/lib/preloadjs-0.4.1.min"
  },
    shim: {
        'preloadjs': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['createjs']
        }
    }
});

if (!window.requireTestMode) {
  require(['main'], function(){ });
}





