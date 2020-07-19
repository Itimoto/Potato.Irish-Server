//----------------------------------------------------------------
// Pong Server - Dimitry Melnikov, 6.18.20
//
// The entrypoint of a number of modules separated from each other
//  Together, they form a Pong Server:
//  Two clients hook up to the Websocket, then they play Pong
//-----------------------------------------------------------------

/**
 * File Layout: 
 * 
 * /lib/pong:
 *  _pong-server.js         -- Entrypoint; verifies clients and pushes them to the manager
 *  client-manager.js       -- Common Entrypoint; processes ready sockets/clients, pushes
 *                              to a Queue, initializes Games, processes player closures, etc.
 *                              - Also allows multiple, separate processes to push to the same queue
 * /lib/pong/game:
 *  
 *  pong-game.js            -- Takes two sockets and mediates their Game. Processes client 
 *                              window boundaries to ensure synchronized playability / viewing
 *  platform-bridger.js     -- Calculates the window boundaries described above
 *  pong-simulator.js       -- Sublet of pG-server.js; calculates game-state (collisions, score, etc.)
 * 
 * /lib/pong/assets: 
 *  asset-generator.js-- Self-descriptive; Generates Game Objects/Assets from the window boundaries
 *  pongGameObject.js       -- Blueprint of the Game Objects, Parent of the Children
 *  pong[Ball/Player/etc].js-- Inherits from pGObject.js; these are the rest of the Assets
 */

const WebSocket     = require("ws");

// PongManager is a shared constant; all services running 'pong' can interact with it
const PongManager = require('./client-manager');
//const { server } = require("spdy");

function pongConnection (socket) {
    console.log("PONG: New Connection");

    let pushIfReady = (data) => {
        if(data == 'ReqPong')
        PongManager.pongRequested(socket);
    }

    socket.on('message', pushIfReady);

    socket.once('close', () => {
        socket.removeListener('message', pushIfReady);
        // Game-related events are taken care of by 'pongGame-server'; this is for memory leaks
        // However, while debugging WebRTC, we'll do this instead:
        PongManager.endGame(socket);
    });
}

module.exports = {
    initialize: function(opts){
        let pongWSS;

        if(!opts.ssl){ // If we're dealing with a simple HTTP server...
            let pongPort = opts.port || 8084;
            pongWSS = new WebSocket.Server({ port: pongPort });

        } else {    // If we're using HTTPS/HTTP2 (or aren't adding extra ports)...
            pongWSS = new WebSocket.Server({ noServer: true });

            let WSSRouter = require('../gen/wssRouter');
            WSSRouter.append(pongWSS, '/pong');         // Hand-off 'connection' to centralized WS Router
        }

        pongWSS.on('connection', pongConnection);   // Handle Conn. Locally
    }
}