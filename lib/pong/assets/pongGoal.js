//import GameObject from './pongGameObject.js';
const GameObject    = require('./pongGameObject');

class Goal extends GameObject {

    constructor(opts){
        super(opts);

        this.color = "green";
        
        if(this.bounds){
            this.width = this.bounds.height / 20;
            this.height = this.bounds.height;
        }
    }
}

//export { Goal as default };
module.exports = Goal;