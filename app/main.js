// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define(["modernizr"], function() {
  if(Modernizr.canvas)
  {
      require(["world/GameWorld"], function(gameWorld)
      {
          console.log(gameWorld);
          gameWorld.init();
      })
  }
});
