import { Rule } from '../Rule/Rule' ;
import { RPiece } from '../../Objects/RPiece'
export class Rrule extends Rule {
    // R : reverse  , co tuong up   
    // overide chesse si and tinh  

    possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam) {
        var moves = [];
        var dx = [-1,1,0,0];
        var dy = [0,0,-1,1];
        var newCol , newRow ;
        for (var pos = 0 ; pos<4 ; pos++)
        {
            newRow = newRow + dx[pos] ; 
            newCol = newCol + dy[pos] ;
            if ( [newRow,newCol].toString() in boardStates)
            {
                moves.push([newRow,newCol]);
            } 
        }
        return moves;
    }
    possibleMovesForShiang(currRow, currCol, boardStates, isLowerTeam)
    {
        var moves = [];
        var dx = [-2,2,2,-2];
        var dy = [-2,2,-2,2];
        var newCol , newRow ;
        for (var pos = 0 ; pos<4 ; pos++)
        {
            newRow = newRow + dx[pos] ; 
            newCol = newCol + dy[pos] ;
            if ( [newRow,newCol].toString() in boardStates)
            {
                moves.push([newRow,newCol]);
            } 
        }
        return moves;
    }
    // @param: return
    // 0: not end
    // 1: Win
    // -1: Lase
    // {posStr->[name, isMyPiece]}
    possibleMoves = function(piece: RPiece, boardStates: {}, isLowerTeam) {
        var name = piece.name[0];
        var currRow = piece.position[0];
        var currCol = piece.position[1];
        var moves = [];

        switch (name) {
            case 'j':
                moves = this.possibleMovesForJu(currRow, currCol, boardStates);
                break
            case 'm':
                moves = this.possibleMovesForMa(currRow, currCol, boardStates);
                break
            case 'x':
                moves = this.possibleMovesForXiang(currRow, currCol, boardStates, isLowerTeam);
                break
            case 's':
                moves = this.possibleMovesForShi(currRow, currCol, boardStates, isLowerTeam);
                break
            case 'k':
                moves = this.possibleMovesForKing(currRow, currCol, boardStates);
                break
            case 'p':
                moves = this.possibleMovesForPao(currRow, currCol, boardStates);
                break
            case 'z':
                moves = this.possibleMovesForZu(currRow, currCol, boardStates, isLowerTeam);
                break
        }
        // console.log(piece.name, moves);
        moves = this.filterBoundedMoves(currRow, currCol, moves, boardStates);
        return moves;
    }
    allPossibleMoves = function(myPieces: RPiece[], boardStates: {}, team) {
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
    }
    getGameEndStateByState = function(myPieces: RPiece[], oppoPieces: RPiece[], boardState, team) {
        var myKing = myPieces.filter(x => x.name == 'k')[0];
        var oppoKing = oppoPieces.filter(x => x.name == 'k')[0];
        if (!myKing) return -1;
        if (!oppoKing) return 1;
        var myKingCol = myKing.position[1];
        // not on the same col
        if (myKingCol != oppoKing.position[1]) return 0;
        if (team == 1) {
            var minRow = myKing.position[0] + 1;
            var maxRow = oppoKing.position[0] - 1;
        } else {
            var minRow = oppoKing.position[0] + 1;
            var maxRow = myKing.position[0] - 1;
        }
        if (this.hasPieceOnRows(myKingCol, minRow, maxRow, boardState)) return 0;
        return 1;
    }
}