"use strict";
var Rule_1 = require('../../ChineseChess/Rule/Rule');
var init_1 = require('../../ChineseChess/InitGame/init');
var Agent = (function () {
    // team == 1 -> Red , team !=1 -> Black team 
    // mask co up -> add value typechess
    // InitPiece from input of phayer
    function Agent(team, reverse, strategy, dept, typechess, InitPiece, myPieces, pastMoves) {
        if (reverse === void 0) { reverse = false; }
        if (strategy === void 0) { strategy = 0; }
        if (typechess === void 0) { typechess = false; }
        if (InitPiece === void 0) { InitPiece = null; }
        if (myPieces === void 0) { myPieces = null; }
        if (pastMoves === void 0) { pastMoves = []; }
        this.strategy = 0;
        this.pastMoves = [];
        this.DEPTH = 0;
        this.reverse = false;
        this.typechess = false;
        this.InitPiece = null;
        this.team = team;
        this.reverse = reverse;
        if (typechess == false) {
            if (myPieces == null) {
                this.myPieces = (team == 1 ? init_1.InitGame.getRedPieces(this.reverse) : init_1.InitGame.getBlackPieces(this.reverse));
            }
            else {
                this.myPieces = myPieces;
            }
        }
        if (typechess) {
            if (myPieces == null) {
                this.InitPiece = InitPiece;
                this.myPieces = (team == 1 ? init_1.InitGame.StateRed(this.reverse, this.InitPiece) : init_1.InitGame.StateBlack(this.reverse, this.InitPiece));
            }
            else {
                this.myPieces = myPieces;
            }
        }
        this.pastMoves = pastMoves;
        this.strategy = strategy;
        this.DEPTH = dept;
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
        this.legalMoves = Rule_1.Rule.allPossibleMoves(this.myPieces, this.boardState, this.team, this.reverse);
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
    Agent.prototype.copy = function () {
        return new Agent(this.team, this.reverse, this.strategy, this.DEPTH, false, null, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves());
    };
    Agent.prototype.copyMoves = function () {
        return this.pastMoves.slice();
    };
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map