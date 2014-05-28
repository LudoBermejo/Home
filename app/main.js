// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define(["modernizr"], function() {

  if(window.Modernizr.canvas)
  {
      require(["world/GameWorld"], function(gameWorld)
      {
          gameWorld.init();
      });
  }
});
