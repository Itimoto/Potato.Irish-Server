/**
 * Returns an Object containing each named GameObject,
 *  Plus an Array of Game Objects for Iteratable Freedom!
 * 
 * @param {width: num, height: num} bounds -- Bounding Rectangle; We Generate Object Sizes Around It
 */

/*import GameObject   from './pongGameObject.js';
import Goal         from './pongGoal.js';
import Player       from './pongPlayer.js';
import Ball         from './pongBall.js';*/

const GameObject  = require('./pongGameObject.js');
const Goal        = require('./pongGoal.js');
const Player      = require('./pongPlayer.js');
const Ball        = require('./pongBall.js');

function generateAssets (bounds){
    let objExports = {
        //... (We add the rest of our /named/ objects & objArr[] to this)
    }
      
    objExports.ball = new Ball({
      bounds  : bounds,
    });

    objExports.topBound = new GameObject({
      x   : 0, 
      y   : -100, 
      width   : bounds.width,
      height  : 100,          //Height is increased to catch most runaway balls
      color   : "#00000000",  //Keep it transparent
    });
    objExports.botBound = new GameObject({
      x   : 0, 
      y   : bounds.height, 
      width   : bounds.width, 
      height  : 100,
    });

    objExports.leftGoal = new Goal({
      bounds  : bounds,
    });
    objExports.rightGoal = new Goal({
      x: bounds.width - objExports.leftGoal.width,
      bounds  : bounds,
    });

    objExports.player1 = new Player({
      x: 0 + objExports.leftGoal.width + bounds.height/20, 
        y: 0 + (bounds.height/2 - bounds.height/6),  // Halfway down, offset to middle of the paddle
      bounds: bounds,
    });

    objExports.player2 = new Player({
      x: (bounds.width - objExports.player1.width) - objExports.rightGoal.width - objExports.player1.width, // Offset by current width from border, offset from goal, offset from goal by own width
        y: 0 + (bounds.height/2 - objExports.player1.height/2),
      bounds: bounds,
    });

    //objExports.leftGoal.onCollision = objExports.rightGoal.onCollision = objExports.scoreGoal;  // Needs to be put after the binds to conserve the `this`

    return objExports;
}

//export {initGameConstants as default};
module.exports = generateAssets;