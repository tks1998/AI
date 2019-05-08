"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EvaluationFn_1 = require('../EvalFn/EvaluationFn');
var TDLearner = (function (_super) {
    __extends(TDLearner, _super);
    function TDLearner(team, depth, weights, myPieces, pastMoves) {
        if (depth === void 0) { depth = 2; }
        if (myPieces === void 0) { myPieces = null; }
        if (pastMoves === void 0) { pastMoves = []; }
        _super.call(this, team, depth, myPieces, pastMoves);
        this.strategy = 3;
        this.weights = [];
        // INIT_WEIGHTS = [20, 15, 30, 7, 20, 0, 20];
        // INIT_WEIGHTS = [0, 0, 0, 0, 0, 0, 0];
        this.INIT_WEIGHTS = [5, 10, 2, 0, 2, 0, 10];
        this.feature_matrix = []; //[fea_vec]
        this.weights = weights;
        // console.log(this.myPieces)
        // this.weights = weights ? weights : this.INIT_WEIGHTS;
    }
    TDLearner.prototype.copy = function () {
        // console.log(this.pastMoves)
        // console.log(this.copyMoves())
        return new TDLearner(this.team, this.DEPTH, this.weights, this.myPieces.map(function (x) { return x.copy(); }), this.copyMoves());
    };
    TDLearner.prototype.merge_arr = function (x, y) {
        var r = [];
        for (var i = 0; i < x.length; i++)
            r.push(x[i] + y[i]);
        return r;
    };
    // result: 1-red win | -1:red lose
    // [nThreat, nCapture, nCenterCannon, nBottomCannon, rook_mob, horse_mob, elephant_mob]
    TDLearner.prototype.update_weights = function (nSimulations, result) {
        var _this = this;
        if (result == 0)
            return this.weights;
        result *= this.team;
        // consolidate features vectors throught whole game into one
        // console.log("this.feature_matrix:", this.feature_matrix)
        var accu_fea = this.feature_matrix.reduce(this.merge_arr);
        accu_fea = accu_fea.map(function (x) { return x / _this.feature_matrix.length; });
        // var last_fea = this.feature_matrix[this.feature_matrix.length - 1];
        // var combined_fea = last_fea;
        // accu_fea = accu_fea.map(this.squash);
        // console.log("accu_fea:", accu_fea)
        // console.log("last_fea:", last_fea)
        // console.log("nSimulations:", nSimulations)
        var eta = 2 / Math.sqrt(nSimulations); // learning rate
        // console.log("eta:", eta)
        // var gradient = combined_fea.map(x => x * result);
        // console.log("gradient:", gradient)
        // console.log("this.weights:", this.weights)
        for (var i = 0; i < accu_fea.length; i++) {
            this.weights[i] += eta * result * (eta * accu_fea[i]);
            // this.weights[i] += eta * result * (10 * accu_fea[i] - this.weights[i] + 10 * last_fea[i]);
            // this.weights[i] += eta * (this.squash(gradient[i], this.weights[i]+1) - this.weights[i]);
            this.weights[i] = Math.min(Math.max(this.weights[i], 0), 20);
        }
        console.log("UPDATED WEIGHT:", this.weights);
        return this.weights;
    };
    TDLearner.prototype.squash = function (x, range) {
        if (range === void 0) { range = 20; }
        return (1 / (Math.exp(-x) + 1) - 0.5) * range;
    };
    TDLearner.prototype.save_state = function (feature_vec) {
        // console.log("save_state: ", feature_vec, " | Current: ", this.feature_matrix)
        this.feature_matrix.push(feature_vec);
    };
    return TDLearner;
}(EvaluationFn_1.EvalFnAgent));
exports.TDLearner = TDLearner;
//# sourceMappingURL=TDLearner.js.map