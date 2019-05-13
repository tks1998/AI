"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Agent_1 = require('../Agent/Agent');
var MCTS = (function (_super) {
    __extends(MCTS, _super);
    function MCTS(team, N, myPieces, pastMoves) {
        if (myPieces === void 0) { myPieces = undefined; }
        if (pastMoves === void 0) { pastMoves = []; }
        _super.call(this, team, myPieces, pastMoves);
        this.strategy = 5;
        this.N_SIMULATION = N;
    }
    MCTS.prototype.copy = function () {
        return new MCTS(this.team, this.N_SIMULATION, this.myPieces.map(function (x) { return x.copy(); }), this.pastMoves);
    };
    return MCTS;
}(Agent_1.Agent));
exports.MCTS = MCTS;
//# sourceMappingURL=MCTS.js.map