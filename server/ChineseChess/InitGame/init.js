"use strict";
var Piece_1 = require('../../Objects/Piece');
var InitGame = (function () {
    function InitGame() {
    }
    InitGame.RandomPosition = function () {
        // prepare module combiatorics from javascrtip 
        // get next permutation in reserse game  
        var Rand = [0, 5, 13, 7, 6, 4, 1, 3, 2, 10, 9, 8, 11, 12, 14];
        return Rand;
    };
    InitGame.getRedPieces = function (reverse) {
        if (reverse === void 0) { reverse = false; }
        // make state game 
        // If reverse game then random position for piece expect boss
        // call RandomPosition() random possition
        var RedTeam = [[1, 1], [1, 9], [3, 2], [3, 8], [1, 2], [1, 8], [1, 3], [1, 7], [1, 4], [1, 6],
            [4, 1], [4, 3], [4, 5], [4, 7], [4, 9]];
        var Newname = ['j1', 'j2', 'p1', 'p2', 'm1', 'm2', 'x1', 'x2', 's1', 's2', 'z1', 'z2', 'z3', 'z4', 'z5', 'k'];
        var Tname = Newname;
        var rand = [];
        if (reverse) {
            Newname = ['j3', 'j4', 'p3', 'p4', 'm3', 'm4', 'x3', 'x4', 's3', 's4', 'z6', 'z7', 'z8', 'z9', 'z10', 'k'];
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
        if (reverse === void 0) { reverse = false; }
        var BlueTeam = [[10, 1], [10, 9], [8, 2], [8, 8], [10, 2], [10, 8], [10, 3], [10, 7],
            [10, 4], [10, 6], [7, 1], [7, 3], [7, 5], [7, 7], [7, 9]];
        var Newname = ['j1', 'j2', 'p1', 'p2', 'm1', 'm2', 'x1', 'x2', 's1', 's2', 'z1', 'z2', 'z3', 'z4', 'z5', 'k'];
        var Tname = Newname;
        var rand = [];
        if (reverse) {
            Newname = ['j3', 'j4', 'p3', 'p4', 'm3', 'm4', 'x3', 'x4', 's3', 's4', 'z6', 'z7', 'z8', 'z9', 'z10', 'k'];
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
    return InitGame;
}());
exports.InitGame = InitGame;
//# sourceMappingURL=init.js.map