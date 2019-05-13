"use strict";
var Rule = (function () {
    function Rule() {
    }
    Rule.hasPieceOnRows = function (col, minRow, maxRow, boardStates) {
        for (var i = minRow; i <= maxRow; i++) {
            if (boardStates[[i, col].toString()])
                return true;
        }
        return false;
    };
    Rule.numPieceOnRows = function (col, minRow, maxRow, boardStates) {
        var r = 0;
        for (var i = minRow; i <= maxRow; i++) {
            if (boardStates[[i, col].toString()])
                r += 1;
        }
        return r;
    };
    // return moves within board range and escape positions occupied by own team
    // boardStates: {posStr->[name, isMyPiece]}
    Rule.filterBoundedMoves = function (currRow, currCol, moves, boardStates) {
        var _this = this;
        // filter out invalied move
        return moves.filter(function (m) { return ((m[0] != currRow || m[1] != currCol) &&
            m[0] >= _this.minRow &&
            m[0] <= _this.maxRow &&
            m[1] <= _this.maxCol &&
            m[1] >= _this.minCol &&
            !(m.toString() in boardStates && boardStates[m.toString()][1])); });
    };
    Rule.movesOnSameLine = function (currRow, currCol, boardStates) {
        var moves = [];
        for (var i = currRow + 1; i <= this.maxRow; i++) {
            var k = [i, currCol].toString();
            if (k in boardStates) {
                if (!boardStates[k][1])
                    moves.push([i, currCol]);
                break;
            }
            moves.push([i, currCol]);
        }
        for (var j = currRow - 1; j >= this.minRow; j--) {
            var k = [j, currCol].toString();
            if (k in boardStates) {
                if (!boardStates[k][1])
                    moves.push([j, currCol]);
                break;
            }
            moves.push([j, currCol]);
        }
        for (var i = currCol + 1; i <= this.maxCol; i++) {
            var k = [currRow, i].toString();
            if (k in boardStates) {
                if (!boardStates[k][1])
                    moves.push([currRow, i]);
                break;
            }
            moves.push([currRow, i]);
        }
        for (var j = currCol - 1; j >= this.minCol; j--) {
            var k = [currRow, j].toString();
            if (k in boardStates) {
                if (!boardStates[k][1])
                    moves.push([currRow, j]);
                break;
            }
            moves.push([currRow, j]);
        }
        return moves;
    };
    // Ju
    Rule.possibleMovesForJu = function (currRow, currCol, boardStates) {
        return this.movesOnSameLine(currRow, currCol, boardStates);
    };
    // Ma
    Rule.possibleMovesForMa = function (currRow, currCol, boardStates) {
        var moves = [];
        if (!([currRow + 1, currCol].toString() in boardStates)) {
            moves.push([currRow + 2, currCol + 1]);
            moves.push([currRow + 2, currCol - 1]);
        }
        if (!([currRow - 1, currCol].toString() in boardStates)) {
            moves.push([currRow - 2, currCol + 1]);
            moves.push([currRow - 2, currCol - 1]);
        }
        if (!([currRow, currCol + 1].toString() in boardStates)) {
            moves.push([currRow + 1, currCol + 2]);
            moves.push([currRow - 1, currCol + 2]);
        }
        if (!([currRow, currCol - 1].toString() in boardStates)) {
            moves.push([currRow + 1, currCol - 2]);
            moves.push([currRow - 1, currCol - 2]);
        }
        return moves;
    };
    Rule.findFirstOpponentOnRow = function (row, startCol, states, team, incFn) {
        while (startCol >= this.minCol && startCol <= this.maxCol) {
            var k = [row, startCol].toString();
            if (k in states) {
                if (states[k][1])
                    return;
                else
                    return [row, startCol];
            }
            startCol = incFn(startCol);
        }
    };
    Rule.findFirstOpponentOnCol = function (col, startRow, states, team, incFn) {
        while (startRow >= this.minRow && startRow <= this.maxRow) {
            var k = [startRow, col].toString();
            if (k in states) {
                if (states[k][1])
                    return;
                else
                    return [startRow, col];
            }
            startRow = incFn(startRow);
        }
    };
    // Pao
    Rule.possibleMovesForPao = function (currRow, currCol, boardStates, team) {
        var inc = (function (x) { return x + 1; });
        var dec = (function (x) { return x - 1; });
        var moves = [];
        for (var i = currRow + 1; i <= this.maxRow; i++) {
            var k = [i, currCol].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnCol(currCol, i + 1, boardStates, team, inc);
                if (next)
                    moves.push(next);
                break;
            }
            moves.push([i, currCol]);
        }
        for (var j = currRow - 1; j >= this.minRow; j--) {
            var k = [j, currCol].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnCol(currCol, j - 1, boardStates, team, dec);
                if (next)
                    moves.push(next);
                break;
            }
            moves.push([j, currCol]);
        }
        for (var i = currCol + 1; i <= this.maxCol; i++) {
            var k = [currRow, i].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnRow(currRow, i + 1, boardStates, team, inc);
                if (next)
                    moves.push(next);
                break;
            }
            moves.push([currRow, i]);
        }
        for (var j = currCol - 1; j >= this.minCol; j--) {
            var k = [currRow, j].toString();
            if (k in boardStates) {
                var next = this.findFirstOpponentOnRow(currRow, j - 1, boardStates, team, dec);
                if (next)
                    moves.push(next);
                break;
            }
            moves.push([currRow, j]);
        }
        return moves;
    };
    // Shi
    Rule.possibleMovesForShi = function (currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        if (2 == currRow || currRow == 9) {
            moves = [
                [currRow - 1, currCol + 1],
                [currRow - 1, currCol - 1],
                [currRow + 1, currCol + 1],
                [currRow + 1, currCol - 1]
            ];
        }
        else {
            moves = isLowerTeam ? [[2, 5]] : [[9, 5]];
        }
        return moves;
    };
    // King
    Rule.possibleMovesForKing = function (currRow, currCol, boardStates) {
        var moves = [];
        for (var col = 4; col <= 6; col++)
            moves.push([currRow, col]);
        if (currRow < 5) {
            for (var row = 1; row <= 3; row++)
                moves.push([row, currCol]);
        }
        else {
            for (var row = 8; row <= 10; row++)
                moves.push([row, currCol]);
        }
        return moves.filter(function (x) { return ((x[0] - currRow) * (x[0] - currRow) + (x[1] - currCol) * (x[1] - currCol)) < 2; });
    };
    // Xiang
    Rule.possibleMovesForXiang = function (currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        var canMoveDowward = (isLowerTeam || currRow >= 8);
        var canMoveUpward = (currRow <= 3 || !isLowerTeam);
        if (canMoveUpward && !([currRow + 1, currCol + 1].toString() in boardStates))
            moves.push([currRow + 2, currCol + 2]);
        if (canMoveUpward && !([currRow + 1, currCol - 1].toString() in boardStates))
            moves.push([currRow + 2, currCol - 2]);
        if (canMoveDowward && !([currRow - 1, currCol + 1].toString() in boardStates))
            moves.push([currRow - 2, currCol + 2]);
        if (canMoveDowward && !([currRow - 1, currCol - 1].toString() in boardStates))
            moves.push([currRow - 2, currCol - 2]);
        return moves;
    };
    // Zu
    Rule.possibleMovesForZu = function (currRow, currCol, boardStates, isLowerTeam) {
        var beyond = isLowerTeam ? (currRow > 5) : (currRow <= 5); //beyond the river
        var moves = isLowerTeam ? [[currRow + 1, currCol]] : [[currRow - 1, currCol]];
        if (beyond) {
            moves.push([currRow, currCol - 1]);
            moves.push([currRow, currCol + 1]);
        }
        return moves;
    };
    Rule.minRow = 1;
    Rule.maxRow = 10;
    Rule.minCol = 1;
    Rule.maxCol = 9;
    // all legal moves for a piece in a board state
    // boardStates: {posStr->[name, isMyPiece]}
    // return [(row, col)]
    Rule.possibleMoves = function (piece, boardStates, isLowerTeam) {
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
    // return a list of all possible moves
    // boardStates: {posStr->[name, isMyPiece]}
    Rule.allPossibleMoves = function (myPieces, boardStates, team) {
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
    // @param: return
    // 0: not end
    // 1: Win
    // -1: Lase
    // {posStr->[name, isMyPiece]}
    Rule.getGameEndState = function (agent) {
        var myPieces = agent.myPieces;
        var oppoPieces = agent.oppoPieces;
        var boardState = agent.boardState;
        return this.getGameEndStateByState(myPieces, oppoPieces, boardState, agent.team);
    };
    Rule.getGameEndStateByState = function (myPieces, oppoPieces, boardState, team) {
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
    return Rule;
}());
exports.Rule = Rule;
//# sourceMappingURL=Rule.js.map