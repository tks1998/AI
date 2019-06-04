/*
 * client request to sever 
 * Sever reveice and extract request from client and compute next move -> reponse client 
 * use method http of angular make reponse for client
 * default port = 3000 
 * references on page  https://angular.io/guide/http
 * If you want to upgrade , you should use method nginx . Nginx is method support load balancer 
 */
import { State } from '../Strategy/State/State'
import { MCTS } from '../Strategy/MCTS/MCTS'

var app = require('../server').app;
var debug = require('debug')('server:server');
var http = require('http');

var assert = require('assert');

var port = '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen('3000');
server.on('listening', onListening);

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
// set maximum move 
var N_MAX_MOVES = 100;

app.put('/compute', function(request, response) {
    var state = request.body;
    var to_return = {};
    // number move > maximum move -> end game 
    if (state.redAgent.pastMoves.length >= N_MAX_MOVES) {
        response.end(JSON.stringify({ "move": [] }));
        return;
    }
    // recieved request and extract it 
    // make new State from request 
    state = State.copyFromDict(state);
    //get time 
    var start = new Date().getTime();
    // compute next move  
    let next = state.nextMove();
 
    var now = new Date().getTime();
 
    var t = (now - start);

    var playing = state.get_playing_agent();
    
    response.end(JSON.stringify({ "move": next, "time": t}));
    var param = (playing instanceof MCTS) ? playing.N_SIMULATION : playing.DEPTH;
    console.log("Agent { ", playing.strategy + "-" + param, "} Compute Move Using: ", t, " ms");
});

