"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Agent_1 = require('../Agent/Agent');
var EvalFnAgent = (function (_super) {
    __extends(EvalFnAgent, _super);
    function EvalFnAgent(team, depth, myPieces, pastMoves) {
        if (depth === void 0) { depth = 2; }
        if (myPieces === void 0) { myPieces = null; }
        if (pastMoves === void 0) { pastMoves = []; }
        // console.log("EvalFnAgent")
        _super.call(this, team, myPieces, pastMoves);
        this.DEPTH = 2;
        this.strategy = 1;
        this.DEPTH = depth;
    }
    // return a copy of an agent
    EvalFnAgent.prototype.copy = function () {
        return new EvalFnAgent(this.team, this.DEPTH, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves());
    };
    return EvalFnAgent;
}(Agent_1.Agent));
exports.EvalFnAgent = EvalFnAgent;
//# sourceMappingURL=EvaluationFn.js.map