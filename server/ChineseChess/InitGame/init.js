"use strict";
var Piece_1 = require('../../Objects/Piece');
var InitGame = (function () {
    function InitGame() {
    }
    InitGame.getRedPieces = function () {
        return [
            new Piece_1.Piece('j1', [1, 1]),
            new Piece_1.Piece('j2', [1, 9]),
            new Piece_1.Piece('p1', [3, 2]),
            new Piece_1.Piece('p2', [3, 8]),
            new Piece_1.Piece('m1', [1, 2]),
            new Piece_1.Piece('m2', [1, 8]),
            new Piece_1.Piece('x1', [1, 3]),
            new Piece_1.Piece('x2', [1, 7]),
            new Piece_1.Piece('s1', [1, 4]),
            new Piece_1.Piece('s2', [1, 6]),
            new Piece_1.Piece('z1', [4, 1]),
            new Piece_1.Piece('z2', [4, 3]),
            new Piece_1.Piece('z3', [4, 5]),
            new Piece_1.Piece('z4', [4, 7]),
            new Piece_1.Piece('z5', [4, 9]),
            new Piece_1.Piece('k', [1, 5])
        ];
    };
    InitGame.getBlackPieces = function () {
        return [
            new Piece_1.Piece('j1', [10, 1]),
            new Piece_1.Piece('j2', [10, 9]),
            new Piece_1.Piece('p1', [8, 2]),
            new Piece_1.Piece('p2', [8, 8]),
            new Piece_1.Piece('m1', [10, 2]),
            new Piece_1.Piece('m2', [10, 8]),
            new Piece_1.Piece('x1', [10, 3]),
            new Piece_1.Piece('x2', [10, 7]),
            new Piece_1.Piece('s1', [10, 4]),
            new Piece_1.Piece('s2', [10, 6]),
            new Piece_1.Piece('z1', [7, 1]),
            new Piece_1.Piece('z2', [7, 3]),
            new Piece_1.Piece('z3', [7, 5]),
            new Piece_1.Piece('z4', [7, 7]),
            new Piece_1.Piece('z5', [7, 9]),
            new Piece_1.Piece('k', [10, 5])
        ];
    };
    return InitGame;
}());
exports.InitGame = InitGame;
//# sourceMappingURL=init.js.map