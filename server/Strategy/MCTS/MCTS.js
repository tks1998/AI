"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Agent_1 = require('../Agent/Agent');
var MCTS_State_1 = require('./MCTS_State');
var MCTS = (function (_super) {
    __extends(MCTS, _super);
    function MCTS(team, reverese, strategy, pieces, N) {
        _super.call(this, team, reverese, strategy, pieces);
        this.strategy = 2;
        (N == 2) ? this.N_SIMULATION = 2000 : this.N_SIMULATION = N;
    }
    MCTS.copyFromDict = function (dict) {
        return new MCTS(dict.team, dict.reverse, dict.strategy, this.piecesFromDict(dict.myPieces), dict.DEPTH);
    };
    // return [piece:Piece, toPos];
    // MCTS main 
    MCTS.prototype.comptuteNextMove = function (state) {
        var root = new MCTS_State_1.MCTS_State(state, null);
        // console.log("root:", root.visits);
        var i_simulation = 1;
        while (i_simulation <= this.N_SIMULATION) {
            // console.log("======================", i_simulation, "======================")
            i_simulation += 1;
            var seleted_state = this.select(root);
            var simulated_state = this.simulate(root, seleted_state);
            if (simulated_state)
                this.back_propagate(simulated_state);
        }
        var r = this.pick_max_UCB_child(root).parentMove;
        // console.log("======================MOVE: ", r, "======================")
        return r;
    };
    // select one child node to simulate
    // return null if end state
    MCTS.prototype.select = function (mcts_state) {
        // not visited before, need to generate child ndoes
        if (mcts_state.parent && mcts_state.visits == 0) {
            mcts_state.visits = 1;
            return mcts_state;
        }
        if (!mcts_state.children)
            mcts_state.generate_children();
        var unvisited = mcts_state.children.filter(function (x) { return x.visits == 0; });
        if (unvisited.length > 0)
            return unvisited[0];
        var selected = this.pick_max_UCB_child(mcts_state);
        if (selected)
            return this.select(selected);
        else
            return mcts_state;
    };
    MCTS.prototype.pick_max_UCB_child = function (mcts_state) {
        var selected = null;
        var max_value = -Infinity;
        for (var i in mcts_state.children) {
            var child = mcts_state.children[i];
            var v = child.UCB_valule();
            // console.log("ucb value:", v)
            if (v > max_value) {
                max_value = v;
                selected = child;
            }
        }
        return selected;
    };
    MCTS.prototype.simulate = function (root_state, selected) {
        var move = selected.state.get_playing_agent().updateState().greedy_move();
        if (move.length == 0)
            return null;
        var nextState = selected.state.next_state(move[0].name, move[1]);
        var mcts_new_state = new MCTS_State_1.MCTS_State(nextState, move);
        mcts_new_state.visits += 1;
        mcts_new_state.set_parent(selected);
        mcts_new_state.sum_score += (mcts_new_state.state.redAgent.getValueOfState(mcts_new_state.state)) * root_state.state.playingTeam;
        return mcts_new_state;
    };
    MCTS.prototype.back_propagate = function (simulated_state) {
        var temp = simulated_state;
        var added_score = simulated_state.sum_score;
        while (temp.parent) {
            temp.parent.visits += 1;
            temp.parent.sum_score += added_score;
            temp = temp.parent;
        }
    };
    return MCTS;
}(Agent_1.Agent));
exports.MCTS = MCTS;
//# sourceMappingURL=MCTS.js.map