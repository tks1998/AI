"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Agent_1 = require('../Agent/Agent');
var Evaluation_1 = require('../_Param/Evaluation');
var GreedyAgent = (function (_super) {
    __extends(GreedyAgent, _super);
    function GreedyAgent() {
        _super.apply(this, arguments);
        this.strategy = 0;
        this.DEPTH = 1;
    }
    // private method of computing next move
    GreedyAgent.prototype.comptuteNextMove = function () {
        // var pieceNames = Object.keys(this.legalMoves);
        var piece;
        var maxVal = 0;
        var maxVal = -Infinity;
        var fromPos = [];
        var toPos = [];
        for (var i in this.myPieces) {
            var name = this.myPieces[i].name;
            var moves = this.legalMoves[name];
            for (var j in moves) {
                var move = moves[j];
                var value = this.getValueOfMove(name, move);
                fromPos = this.myPieces[i].position;
                if (value > maxVal) {
                    toPos = move;
                    piece = this.myPieces[i];
                    maxVal = value;
                }
            }
        }
        return [piece, toPos];
    };
    GreedyAgent.prototype.getValueOfMove = function (pieceName, toPos) {
        var piece = this.boardState[toPos.toString()];
        var posVal = Evaluation_1.Evaluation.posValue(pieceName, toPos);
        if (!piece)
            return posVal; // empty place
        if (piece[1])
            alert("Bug");
        return Evaluation_1.Evaluation.pieceValue(piece[0]) + posVal;
    };
    // return a copy of an agent
    GreedyAgent.prototype.copy = function () {
        return new GreedyAgent(this.team, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves());
    };
    return GreedyAgent;
}(Agent_1.Agent));
exports.GreedyAgent = GreedyAgent;
//# sourceMappingURL=GreedyAgent.js.map