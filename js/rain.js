"use strict";
//crossbrowser requestAnimationFrame shim
window.requestAnimFrame = ( function() {
 return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function( callback ) {
     window.setTimeout( callback, 1000 / 60 );
    };
})();
 
var App=function(){
 var base=this,canvas,ctx,drops=[],color=120,
 w=window.innerWidth,h=window.innerHeight;
  //App initilizer
 base.init=function(){
  base.setup();
  base.loop();
 };
 //setting up html5 canvas
 base.setup=function(){
  canvas=document.createElement('canvas');
  //set fixed style
  canvas.width=w;
  canvas.height=h;
  canvas.style.left=0;
  canvas.style.top=0;
  canvas.style.zIndex=-1;
  canvas.style.position='fixed';
  document.body.appendChild(canvas);
  ctx = canvas.getContext( '2d' );
 };
 //to create random umber within the range.
 base.rand=function(min,max){
  return Math.random() * ( max - min ) + min;
 };
 //to calculte distance between tow coords
 base.calDistance=function(x1,y1,x2,y2){
  return Math.sqrt( Math.pow( (x2-x1), 2 ) + Math.pow((y2-y1), 2 ) );
 };
 //The rain object
 base.Rain=function(ix,iy,ex,ey){
  var rain=this,x=ix,y=iy,distanceTraveled = 0,angle,brightness,targetRadius=1,
  speed = 2,acceleration= 1,distanceToTarget=0,
   coords = [],coordinateCount = 2;
  //initilizing rain object
  rain.init=function(){
   angle = Math.atan2( ey - iy, ex - ix );
   brightness= base.rand( 10, 70 );
   distanceToTarget=base.calDistance(ix,iy,ex,ey);
   // populate initial coordinate collection with the current coords
   while( coordinateCount-- ) {
    coords.push( [ ix, iy ] );
   }
  };
  //drawing rain drop
  rain.draw=function(){
   ctx.beginPath();
   // move to the last tracked coordinate in the set, then draw a line to the current x and y
   ctx.moveTo( coords[ coords.length - 1][ 0 ], coords[ coords.length - 1][ 1 ] );
   ctx.lineTo( x, y );
   ctx.strokeStyle = 'hsl(625, 100%, ' + brightness + '%)';
   ctx.stroke();
   ctx.beginPath();
  };
  //updating rain drop
  rain.update=function(i){
   coords.pop();
   coords.unshift( [ x, y ] );
   // speed up the rain drops
   speed += acceleration;
   // get the current velocities based on angle and speed
   var vx = Math.cos( angle ) * speed,
     vy = Math.sin( angle ) * speed;
   distanceTraveled = base.calDistance( ix, iy, x + vx, y + vy );
   
   if( distanceTraveled >= distanceToTarget ) {
    drops.splice(i,1);
   } 
   else {
    x += vx;
    y += vy;
   }
  };  
  rain.init();
 };
 //loop animation
 base.loop=function(){
  requestAnimFrame( base.loop );
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect( 0, 0, w, h );
  ctx.globalCompositeOperation = 'lighter';  
  // loop over each drops, draw it, update it
  var i = drops.length;
  while( i-- ) {
   drops[ i ].draw();
   drops[ i ].update( i );
  }
  var sx=base.rand( 0, w+200 );
  drops.push(new base.Rain(sx, 0, sx-200, h,color));
 };
 base.events=function(){
  canvas.addEventListner('click',base.thunder);
 };
 base.init();
};
new App();