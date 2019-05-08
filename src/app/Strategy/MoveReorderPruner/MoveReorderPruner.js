"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EvaluationFn_1 = require('../EvalFn/EvaluationFn');
var MoveReorderPruner = (function (_super) {
    __extends(MoveReorderPruner, _super);
    function MoveReorderPruner(team, depth, myPieces, pastMoves) {
        if (depth === void 0) { depth = 2; }
        if (myPieces === void 0) { myPieces = undefined; }
        if (pastMoves === void 0) { pastMoves = []; }
        _super.call(this, team, depth, myPieces, pastMoves);
        this.strategy = 2;
        this.DEPTH = depth;
    }
    MoveReorderPruner.prototype.copy = function () {
        return new MoveReorderPruner(this.team, this.DEPTH, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves());
    };
    return MoveReorderPruner;
}(EvaluationFn_1.EvalFnAgent));
exports.MoveReorderPruner = MoveReorderPruner;
//# sourceMappingURL=MoveReorderPruner.js.map