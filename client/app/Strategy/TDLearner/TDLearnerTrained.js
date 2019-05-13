"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EvaluationFn_1 = require('../EvalFn/EvaluationFn');
var TDLearnerTrained = (function (_super) {
    __extends(TDLearnerTrained, _super);
    function TDLearnerTrained() {
        _super.apply(this, arguments);
        this.strategy = 4;
    }
    TDLearnerTrained.prototype.copy = function () { return new TDLearnerTrained(this.team, this.DEPTH, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves()); };
    return TDLearnerTrained;
}(EvaluationFn_1.EvalFnAgent));
exports.TDLearnerTrained = TDLearnerTrained;
//# sourceMappingURL=TDLearnerTrained.js.map