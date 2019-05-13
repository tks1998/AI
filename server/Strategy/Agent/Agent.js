"use strict";
var Piece_1 = require('../../Objects/Piece');
var Rule_1 = require('../../ChineseChess/Rule/Rule');
var init_1 = require('../../ChineseChess/InitGame/init');
var Evaluation_1 = require('../_Param/Evaluation');
var Agent = (function () {
    function Agent(team, myPieces) {
        if (myPieces === void 0) { myPieces = undefined; }
        // moved: EventEmitter<number> = new EventEmitter();
        this.strategy = 0;
        this.team = team;
        if (myPieces == undefined)
            this.myPieces = (team == 1 ? init_1.InitGame.getRedPieces() : init_1.InitGame.getBlackPieces());
        else {
            this.myPieces = myPieces;
        }
    }
    Agent.prototype.setOppoAgent = function (oppoAgent) {
        // setOppoAgent(oppoAgent, calMoves = true, updateDict = false) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        // this.updateState(updateDict);
        // this.updateState(calMoves, updateDict);
    };
    Agent.prototype.updateState = function () {
        this.updateBoardState();
        this.updatePieceDict();
        this.computeLegalMoves();
        return this;
    };
    // compute legals moves for my pieces after state updated
    Agent.prototype.computeLegalMoves = function () {
        this.legalMoves = Rule_1.Rule.allPossibleMoves(this.myPieces, this.boardState, this.team);
    };
    // update board state by pieces
    Agent.prototype.updateBoardState = function () {
        var state = {};
        for (var i in this.myPieces)
            state[this.myPieces[i].position.toString()] = [this.myPieces[i].name, true];
        for (var i in this.oppoPieces)
            state[this.oppoPieces[i].position.toString()] = [this.oppoPieces[i].name, false];
        this.boardState = state;
    };
    // update dictionary of pieces
    Agent.prototype.updatePieceDict = function () {
        this.myPiecesDic = {};
        for (var i in this.myPieces) {
            this.myPiecesDic[this.myPieces[i].name] = this.myPieces[i].position;
        }
    };
    Agent.prototype.movePieceTo = function (piece, pos, isCapture) {
        if (isCapture === void 0) { isCapture = undefined; }
        piece.moveTo(pos);
        if (isCapture == undefined)
            isCapture = this.oppoPieces.filter(function (x) { return x.position + '' == pos + ''; }).length > 0;
        // having oppo piece in target pos
        if (isCapture)
            this.captureOppoPiece(pos);
    };
    // capture piece of opponent
    // pos: position of piece to be captured
    Agent.prototype.captureOppoPiece = function (pos) {
        for (var i = 0; i < this.oppoPieces.length; i++) {
            if (this.oppoPieces[i].position + '' == pos + '') {
                this.oppoPieces.splice(i, 1); // remove piece from pieces
                return;
            }
        }
    };
    // TO BE IMPLEMENTED BY CHILD CLASS
    // return [piece:Piece, toPos];
    Agent.prototype.comptuteNextMove = function (state) {
        console.log("BUG comptuteNextMove CALLED ");
        return null;
    };
    Agent.prototype.getPieceByName = function (name) {
        return this.myPieces.filter(function (x) { return x.name == name; })[0];
    };
    // check existance of my king
    Agent.prototype.check_king_exist = function () {
        return this.getPieceByName('k') != undefined;
    };
    Agent.prototype.random_move = function () {
        // console.log("this.legalMoves:", this.legalMoves)
        var movablePieces = Object.keys(this.legalMoves);
        if (movablePieces.length == 0)
            return [];
        var name = movablePieces[Math.floor(movablePieces.length * Math.random())];
        var moves = this.legalMoves[name];
        while (moves.length == 0) {
            name = movablePieces[Math.floor(movablePieces.length * Math.random())];
            moves = this.legalMoves[name];
        }
        // console.log("moves:", moves)
        var move = moves[Math.floor(moves.length * Math.random())];
        return [this.getPieceByName(name), move];
    };
    Agent.prototype.getValueOfGreedyMove = function (pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        if (piece)
            return Evaluation_1.Evaluation.pieceValue(piece[0]);
        return 0;
    };
    // get greedy move
    Agent.prototype.greedy_move = function () {
        var _this = this;
        var moves = this.get_moves_arr(); //[[movePieceName, move]]
        // console.log(moves)
        var values = moves.map(function (x) { return _this.getValueOfGreedyMove(x[0], x[1]); });
        var max = -Infinity;
        var pos = -1;
        for (var i = 0; i < values.length; i++) {
            if (values[i] > max) {
                pos = i;
                max = values[i];
            }
        }
        if (max > 0)
            return [this.getPieceByName(moves[pos][0]), moves[pos][1]]; // can capture opponent piece
        // take random move
        return this.random_move();
    };
    Agent.prototype.copy = function () { return new Agent(this.team, this.myPieces.map(function (x) { return x.copy(); })); };
    Agent.piecesFromDict = function (dict_list) {
        return dict_list.map(function (x) { return Piece_1.Piece.copyFromDict(x); });
    };
    Agent.copyFromDict = function (dict) {
        return new Agent(dict.team, this.piecesFromDict(dict.myPieces));
    };
    // get array of legalMoves: [[movePieceName, move]]
    Agent.prototype.get_moves_arr = function () {
        var moves = [];
        for (var movePieceName in this.legalMoves) {
            var toPosList = this.legalMoves[movePieceName];
            for (var i in toPosList) {
                var move = toPosList[i];
                moves.push([movePieceName, move]);
            }
        }
        return moves;
    };
    // return value of state for redAgent
    Agent.prototype.getValueOfState = function (state) {
        return this.getValueOfAgent(state.redAgent, state) - this.getValueOfAgent(state.blackAgent, state);
    };
    Agent.prototype.getValueOfAgent = function (agent, state) {
        if (state === void 0) { state = null; }
        // console.log("======================");
        var score = 0;
        for (var i in agent.myPieces) {
            score += this.getValOfPiece(agent.myPieces[i], agent.team);
        }
        return score;
    };
    Agent.prototype.getValOfPiece = function (piece, team) {
        return Evaluation_1.Evaluation.posValue(piece.name, piece.position, team) + Evaluation_1.Evaluation.pieceValue(piece.name);
    };
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map