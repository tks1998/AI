"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Agent_1 = require('../Agent/Agent');
var Ultimate_algorthm = (function (_super) {
    __extends(Ultimate_algorthm, _super);
    function Ultimate_algorthm() {
        _super.apply(this, arguments);
        this.strategy = 0;
        this.DEPTH = 1;
    }
    // private method of computing next move
    Ultimate_algorthm.prototype.comptuteNextMove = function (state) {
        this.updateState();
        return this.greedy_move();
    };
    Ultimate_algorthm.copyFromDict = function (dict) {
        return new Ultimate_algorthm(dict.team, this.piecesFromDict(dict.myPieces));
    };
    return Ultimate_algorthm;
}(Agent_1.Agent));
exports.Ultimate_algorthm = Ultimate_algorthm;
//# sourceMappingURL=Ultimate_algorthm.js.map