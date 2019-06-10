"use strict";
var Piece = (function () {
    function Piece(name, position, Reverse, Tname, isMove) {
        this.name = name;
        this.position = position;
        this.Reverse = Reverse;
        this.truthname = Tname;
        this.isMove = 0;
    }
    Piece.copyFromDict = function (dict) {
        return new Piece(dict.name, dict.position, dict.Reverse, dict.truthname, dict.isMove);
    };
    Piece.prototype.moveTo = function (newPos) {
        console.log("toi loi", newPos);
        this.position = newPos;
        this.name = this.truthname;
        this.isMove = this.isMove + 1;
    };
    // return a copy of a piece
    Piece.prototype.copy = function () {
        return new Piece(this.name, this.position, this.Reverse, this.truthname, this.isMove);
    };
    Piece.prototype.update = function (name) {
        this.name = this.truthname;
    };
    return Piece;
}());
exports.Piece = Piece;
//# sourceMappingURL=Piece.js.map