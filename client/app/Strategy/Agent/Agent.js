"use strict";
var Rule_1 = require('../../ChineseChess/Rule/Rule');
var init_1 = require('../../ChineseChess/InitGame/init');
var Agent = (function () {
    // team == 1 -> Red , team !=1 -> Black team 
    // mask co up -> add value typechess
    // InitPiece from input of phayer
    function Agent(team, reverse, strategy, dept, typechess, InitPiece, myPieces, pastMoves, logMoves) {
        if (reverse === void 0) { reverse = false; }
        if (strategy === void 0) { strategy = 0; }
        if (dept === void 0) { dept = 0; }
        if (typechess === void 0) { typechess = false; }
        if (InitPiece === void 0) { InitPiece = null; }
        if (myPieces === void 0) { myPieces = null; }
        if (pastMoves === void 0) { pastMoves = []; }
        if (logMoves === void 0) { logMoves = []; }
        this.strategy = 0;
        this.pastMoves = [];
        this.logMoves = []; // storage move for reports
        this.DEPTH = 0;
        this.reverse = false;
        this.typechess = false;
        this.InitPiece = null;
        this.en_name = {
            "j": "R",
            "p": "C",
            "m": "H",
            "x": "E",
            "s": "A",
            "z": "P",
            "k": "K",
        };
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
            this.myPieces = InitPiece;
        }
        this.pastMoves = pastMoves;
        this.logMoves = logMoves;
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
        // console.log(this.legalMoves);
    };
    Agent.prototype.checkMate = function () {
        return Rule_1.Rule.checkMate(this.myPieces, this.oppoPieces, this.boardState, this.team, this.reverse);
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
        this.updateLog(piece, pos);
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
        // console.log(this.pastMoves)
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
        return new Agent(this.team, this.reverse, this.strategy, this.DEPTH, false, null, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves(), this.copylog());
    };
    Agent.prototype.copyMoves = function () {
        return this.pastMoves.slice();
    };
    Agent.prototype.copylog = function () {
        return this.logMoves.slice();
    };
    /*
    toward -> '+'
    backward -> '-'
    move within a row -> '[currcol].[newcol]'
    toward a new col-> '[currcol]+[newcol]'
    backward a new col -> '[currcol]-[newcol]'
    toward within a col -> '[currcol]+[number of steps]'
    backward within a col -> '[currcol]-[number of steps]'
    */
    Agent.prototype.updateLog = function (piece, pos) {
        // console.log("curr pos: ", piece.position)
        // console.log("new pos: ", pos)
        var log = this.en_name[piece.name[0]].concat(piece.position[1]);
        if (piece.position[0] == pos[0])
            log = log.concat(".");
        else if (piece.position[0] > pos[0])
            (this.team == 1) ? (log = log.concat("-")) : (log = log.concat("+"));
        else
            (this.team == 1) ? (log = log.concat("+")) : (log = log.concat("-"));
        if (piece.position[1] == pos[1])
            log = log.concat(Math.abs(pos[0] - piece.position[0]));
        else
            log = log.concat(pos[1]);
        this.logMoves.push(log);
        // console.log(this.logMoves);
    };
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map