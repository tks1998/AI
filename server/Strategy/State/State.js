"use strict";
var Agent_1 = require('../Agent/Agent');
var GreedyAgent_1 = require('../Greedy/GreedyAgent');
var ABPruning_1 = require('../ABPruning/ABPruning');
var TDLearner_1 = require('../TDLearner/TDLearner');
var TDLearnerTrained_1 = require('../TDLearner/TDLearnerTrained');
var MCTS_1 = require('../MCTS/MCTS');
var Reorder_1 = require('../Reorder/Reorder');
var Rule_1 = require('../../ChineseChess/Rule/Rule');
var State = (function () {
    function State(redAgent, blacAgent, playingTeam, updateDict) {
        if (playingTeam === void 0) { playingTeam = 1; }
        if (updateDict === void 0) { updateDict = false; }
        this.is_repeating = false;
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        this.blackAgent.setOppoAgent(this.redAgent);
        this.redAgent.setOppoAgent(this.blackAgent);
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
    State.prototype.copy = function () { return new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam); };
    // return next state by action
    State.prototype.next_state = function (movePieceName, toPos) {
        return this.get_next_by_team(movePieceName, toPos, this.playingTeam);
    };
    State.prototype.get_next_by_team = function (movePieceName, toPos, team) {
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = nextState.get_playing_agent().oppoAgent;
        // console.log(agent)
        // console.log("movePieceName", movePieceName)
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        return nextState;
    };
    State.prototype.switchTurn = function () { this.playingTeam = -this.playingTeam; };
    // return a evaluation score for this state
    State.prototype.getEvaludation = function (team) { };
    State.check_repeating = function (agent) {
        var moves = agent.pastMoves;
        var n = moves.length;
        if (n < 10)
            return false;
        if (this.samveMove(moves[n - 1], moves[n - 3]) && this.samveMove(moves[n - 5], moves[n - 3])) {
            console.log(moves);
            return true;
        }
        ;
        return false;
    };
    State.samveMove = function (move1, move2) {
        return move1.name == move2.name && (move1.position.toString() == move2.position.toString());
    };
    State.copyFromDict = function (dict) {
        var agentDict;
        if (dict.playingTeam == 1) {
            var agentDict = dict.redAgent;
            var oppo = dict.blackAgent;
        }
        else {
            var agentDict = dict.blackAgent;
            var oppo = dict.redAgent;
        }
        oppo = Agent_1.Agent.copyFromDict(oppo);
        var agent;
        // console.log(agentDict.strategy)
        var is_repeating = this.check_repeating(agentDict);
        if (agentDict.strategy == 0)
            agent = GreedyAgent_1.GreedyAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 1)
            agent = ABPruning_1.ABPruning.copyFromDict(agentDict);
        if (agentDict.strategy == 2)
            agent = Reorder_1.Reorder.copyFromDict(agentDict);
        if (agentDict.strategy == 3)
            agent = TDLearner_1.TDLearner.copyFromDict(agentDict);
        if (agentDict.strategy == 4)
            agent = TDLearnerTrained_1.TDLearnerTrained.copyFromDict(agentDict);
        if (agentDict.strategy == 5)
            agent = MCTS_1.MCTS.copyFromDict(agentDict);
        var new_state;
        if (dict.playingTeam == 1)
            new_state = new State(agent, oppo, dict.playingTeam);
        else
            new_state = new State(oppo, agent, dict.playingTeam);
        new_state.is_repeating = is_repeating;
        return new_state;
    };
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
    return State;
}());
exports.State = State;
//# sourceMappingURL=State.js.map