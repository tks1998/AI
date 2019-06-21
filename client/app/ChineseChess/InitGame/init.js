"use strict";
var Piece_1 = require('../../Objects/Piece');
var InitGame = (function () {
    function InitGame() {
    }
    InitGame.RandomPosition = function () {
        // prepare module combiatorics from javascript 
        // get next permutation in reserse game  
        var Rand = [
            [0, 5, 13, 7, 6, 4, 1, 3, 2, 10, 9, 8, 11, 12, 14],
            [5, 3, 9, 7, 10, 12, 4, 6, 0, 14, 1, 8, 2, 11, 13],
            [1, 3, 5, 2, 9, 8, 11, 6, 7, 14, 4, 10, 12, 13, 0],
            [4, 7, 9, 10, 3, 5, 6, 2, 11, 8, 14, 12, 0, 13, 1],
            [8, 0, 10, 12, 5, 11, 7, 14, 9, 13, 1, 2, 6, 4, 3],
            [0, 4, 14, 8, 12, 11, 5, 6, 3, 7, 9, 10, 1, 2, 13],
            [11, 4, 3, 10, 12, 9, 2, 6, 0, 1, 7, 5, 14, 8, 13],
            [10, 2, 8, 6, 11, 13, 12, 14, 1, 7, 3, 9, 0, 5, 4],
            [13, 5, 7, 10, 8, 1, 14, 11, 4, 9, 6, 0, 3, 2, 12],
            [1, 13, 6, 14, 4, 5, 11, 9, 3, 8, 12, 2, 7, 10, 0],
            [2, 0, 11, 3, 14, 5, 8, 12, 4, 7, 6, 13, 10, 1, 9],
            [0, 1, 8, 5, 4, 11, 2, 7, 12, 14, 10, 9, 6, 3, 13],
            [3, 6, 14, 11, 0, 4, 9, 10, 7, 5, 13, 1, 2, 8, 12],
            [7, 1, 6, 8, 3, 2, 4, 13, 10, 11, 0, 9, 12, 14, 5],
            [12, 9, 10, 0, 1, 11, 2, 5, 13, 6, 3, 14, 4, 7, 8],
            [9, 5, 10, 12, 1, 6, 13, 14, 8, 0, 7, 2, 11, 4, 3],
            [12, 1, 2, 10, 4, 8, 11, 6, 0, 3, 13, 5, 14, 9, 7],
            [10, 4, 11, 5, 3, 9, 2, 12, 7, 13, 6, 8, 14, 1, 0],
            [10, 7, 4, 13, 2, 5, 11, 14, 0, 9, 8, 6, 12, 3, 1],
            [14, 7, 10, 12, 9, 6, 1, 13, 3, 5, 0, 11, 8, 2, 4]
        ];
        var max = Math.floor(19);
        var min = Math.ceil(0);
        var x = Math.floor(Math.random() * (max - min + 1)) + min;
        return Rand[x];
    };
    InitGame.getRedPieces = function (reverse) {
        // make state game 
        // If reverse game then random position for piece expect king
        // call RandomPosition() random possition
        var RedTeam = [[1, 1], [1, 9], [3, 2], [3, 8], [1, 2], [1, 8], [1, 3], [1, 7], [1, 4], [1, 6],
            [4, 1], [4, 3], [4, 5], [4, 7], [4, 9]];
        var Newname = ['j1', 'j2', 'p1', 'p2', 'm1', 'm2', 'x1', 'x2', 's1', 's2', 'z1', 'z2', 'z3', 'z4', 'z5', 'k'];
        var Tname = Newname;
        var rand = [];
        if (reverse) {
            rand = this.RandomPosition();
            for (var ele = 0; ele < RedTeam.length; ele++) {
                Tname[ele] = Newname[rand[ele]];
            }
        }
        return [
            new Piece_1.Piece('j1', RedTeam[0], reverse, Tname[0], 0),
            new Piece_1.Piece('j2', RedTeam[1], reverse, Tname[1], 0),
            new Piece_1.Piece('p1', RedTeam[2], reverse, Tname[2], 0),
            new Piece_1.Piece('p2', RedTeam[3], reverse, Tname[3], 0),
            new Piece_1.Piece('m1', RedTeam[4], reverse, Tname[4], 0),
            new Piece_1.Piece('m2', RedTeam[5], reverse, Tname[5], 0),
            new Piece_1.Piece('x1', RedTeam[6], reverse, Tname[6], 0),
            new Piece_1.Piece('x2', RedTeam[7], reverse, Tname[7], 0),
            new Piece_1.Piece('s1', RedTeam[8], reverse, Tname[8], 0),
            new Piece_1.Piece('s2', RedTeam[9], reverse, Tname[9], 0),
            new Piece_1.Piece('z1', RedTeam[10], reverse, Tname[10], 0),
            new Piece_1.Piece('z2', RedTeam[11], reverse, Tname[11], 0),
            new Piece_1.Piece('z3', RedTeam[12], reverse, Tname[12], 0),
            new Piece_1.Piece('z4', RedTeam[13], reverse, Tname[13], 0),
            new Piece_1.Piece('z5', RedTeam[14], reverse, Tname[14], 0),
            new Piece_1.Piece('k', [1, 5], 1, 'k', 0)
        ];
    };
    InitGame.getRedPieces1 = function (reverse) {
        // make state game 
        // If reverse game then random position for piece expect king
        // call RandomPosition() random possition
        var RedTeam = [[1, 1], [1, 9], [3, 2], [3, 8], [1, 2], [1, 8], [1, 3], [1, 7], [1, 4], [1, 6],
            [4, 1], [4, 3], [4, 5], [4, 7], [4, 9]];
        var Newname = ['j1', 'j2', 'p1', 'p2', 'm1', 'm2', 'x1', 'x2', 's1', 's2', 'z1', 'z2', 'z3', 'z4', 'z5', 'k'];
        var Tname = Newname;
        var rand = [];
        if (reverse) {
            rand = this.RandomPosition();
            for (var ele = 0; ele < RedTeam.length; ele++) {
                Tname[ele] = Newname[rand[ele]];
            }
        }
        return [
            new Piece_1.Piece('j1', RedTeam[0], reverse, Tname[0], 0),
            new Piece_1.Piece('j2', RedTeam[1], reverse, Tname[1], 0),
            new Piece_1.Piece('p1', RedTeam[2], reverse, Tname[2], 0),
            new Piece_1.Piece('p2', RedTeam[3], reverse, Tname[3], 0),
            new Piece_1.Piece('m1', RedTeam[4], reverse, Tname[4], 0),
            new Piece_1.Piece('m2', RedTeam[5], reverse, Tname[5], 0),
            new Piece_1.Piece('x1', RedTeam[6], reverse, Tname[6], 0),
            new Piece_1.Piece('x2', RedTeam[7], reverse, Tname[7], 0),
            new Piece_1.Piece('s1', RedTeam[8], reverse, Tname[8], 0),
            new Piece_1.Piece('s2', RedTeam[9], reverse, Tname[9], 0),
            new Piece_1.Piece('z1', RedTeam[10], reverse, Tname[10], 0),
            new Piece_1.Piece('z2', RedTeam[11], reverse, Tname[11], 0),
            new Piece_1.Piece('z3', RedTeam[12], reverse, Tname[12], 0),
            new Piece_1.Piece('z4', RedTeam[13], reverse, Tname[13], 0),
            new Piece_1.Piece('z5', RedTeam[14], reverse, Tname[14], 0),
            new Piece_1.Piece('k', [1, 5], 1, 'k', 0)
        ];
    };
    InitGame.getBlackPieces = function (reverse) {
        var BlueTeam = [[10, 1], [10, 9], [8, 2], [8, 8], [10, 2], [10, 8], [10, 3], [10, 7],
            [10, 4], [10, 6], [7, 1], [7, 3], [7, 5], [7, 7], [7, 9]];
        var Newname = ['j1', 'j2', 'p1', 'p2', 'm1', 'm2', 'x1', 'x2', 's1', 's2', 'z1', 'z2', 'z3', 'z4', 'z5', 'k'];
        var Tname = Newname;
        var rand = [];
        if (reverse) {
            rand = this.RandomPosition();
            for (var ele = 0; ele < BlueTeam.length; ele++) {
                Tname[ele] = Newname[rand[ele]];
            }
        }
        return [
            new Piece_1.Piece('j1', BlueTeam[0], reverse, Tname[0], 0),
            new Piece_1.Piece('j2', BlueTeam[1], reverse, Tname[1], 0),
            new Piece_1.Piece('p1', BlueTeam[2], reverse, Tname[2], 0),
            new Piece_1.Piece('p2', BlueTeam[3], reverse, Tname[3], 0),
            new Piece_1.Piece('m1', BlueTeam[4], reverse, Tname[4], 0),
            new Piece_1.Piece('m2', BlueTeam[5], reverse, Tname[5], 0),
            new Piece_1.Piece('x1', BlueTeam[6], reverse, Tname[6], 0),
            new Piece_1.Piece('x2', BlueTeam[7], reverse, Tname[7], 0),
            new Piece_1.Piece('s1', BlueTeam[8], reverse, Tname[8], 0),
            new Piece_1.Piece('s2', BlueTeam[9], reverse, Tname[9], 0),
            new Piece_1.Piece('z1', BlueTeam[10], reverse, Tname[10], 0),
            new Piece_1.Piece('z2', BlueTeam[11], reverse, Tname[11], 0),
            new Piece_1.Piece('z3', BlueTeam[12], reverse, Tname[12], 0),
            new Piece_1.Piece('z4', BlueTeam[13], reverse, Tname[13], 0),
            new Piece_1.Piece('z5', BlueTeam[14], reverse, Tname[14], 0),
            new Piece_1.Piece('k', [10, 5], 1, 'k', 0)
        ];
    };
    // support china chess -> resolve any state 
    // make red team
    InitGame.StateRed = function (team, currentstate, reverse) {
        if (reverse === void 0) { reverse = false; }
        var allPiece = [];
        for (var _i = 0, currentstate_1 = currentstate; _i < currentstate_1.length; _i++) {
            var element = currentstate_1[_i];
            allPiece.push(new Piece_1.Piece(element[0], [element[1], element[2]], reverse, element[0], 0));
        }
        return allPiece;
    };
    // make blue team
    InitGame.StateBlack = function (team, currentstate, reverse) {
        if (reverse === void 0) { reverse = false; }
        var allPiece = [];
        for (var _i = 0, currentstate_2 = currentstate; _i < currentstate_2.length; _i++) {
            var element = currentstate_2[_i];
            allPiece.push(new Piece_1.Piece(element[0], [element[1], element[2]], reverse, element[0], 0));
        }
        return allPiece;
    };
    return InitGame;
}());
exports.InitGame = InitGame;
//# sourceMappingURL=init.js.map