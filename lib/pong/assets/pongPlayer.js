//import GameObject from './pongGameObject.js';
const GameObject    = require('./pongGameObject');

class Player extends GameObject {

    constructor(opts){
        super(opts);

        this.PLAYERVELOCITY = 5;
        this.pts = 0;

        if(this.bounds){
            this.width = this.bounds.height / 40;
            this.height = this.bounds.height / 5;
        }

        this.onCollision = this.onCollision.bind(this); //We're binding this b/c instances don't always call it
    }

    onCollision(Ball){
        let self = this;

        Ball.xVel *= -1.05;
        Ball.yVel += (Math.round(self.yVel/4 *Math.random()) + (self.yVel/2));
    }

    changeVel(direction){
        if(direction == "UP" || direction == "ArrowUp")
            this.yVel = -1*this.PLAYERVELOCITY;

        if(direction == "DOWN" || direction == "ArrowDown")
            this.yVel = this.PLAYERVELOCITY;

        if(direction == "STOP")
            this.yVel = 0;
    }

}

//export {Player as default};
module.exports = Player;