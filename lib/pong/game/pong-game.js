/**
 * Creates and Manages a Game of Pong between Two Clients
 */
const PongSimulation    = require('./pong-simulator');
const PlatformBridge    = require('./platform-bridger');
const events            = require('events');

class PongServer {
    constructor(PlayerSockets){
        console.log("Starting PongServer");

        this.players = PlayerSockets;
        this.p1 = PlayerSockets[0];   // For ease-of-reading, if need be
        this.p2 = PlayerSockets[1];

        this.emitter = new events.EventEmitter();
        this.isRunning = true;

        if(this.p1 === this.p2 || this.p1.readyState >= 2 || this.p2.readyState >= 2){ // '2 - Closing; 3 - Closed'
            console.log("Preconditions not met. Sockets invalid");
            this.isRunning = false;
            this.endGame();
            return;
        }

        this.playerWindowBounds = [];

        this.initialize             = this.initialize.bind(this);
        this.onReceivingBounds      = this.onReceivingBounds.bind(this);    // Bound b/c need to expose listener for removal
        this.setupBoundaries        = this.setupBoundaries.bind(this);
        this.startGame              = this.startGame.bind(this);
        this.sendServerUpdate       = this.sendServerUpdate.bind(this);
        this.playerUpdate           = this.playerUpdate.bind(this);
        this.endGame                = this.endGame.bind(this);

        this.initialize(this.players);
    }

    //--
    // Send Players their 'Index' and prepare to receive their local Bounds
    //--

    initialize(players){
        let self = this;

        players.forEach( (socket, index) => {
            socket.send("PG ASSIGN player" + (index+1)); // Send Their 'Playerhood'

            socket.on('message', self.onReceivingBounds);   // Note - To prevent multiple-'bounds' from the same origin,
            socket.once('close', self.endGame);             //  limit the //Client// to a single send (to allow 'endgame' requests if applicable) 
        });
    }

    onReceivingBounds(data){
        let self = this;
        // Data is gonna be the 'bounds'
        if(Buffer.isBuffer(data))   // We don't wanna crash the server because of a stray Buffer
            return;

        let message = data.split(' ');
        if(message[0] == "PG" && message[1] == "INITDATA"){
            console.log(this.iteration+" CURR PLAYER: "+"N/A"+ " " + message[2]);
            self.playerWindowBounds.push(JSON.parse(message[2]));
            self.setupBoundaries();
        }
        else if(message[0] == "PG" && message[1] == "END"){
            self.endGame();
        }
    }

    setupBoundaries(){
        if(this.playerWindowBounds.length != 2)
            return;
            
        let fittingRatios = PlatformBridge.computeAspectRatio(this.playerWindowBounds);
        
        // Update players
        this.players.forEach( (socket) => {
            socket.removeListener('message', this.onReceivingBounds);
            socket.send("PG NEWBOUNDS " + JSON.stringify(fittingRatios.width));   // Objects need to be serialized before sending
        });

        // Generate simulated 'screen' bounds; Square 'Screen' to simplify Clienside extrapolation
        this.bounds = PlatformBridge.getAbsoluteBounds(fittingRatios.width); // Generate Server's 'Absolute' Bounds

        this.startGame();
    }

    startGame(){
        // Generate In-Game Assets to 'simulate' on the Server
        this.pongGame = new PongSimulation(this.bounds);

        this.sendUpdateClock = setInterval(this.sendServerUpdate, 30);

        // Set up Player Input listeners
        this.p1.on("message", this.playerUpdate);
        this.p2.on("message", this.playerUpdate);
    }

    sendServerUpdate(){
        let {ball, player1, player2} = this.pongGame.getGameObjects();
        // Check if gameObjects is 'ready'
        if(!ball)
            return;
        
        this.players.forEach( (socket) => {
            socket.send("PG " + JSON.stringify(
                {
                    ball    : {x: ball.x, y: ball.y},
                    player1 : {x: player1.x, y: player1.y, pts: player1.pts},
                    player2 : {x: player2.x, y: player2.y, pts: player2.pts},

                    time    : Date.now(), //Append date for clientside frame interpolation
                }
            ));
        });
    }

    playerUpdate(data){
        console.log(data);
        let message = data.split(' ');

        if(message[0] == "PG"){
            if(message[1] == "INPUT"){
                //[2] - `player name` [3] - `new yVel`
                //this.genConstants[message[2]].yVel = JSON.parse(message[3]);
                let player = this.pongGame.getGameObjects()[message[2]];
                player.changeVel(message[3]);
            }
            else if (message[1] == "END"){
                this.endGame();
            }
        }
    }

    endGame(unavailableSocket){
        console.log("Pong-Backend: Ending Game");

        // Stop internal processes
        this.players.forEach( (socket) => {
            if(socket != unavailableSocket) // If we're ending this externally, /don't/ send out another 'end' alert
                socket.send("PG END");      //  (to avoid accidental clientside re-queueing)

            socket.removeListener('message', this.onReceivingBounds);
            socket.removeListener('message', this.playerUpdate);
            socket.removeListener('close', this.endGame);
        });

        if(this.pongGame)
            this.pongGame.stopRunningGame();    // Clear local interval
        
        clearTimeout(this.sendUpdateClock);

        this.emitter.emit('gameover'); // Alert external processes to this one
    }
}

//export {PongServer as default};
module.exports = PongServer;