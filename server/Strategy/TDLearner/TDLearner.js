"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StateFeatureExtractor_1 = require('../State/StateFeatureExtractor');
var Reorder_1 = require('../Reorder/Reorder');
var TDLearner = (function (_super) {
    __extends(TDLearner, _super);
    function TDLearner(team, myPieces, depth, weights) {
        _super.call(this, team, myPieces, depth);
        this.strategy = 3;
        this.weights = [];
        // current state feature vector
        this.curr_state_fea_vec = [];
        this.weights = weights;
    }
    TDLearner.copyFromDict = function (dict) {
        return new TDLearner(dict.team, this.piecesFromDict(dict.myPieces), dict.DEPTH, dict.weights);
    };
    TDLearner.prototype.getValueOfState = function (state) {
        var score_vec = [];
        var playing = state.get_playing_agent();
        if (!playing.boardState)
            playing.updateBoardState();
        playing.updatePieceDict();
        if (!playing.myPiecesDic['k'])
            return playing.team * Infinity;
        playing.oppoAgent.updatePieceDict();
        if (!playing.oppoAgent.myPiecesDic['k'])
            return playing.team * (-Infinity);
        playing.computeLegalMoves();
        playing.oppoAgent.updateBoardState();
        playing.oppoAgent.computeLegalMoves();
        var fea_vec = this.extract_state_feature(state.redAgent, state, state.blackAgent);
        for (var i = 0; i < fea_vec.length; i++)
            score_vec.push(fea_vec[i] * this.weights[i]);
        var score = score_vec.reduce(function (x, y) { return x + y; });
        return score + this.getValueOfAgent(state.redAgent, state) - this.getValueOfAgent(state.blackAgent, state);
    };
    // return state feature for agent
    TDLearner.prototype.extract_state_feature = function (agent, state, oppo) {
        var fea_vec = this.extract_agent_feature(agent, state);
        var black_vec = this.extract_agent_feature(oppo, state);
        for (var i = 0; i < fea_vec.length; i++)
            fea_vec[i] -= black_vec[i];
        return fea_vec;
    };
    // extract feature vector of current state for agent
    // [nThreat, nCapture, nCenterCannon, nBottomCannon, rook_mob, horse_mob, elephant_mob]
    TDLearner.prototype.extract_agent_feature = function (agent, state) {
        /*1*/
        var num_threat = this.get_num_threatening(agent, state);
        /*2*/
        var num_capture = this.get_num_captures(agent, state);
        /*3*/
        var num_center_cannon = StateFeatureExtractor_1.StateFeatureExtractor.num_center_cannon(agent);
        /*4*/
        var num_bottom_cannon = StateFeatureExtractor_1.StateFeatureExtractor.num_bottom_cannon(agent);
        /*5*/
        var rook_mob = this.num_piece_moves(agent, 'j1') + this.num_piece_moves(agent, 'j2');
        /*6*/
        var horse_mob = this.num_piece_moves(agent, 'm1') + this.num_piece_moves(agent, 'm2');
        /*7*/
        var elephant_mob = this.num_piece_moves(agent, 'x1') + this.num_piece_moves(agent, 'x2');
        var feature_vec = [num_threat, num_capture, num_center_cannon, num_bottom_cannon, rook_mob, horse_mob, elephant_mob];
        return feature_vec;
    };
    // get number of possible moves by piece name
    TDLearner.prototype.num_piece_moves = function (agent, piece_name) {
        var moves = agent.myPiecesDic[piece_name];
        if (!moves)
            return 0;
        return moves.length;
    };
    // return number of pieces that are threatening the oppo king
    TDLearner.prototype.get_num_threatening = function (agent, state) {
        var n = 0;
        // console.log("agent.oppoAgent.myPiecesDic:", agent.oppoAgent.myPiecesDic)
        var oppoKing = agent.oppoAgent.myPiecesDic['k'].toString();
        for (var pieceName in agent.legalMoves) {
            for (var i in agent.legalMoves[pieceName]) {
                var move = agent.legalMoves[pieceName][i].toString();
                if (move == oppoKing) {
                    n++;
                    break;
                }
            }
        }
        return n;
    };
    // return number of pieces that can capture the oppo piece
    TDLearner.prototype.get_num_captures = function (agent, state) {
        var n = 0;
        for (var pieceName in agent.legalMoves) {
            for (var i in agent.legalMoves[pieceName]) {
                var move = agent.legalMoves[pieceName][i].toString();
                if (this.is_capture_move(agent, pieceName, move))
                    n++;
            }
        }
        return n;
    };
    return TDLearner;
}(Reorder_1.Reorder));
exports.TDLearner = TDLearner;
//# sourceMappingURL=TDLearner.js.map