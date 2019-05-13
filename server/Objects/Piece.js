"use strict";
var Piece = (function () {
    function Piece(name, position) {
        this.name = name;
        this.position = position;
    }
    Piece.copyFromDict = function (dict) {
        return new Piece(dict.name, dict.position);
    };
    Piece.prototype.moveTo = function (newPos) {
        this.position = newPos;
    };
    // return a copy of a piece
    Piece.prototype.copy = function () {
        return new Piece(this.name, this.position);
    };
    return Piece;
}());
exports.Piece = Piece;
//# sourceMappingURL=Piece.js.map