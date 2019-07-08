"use strict";
var Agent_1 = require('../Agent/Agent');
var GreedyAgent_1 = require('../Greedy/GreedyAgent');
var ABPruning_1 = require('../ABPruning/ABPruning');
var MCTS_1 = require('../MCTS/MCTS');
var Rule_1 = require('../../ChineseChess/Rule/Rule');
var Ultimate_algorthm_1 = require('../Ultimate_algorthm/Ultimate_algorthm');
var State = (function () {
    function State(redAgent, blacAgent, playingTeam, reverse, updateDict) {
        if (playingTeam === void 0) { playingTeam = 1; }
        if (updateDict === void 0) { updateDict = false; }
        this.is_repeating = false;
        this.reverse = false;
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        this.blackAgent.setOppoAgent(this.redAgent);
        this.redAgent.setOppoAgent(this.blackAgent);
        this.reverse = reverse;
    }
    // return playing agent in control
    State.prototype.get_playing_agent = function () { return this.playingTeam == 1 ? this.redAgent : this.blackAgent; };
    // return | 1:win | -1:lose | 0:continue for playing team
    State.prototype.getEndState = function () {
        var playing = this.get_playing_agent();
        var endState = Rule_1.Rule.getGameEndState(playing);
        return endState;
    };
    // return a copy of state
    State.prototype.copy = function () { return new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam, this.reverse); };
    // return next state by action
    State.prototype.next_state = function (movePieceName, toPos) {
        return this.get_next_by_team(movePieceName, toPos, this.playingTeam);
    };
    State.prototype.checkMate = function () {
        //this.blackAgent.updateBoardState();
        return this.blackAgent.checkMate();
    };
    State.prototype.get_next_by_team = function (movePieceName, toPos, team) {
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = nextState.get_playing_agent().oppoAgent;
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        return nextState;
    };
    State.prototype.switchTurn = function () { this.playingTeam = -this.playingTeam; };
    // return a evaluation score for this state
    State.prototype.getEvaludation = function (team) { };
    State.samveMove = function (move1, move2) {
        return move1.name == move2.name && (move1.position.toString() == move2.position.toString());
    };
    State.check_repeating = function (agent) {
        var moves = agent.pastMoves;
        var n = moves.length;
        // if (n < 6) return false;
        // if (this.samveMove(moves[n - 1], moves[n - 3]) && this.samveMove(moves[n - 5], moves[n - 3])) {
        if (n < 3)
            return false;
        if (this.samveMove(moves[n - 1], moves[n - 3])) {
            console.log(moves);
            return true;
        }
        ;
        return false;
    };
    State.copyFromDict = function (dict) {
        var agentDict;
        var agentDict = dict.blackAgent;
        var oppo = dict.redAgent;
        var IsReverse = dict.reverse;
        oppo = Agent_1.Agent.copyFromDict(oppo);
        var agent;
        var is_repeating = this.check_repeating(agentDict);
        if (IsReverse)
            agent = Ultimate_algorthm_1.Ultimate_algorthm.copyFromDict(agentDict);
        if (agentDict.strategy == 0)
            agent = GreedyAgent_1.GreedyAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 1)
            agent = ABPruning_1.ABPruning.copyFromDict(agentDict);
        if (agentDict.strategy == 2)
            agent = MCTS_1.MCTS.copyFromDict(agentDict);
        var new_state;
        if (dict.playingTeam == 1)
            new_state = new State(agent, oppo, dict.playingTeam, IsReverse);
        else
            new_state = new State(oppo, agent, dict.playingTeam, IsReverse);
        new_state.is_repeating = is_repeating;
        return new_state;
    };
    // nextMove() {
    //     var agent = this.get_playing_agent();
    //     var r = null;
    //     if (agent.check_king_exist()) {
    //         r = agent.comptuteNextMove(this);
    //     } else console.log("-=-=-=-=-=- KING DIED -=-=-=-=-=-", r)
    //     return r;
    // }
    State.prototype.nextMove = function () {
        var agent = this.get_playing_agent();
        var r = null;
        if (agent.check_king_exist()) {
            if (!this.is_repeating)
                r = agent.comptuteNextMove(this);
            else {
                console.log("REPEATING ");
                agent.updateState();
                r = agent.random_move();
            }
        }
        else
            console.log("-=-=-=-=-=- KING DIED -=-=-=-=-=-", r);
        return r;
    };
    State.prototype.setStateCheckMate = function () {
        var agent = this.get_playing_agent();
        agent.updateState();
    };
    return State;
}());
exports.State = State;
//# sourceMappingURL=State.js.map