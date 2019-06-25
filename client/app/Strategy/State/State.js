"use strict";
var Rule_1 = require('../../ChineseChess/Rule/Rule');
// get current state red team && get current state blue team
var State = (function () {
    function State(redAgent, blacAgent, reverse, playingTeam, setOppoo) {
        if (playingTeam === void 0) { playingTeam = 1; }
        if (setOppoo === void 0) { setOppoo = true; }
        this.endFlag = null; // null: on going | 1: red win | -1: black win | 0: draw
        // create reverse check state piece && current support -> import data from user 
        this.reverse = false;
        this.currentstate = {};
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        this.reverse = reverse;
        if (setOppoo) {
            this.blackAgent.setOppoAgent(this.redAgent);
            this.redAgent.setOppoAgent(this.blackAgent);
        }
    }
    // return | 1:win | -1:lose | 0:continue for playing team
    State.prototype.getEndState = function () {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule_1.Rule.getGameEndState(playing);
        return endState;
    };
    // return a copy of state
    State.prototype.copy = function (setOppoo) {
        if (setOppoo === void 0) { setOppoo = true; }
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.reverse, this.playingTeam, setOppoo);
        return newState;
    };
    State.prototype.checkMate = function () {
        this.redAgent.updateBoardState();
        return this.redAgent.checkMate();
    };
    State.prototype.switchTurn = function () {
        this.playingTeam = -this.playingTeam;
    };
    State.prototype.getEvaludation = function (team) {
    };
    return State;
}());
exports.State = State;
//# sourceMappingURL=State.js.map