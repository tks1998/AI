"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TDLearner_1 = require('./TDLearner');
var TDLearnerTrained = (function (_super) {
    __extends(TDLearnerTrained, _super);
    function TDLearnerTrained() {
        _super.apply(this, arguments);
        this.strategy = 4;
        this.weights = [20, 15, 30, 7, 20, 0, 20];
    }
    return TDLearnerTrained;
}(TDLearner_1.TDLearner));
exports.TDLearnerTrained = TDLearnerTrained;
//# sourceMappingURL=TDLearnerTrained.js.map