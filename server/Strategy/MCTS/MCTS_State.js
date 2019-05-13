"use strict";
var MCTS_State = (function () {
    function MCTS_State(state, move) {
        this.sum_score = 0;
        this.visits = 0;
        this.EXP_RATE = 12000;
        this.state = state;
        this.parentMove = move;
    }
    MCTS_State.prototype.get_ave_score = function () {
        return this.sum_score / this.visits;
    };
    MCTS_State.prototype.UCB_valule = function () {
        var n = this.parent.visits;
        var visits = this.visits;
        var ave = this.get_ave_score();
        // console.log("ave:", ave)
        // console.log("visits:", visits)
        // console.log("n:", n)
        // console.log("Math.sqrt(2 * Math.log(n) / visits):", Math.sqrt(2 * Math.log(n) / visits))
        return ave + Math.sqrt(this.EXP_RATE * Math.log(n) / visits);
    };
    MCTS_State.prototype.depth = function () {
        var r = 0;
        var temp = this.parent;
        while (temp) {
            temp = temp.parent;
            r += 1;
        }
        return r;
    };
    MCTS_State.prototype.add_score = function (x) { this.sum_score += x; };
    MCTS_State.prototype.add_visit = function () { this.visits += 1; };
    MCTS_State.prototype.set_parent = function (x) { this.parent = x; };
    MCTS_State.prototype.generate_children = function () {
        this.children = [];
        var playing_agent = this.state.get_playing_agent();
        playing_agent.updateBoardState();
        // var endState = this.state.getEndState();
        // if (endState != 0) {
        //     var depth = this.depth();
        //     var sameAsRoot = (depth % 2 == 0 ? 1 : -1);
        //     this.sum_score = sameAsRoot * this.state.playingTeam * endState * Infinity;
        //     console.log("END: ", this.sum_score)
        //     return;
        // }
        playing_agent.computeLegalMoves();
        var moves = playing_agent.get_moves_arr();
        // console.log(moves, moves.length)
        for (var i in moves) {
            var movePieceName = moves[i][0];
            var move = moves[i][1];
            var nextState = this.state.next_state(movePieceName, move);
            var child = new MCTS_State(nextState, [playing_agent.getPieceByName(movePieceName), move]);
            child.set_parent(this);
            this.children.push(child);
        }
    };
    return MCTS_State;
}());
exports.MCTS_State = MCTS_State;
//# sourceMappingURL=MCTS_State.js.map