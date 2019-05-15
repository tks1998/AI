"use strict";
var RPiece = (function () {
    function RPiece(name, position, Reverse, Tname) {
        this.name = name;
        this.position = position;
        this.Reverse = true;
        this.truthname = Tname;
    }
    RPiece.copyFromDict = function (dict) {
        return new RPiece(dict.name, dict.position, dict.Reverse, dict.truthname);
    };
    RPiece.prototype.moveTo = function (newPos) {
        this.position = newPos;
        this.name = this.truthname;
    };
    // return a copy of a piece
    RPiece.prototype.copy = function () {
        return new RPiece(this.name, this.position, this.Reverse, this.truthname);
    };
    RPiece.prototype.update = function (name) {
        this.name = this.truthname;
    };
    return RPiece;
}());
exports.RPiece = RPiece;
//# sourceMappingURL=RPiece.js.map