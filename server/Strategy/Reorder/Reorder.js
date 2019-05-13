"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ABPruning_1 = require('../ABPruning/ABPruning');
var Evaluation_1 = require('../_Param/Evaluation');
var Reorder = (function (_super) {
    __extends(Reorder, _super);
    function Reorder() {
        _super.apply(this, arguments);
        this.strategy = 2;
    }
    Reorder.prototype.get_ordered_moves = function (agent) { return this.reordered_moves(agent); };
    // return a list ofreorder reordered moves of playing agent: checkmates->captures->empty_moves
    // [[pieceName, move]]
    Reorder.prototype.reordered_moves = function (agent) {
        agent.updatePieceDict();
        agent.oppoAgent.updatePieceDict();
        var typed_moves = this.get_typed_moves(agent);
        var checkmates = typed_moves.filter(function (x) { return x[1] == 3; }).map(function (x) { return x[0]; });
        // if already can checkmake , then just choose the moves
        if (checkmates.length > 0)
            return checkmates;
        var captures = typed_moves.filter(function (x) { return x[1] == 1; }).map(function (x) { return x[0]; });
        ; // [[pieceName, move, oppo_piece_name]]
        var empty_moves = typed_moves.filter(function (x) { return x[1] == 0; }).map(function (x) { return x[0]; });
        ;
        // sort by capturing piece value
        captures.sort(function (x, y) { return Evaluation_1.Evaluation.pieceValue(y[0]) - Evaluation_1.Evaluation.pieceValue(x[0]); });
        return captures.concat(empty_moves);
    };
    // return [[[pieceName, move], type]]
    Reorder.prototype.get_typed_moves = function (agent) {
        var type_dc = this.get_moves_types(agent);
        var r = [];
        for (var movePieceName in agent.legalMoves) {
            var toPosList = agent.legalMoves[movePieceName];
            for (var i in toPosList) {
                r.push([[movePieceName, toPosList[i]], type_dc[movePieceName][i]]);
            }
        }
        return r;
    };
    // return {pieceName: [type]} 0:empty | 1:capture | 2:threatening | 3: checkmake
    Reorder.prototype.get_moves_types = function (agent) {
        var oppo_king_pos = agent.oppoAgent.myPiecesDic['k'].toString();
        var types = {};
        for (var movePieceName in agent.legalMoves) {
            var toPosList = agent.legalMoves[movePieceName];
            for (var i in toPosList) {
                var move = toPosList[i];
                var mostStr = move + '';
                if (this.is_check_mate_move(move, oppo_king_pos)) {
                    this.add_move_type(types, movePieceName, 3);
                    continue;
                }
                if (this.is_capture_move(agent, movePieceName, mostStr)) {
                    this.add_move_type(types, movePieceName, 1);
                    continue;
                }
                this.add_move_type(types, movePieceName, 0);
            }
        }
        return types;
    };
    Reorder.prototype.add_move_type = function (dic, movePieceName, type) {
        var ls = dic[movePieceName];
        if (ls)
            ls.push(type);
        else
            ls = [type];
        dic[movePieceName] = ls;
    };
    // check if a move is a checkmate
    Reorder.prototype.is_check_mate_move = function (move, oppo_king_pos) {
        return move.toString() == oppo_king_pos;
    };
    // check if a move is a capture move
    Reorder.prototype.is_capture_move = function (agent, movePieceName, moveStr) {
        var oppo_piece = agent.boardState[moveStr]; // [name, isMyPiece] or null
        return oppo_piece && !oppo_piece[1];
    };
    // copy() { return new Reorder(this.team, this.myPieces.map(x => x.copy()), this.DEPTH); }
    Reorder.copyFromDict = function (dict) {
        return new Reorder(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    };
    return Reorder;
}(ABPruning_1.ABPruning));
exports.Reorder = Reorder;
//# sourceMappingURL=Reorder.js.map