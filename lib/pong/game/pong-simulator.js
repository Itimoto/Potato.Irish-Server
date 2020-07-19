const generateAssets = require('../assets/asset-generator');

const WINNINGSCORE = 9;
const PLAYERVELOCITY = 9;

class PongGame {
    constructor(windowBounds){
        // Generate Game Assets for Bounds, accordingly
        this.bounds = windowBounds;

        this.gameObjects = generateAssets(this.bounds);
        let {leftGoal, rightGoal, player1, player2} = this.gameObjects;

        this.update     = this.update.bind(this);
        this.scoreGoal  = this.scoreGoal.bind(this);

        leftGoal.onCollision = rightGoal.onCollision = this.scoreGoal;
        player1.PLAYERVELOCITY = player2.PLAYERVELOCITY = PLAYERVELOCITY;
        
        this.startRunningGame();
    }

    startRunningGame(){
        // Serve the ball, then start the Update loop
        this.gameObjects.ball.genXVel(5);
        this.clock = setInterval(this.update, 10);
    }

    stopRunningGame(){
        clearInterval(this.clock);
    }

    update(){
        let gameObjects = this.gameObjects;

        Object.keys(gameObjects).forEach( (key) => {
            let currObj = gameObjects[key];
            currObj.update();

            if(key != 'ball')
                checkCollision(gameObjects.ball, currObj);
        });
    }

    getGameObjects(){
        return this.gameObjects;
    }
    
    //--
    // Called when Ball hits Goal; Popped out here due to... erm... scoping issues.
    //--
    scoreGoal(){
        //console.log("ggggoooooOOOOOOOOAAAALLLLLLLLLL");
        let {ball, player1, player2} = this.gameObjects;
        let bounds = this.bounds;
        
        if(ball.x < 100){    // Hacky way of determining who the point goes to
            player2.pts++;
        } else {
            player1.pts++;
        }

        ball.x = bounds.width/2;
        ball.y = bounds.height/2;
        ball.xVel = ball.yVel = 0;

        if(player1.pts >= WINNINGSCORE || player2.pts >= WINNINGSCORE){
            // Reset Gamestate
            setTimeout(() => {
                player1.y = bounds.height/2 - player1.height/2;
                player2.y = player1.y;
                player1.pts = player2.pts = 0;
                ball.genXVel();
            }, 2000);
        } else {
            // Re-serve Ball
            setTimeout(() => {
                ball.genXVel();
            }, 700);
        }
    }
}

//---------- Service Methods ---------------------\\

//--
//  Mutating Function checking for collision between Ball and Rectangular Object
//  Affects the Ball's xVel & yVel as a result
//--
let checkCollision = function(ballObj, rectObj){
    let onCollision = rectObj.onCollision;
    let {x, y, radius} = ballObj;
    let rect = {
        top     : rectObj.y,
        bottom  : rectObj.y + rectObj.height,
        left    : rectObj.x,
        right   : rectObj.x + rectObj.width, 
    }

    if(rect.top <= y && y <= rect.bottom){
      if(Math.abs(x - rect.right) <= radius || Math.abs(x - rect.left) <= radius){  // Right-Side Collision
        onCollision(ballObj);
      }
      else if (Math.abs(x - rect.left) <= rectObj.width && Math.abs(x - rect.right) <= rectObj.width){
        onCollision(ballObj);
      }
      else if (rect.left <= x && x <= rect.right){  // 'Inside'
        onCollision(ballObj);
      }
    } 
}

module.exports = PongGame;