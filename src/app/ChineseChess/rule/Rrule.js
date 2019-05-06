"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rule_1 = require('../rule/rule');
var Rrule = (function (_super) {
    __extends(Rrule, _super);
    function Rrule() {
        _super.apply(this, arguments);
        // @param: return
        // 0: not end
        // 1: Win
        // -1: Lase
        // {posStr->[name, isMyPiece]}
        this.possibleMoves = function (piece, boardStates, isLowerTeam) {
            var name = piece.name[0];
            var currRow = piece.position[0];
            var currCol = piece.position[1];
            var moves = [];
            switch (name) {
                case 'j':
                    moves = this.possibleMovesForJu(currRow, currCol, boardStates);
                    break;
                case 'm':
                    moves = this.possibleMovesForMa(currRow, currCol, boardStates);
                    break;
                case 'x':
                    moves = this.possibleMovesForXiang(currRow, currCol, boardStates, isLowerTeam);
                    break;
                case 's':
                    moves = this.possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam);
                    break;
                case 'k':
                    moves = this.possibleMovesForKing(currRow, currCol, boardStates);
                    break;
                case 'p':
                    moves = this.possibleMovesForPao(currRow, currCol, boardStates);
                    break;
                case 'z':
                    moves = this.possibleMovesForZu(currRow, currCol, boardStates, isLowerTeam);
                    break;
            }
            // console.log(piece.name, moves);
            moves = this.filterBoundedMoves(currRow, currCol, moves, boardStates);
            return moves;
        };
        this.allPossibleMoves = function (myPieces, boardStates, team) {
            var moves = {};
            // team is in the lower part of the river
            var isLowerTeam = (team == 1);
            for (var i in myPieces) {
                var piece = myPieces[i];
                var moves4Piece = this.possibleMoves(piece, boardStates, isLowerTeam);
                // console.log("moves4Piece", piece.name, moves4Piece)
                moves[piece.name] = moves4Piece;
            }
            return moves;
        };
        this.getGameEndStateByState = function (myPieces, oppoPieces, boardState, team) {
            var myKing = myPieces.filter(function (x) { return x.name == 'k'; })[0];
            var oppoKing = oppoPieces.filter(function (x) { return x.name == 'k'; })[0];
            if (!myKing)
                return -1;
            if (!oppoKing)
                return 1;
            var myKingCol = myKing.position[1];
            // not on the same col
            if (myKingCol != oppoKing.position[1])
                return 0;
            if (team == 1) {
                var minRow = myKing.position[0] + 1;
                var maxRow = oppoKing.position[0] - 1;
            }
            else {
                var minRow = oppoKing.position[0] + 1;
                var maxRow = myKing.position[0] - 1;
            }
            if (this.hasPieceOnRows(myKingCol, minRow, maxRow, boardState))
                return 0;
            return 1;
        };
    }
    // R : reverse  , co tuong up   
    // overide chesse si and tinh  
    Rrule.prototype.possibleMovesForShi = function (currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        var dx = [-1, 1, 0, 0];
        var dy = [0, 0, -1, 1];
        var newCol, newRow;
        for (var pos = 0; pos < 4; pos++) {
            newRow = newRow + dx[pos];
            newCol = newCol + dy[pos];
            if ([newRow, newCol].toString() in boardStates) {
                moves.push([newRow, newCol]);
            }
        }
        return moves;
    };
    Rrule.prototype.possibleMovesForShiang = function (currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        var dx = [-2, 2, 2, -2];
        var dy = [-2, 2, -2, 2];
        var newCol, newRow;
        for (var pos = 0; pos < 4; pos++) {
            newRow = newRow + dx[pos];
            newCol = newCol + dy[pos];
            if ([newRow, newCol].toString() in boardStates) {
                moves.push([newRow, newCol]);
            }
        }
        return moves;
    };
    return Rrule;
}(rule_1.Rule));
exports.Rrule = Rrule;
//# sourceMappingURL=Rrule.js.map