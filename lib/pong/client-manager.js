/**
 * Common Entrypoint for Pong:
 * 
 * Takes in 'ready' clients, pairs them up, then lets them play
 */

const PongGame = require('./game/pong-game');

let openPongClients = [];
let pongGames = [];

//--
// Removes the linked clients from the list and starts up
//  a 'Game Server' instance  
//--

function startPongGame(){
    //log(`PONG-QUEUE:\t Adding game, stati: C1: ${isAccountedFor(openPongClients[0])} C2: ${isAccountedFor(openPongClients[1])}`);

    let newGame = new PongGame(openPongClients.splice(0, 2));

    if(!newGame.isRunning)
        return;

    pongGames.push(newGame);
        
    newGame.emitter.once('gameover', () => {
        log(`PONG-QUEUE:\t Gameover at ${pongGames.indexOf(newGame)} detected`);
        // Remove the game from Game Array
        pongGames.splice( pongGames.indexOf(newGame), 1);
    });
}

//--
// Removes a socket currently listed as 'Open'/Ready from Queue
//--

function processDisconnect(socket){
    let openSocketIndex = openPongClients.indexOf(socket);
    if(openSocketIndex != -1){
        log("PONG-QUEUE:\tUnqueueing Socket");
        openPongClients.splice(openSocketIndex, 1);
    }
}

function isAccountedFor(socket){
    let isFound = false;

    if(openPongClients.indexOf(socket) != -1)
        isFound = true;

    pongGames.forEach( (pongGame) => {
        if(pongGame.players.indexOf(socket) != -1){
            log("game found");
            isFound = true;
            //return 'banana';
        }
    });

    return isFound;
}

module.exports = {
    /**
     * Keep adding Pong-Ready Sockets in here to start up the Pong Servers
     * 
     * @param {WebSocket} socket -- Client Websocket that is /ready/ for Pong
     */
    pongRequested : function(socket) {
        // No need to repeat yo'self
        if(isAccountedFor(socket)){
            //log(`PONG-QUEUE:\tSocket ${openPongClients.indexOf(socket)} already processed`);
            //this.endGame(socket);
            return;
        }

        //log("PONG-QUEUE:\tQueueing Socket");

        openPongClients.push(socket);
        
        //log(`PONG-QUEUE:(S)\tOPEN CLIENTS: ${openPongClients.length} \tRUNNING GAMES: ${pongGames.length}`);
            
        if(openPongClients.length >= 2 && openPongClients.length % 2 == 0)
            startPongGame();
    },

    /**
     * Searches for the socket's respective game, then ends it
     * Returns the Socket's Game's index
     * 
     * @param {WebSocket} socket -- Socket to disconnect from game 
     */
    endGame : function(directSocket) {
        let socket = directSocket;// || this; // If called as 'close' listener
        //...this won't scale well. But it might work for enough time.

        if(!isAccountedFor(socket))
            return;

        //log(`PONG-QUEUE:(E1)\tOPEN CLIENTS: ${openPongClients.length} \tRUNNING GAMES: ${pongGames.length}`);

        // Remove from 'Open Clients' List, if applicable
        if(openPongClients.indexOf(socket) != -1){
            processDisconnect(socket);  // Remove the Socket from the 'Active' List
            setTimeout( () => {
                directSocket.send("PG END DY");
            }, 100);
            //return;                     // Don't waste resources going through the rest
        }

        // Close any Running Pong Games it's involved with
        pongGames.forEach( (pongGame, index) => {
            if(pongGame.players.indexOf(socket) != -1){
                pongGame.endGame();
                //log("PONG-QUEUE:\tA game has been ended");
                return index;
            }
        });
        
        //log(`PONG-QUEUE:(E2)\tOPEN CLIENTS: ${openPongClients.length} \tRUNNING GAMES: ${pongGames.length}`);

        return -1;
    },

    // Service:
    isOpenClient : (socket) => {
        return openPongClients.indexOf(socket);
    },

    isInGame : (socket) => {
        let gameIndex = -1;
        
        pongGames.forEach( (pongGame, index) => {
            if(pongGame.players.indexOf(socket) != -1){
                gameIndex = index;
            }
        });

        return gameIndex;
    }
}

// for Debugging
let debugging = false;
log = function(msg){
    if(debugging)
        console.log(msg);
}