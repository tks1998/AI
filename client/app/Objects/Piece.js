"use strict";
var Piece = (function () {
    function Piece(name, position, Reverse, Tname) {
        this.name = name;
        this.position = position;
        this.Reverse = true;
        this.truthname = Tname;
    }
    Piece.copyFromDict = function (dict) {
        return new Piece(dict.name, dict.position, dict.Reverse, dict.truthname);
    };
    Piece.prototype.moveTo = function (newPos) {
        this.position = newPos;
        this.name = this.truthname;
    };
    // return a copy of a piece
    Piece.prototype.copy = function () {
        return new Piece(this.name, this.position, this.Reverse, this.truthname);
    };
    Piece.prototype.update = function (name) {
        this.name = this.truthname;
    };
    return Piece;
}());
exports.Piece = Piece;
//# sourceMappingURL=Piece.js.map