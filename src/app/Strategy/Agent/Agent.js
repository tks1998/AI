"use strict";
var Rule_1 = require('../../ChineseChess/Rule/Rule');
var init_1 = require('../../ChineseChess/InitGame/init');
var Agent = (function () {
    function Agent(team, myPieces, pastMoves, strategy) {
        if (myPieces === void 0) { myPieces = null; }
        if (pastMoves === void 0) { pastMoves = []; }
        if (strategy === void 0) { strategy = 0; }
        this.strategy = 0;
        this.pastMoves = [];
        this.DEPTH = 0;
        this.team = team;
        if (myPieces == null)
            this.myPieces = (team == 1 ? init_1.InitGame.getRedPieces() : init_1.InitGame.getBlackPieces());
        else {
            this.myPieces = myPieces;
        }
        this.pastMoves = pastMoves;
        this.strategy = strategy;
        // console.log("Agent")
    }
    Agent.prototype.setOppoAgent = function (oppoAgent) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        this.updateState();
    };
    // return | 1:win | -1:lose | 0:continue
    Agent.prototype.updateState = function () {
        this.updateBoardState();
        this.computeLegalMoves();
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
    Agent.prototype.movePieceTo = function (piece, pos, isCapture) {
        if (isCapture === void 0) { isCapture = undefined; }
        piece.moveTo(pos);
        this.addMove(piece.name, pos);
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
    // add move to pastMoves
    Agent.prototype.addMove = function (pieceName, pos) {
        this.pastMoves.push({ "name": pieceName, "position": pos });
    };
    // agent take action
    Agent.prototype.nextMove = function () {
        var computeResult = this.comptuteNextMove();
        var piece = computeResult[0];
        var toPos = computeResult[1];
        this.movePieceTo(piece, toPos);
    };
    ;
    // TO BE IMPLEMENTED BY CHILD CLASS
    // return: [piece, toPos]
    Agent.prototype.comptuteNextMove = function () { alert("YOU SHOULD NOT CALL THIS!"); };
    Agent.prototype.getPieceByName = function (name) {
        return this.myPieces.filter(function (x) { return x.name == name; })[0];
    };
    // TO BE OVERIDE BY TDLeaner
    Agent.prototype.update_weights = function (nSimulations, result) { return []; };
    // TO BE OVERIDE BY TDLeaner
    Agent.prototype.save_state = function (feature_vec) { };
    Agent.prototype.copy = function () {
        return new Agent(this.team, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves());
    };
    Agent.prototype.copyMoves = function () {
        return this.pastMoves.slice();
    };
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map