"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Piece_1 = require('./Piece');
var DummyPiece = (function (_super) {
    __extends(DummyPiece, _super);
    function DummyPiece(position) {
        _super.call(this, '', position);
    }
    return DummyPiece;
}(Piece_1.Piece));
exports.DummyPiece = DummyPiece;
//# sourceMappingURL=DummyPiece.js.map