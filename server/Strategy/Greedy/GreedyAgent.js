"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Agent_1 = require('../Agent/Agent');
var GreedyAgent = (function (_super) {
    __extends(GreedyAgent, _super);
    function GreedyAgent() {
        _super.apply(this, arguments);
        this.strategy = 0;
        this.DEPTH = 1;
    }
    // private method of computing next move
    GreedyAgent.prototype.comptuteNextMove = function (state) {
        this.updateState();
        return this.greedy_move();
    };
    GreedyAgent.copyFromDict = function (dict) {
        return new GreedyAgent(dict.team, this.piecesFromDict(dict.myPieces));
    };
    return GreedyAgent;
}(Agent_1.Agent));
exports.GreedyAgent = GreedyAgent;
//# sourceMappingURL=GreedyAgent.js.map