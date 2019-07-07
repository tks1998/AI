import { Piece } from '../../Objects/Piece';
import { Rule } from '../../ChineseChess/Rule/Rule'
import { InitGame } from '../../ChineseChess/InitGame/init';

export class Agent {
    team: number;
    strategy: number = 0;
    legalMoves: {}; // name->[positions]
    moves: {};
    pastMoves = [];
    myPieces: Piece[];
    oppoPieces: Piece[];
    oppoAgent: Agent;
    // myPiecesDic: {}; // {name -> pos}
    boardState: {}; // {posStr->[name, isMyPiece]}
 
    DEPTH = 0;
    reverse = false;
    typechess = false;
    InitPiece = null;

    // team == 1 -> Red , team !=1 -> Black team 
    // mask co up -> add value typechess
    // InitPiece from input of phayer
    constructor(team: number, reverse = false, strategy = 0,dept=0 , typechess = false, InitPiece = null, myPieces = null, pastMoves = [] ) {
        this.team = team;
        this.reverse = reverse;
       
        if (typechess == false) {
            if (myPieces == null ){
                this.myPieces = (team == 1 ? InitGame.getRedPieces(this.reverse) : InitGame.getBlackPieces(this.reverse));
            } else {
                this.myPieces = myPieces;
            }
        } 
        if (typechess){
                this.myPieces = InitPiece ;
        }
        this.pastMoves = pastMoves;
        this.strategy = strategy;
        this.DEPTH = dept;
    }
    setOppoAgent(oppoAgent) {
        this.oppoAgent = oppoAgent;
        this.oppoPieces = oppoAgent.myPieces;
        this.updateState();
    }
    // return | 1:win | -1:lose | 0:continue
    updateState() {
        this.updateBoardState();
        this.computeLegalMoves();
    }

    // compute legals moves for my pieces after state updated
    computeLegalMoves() {
        this.legalMoves = Rule.allPossibleMoves(this.myPieces, this.boardState, this.team, this.reverse);
    }

    checkMate() {
        return Rule.checkMate(this.myPieces, this.oppoPieces, this.boardState, this.team, this.reverse);
    }

    // update board state by pieces
    updateBoardState() {
        var state = {};
        for (var i in this.myPieces) state[this.myPieces[i].position.toString()] = [this.myPieces[i].name, true];
        for (var i in this.oppoPieces) state[this.oppoPieces[i].position.toString()] = [this.oppoPieces[i].name, false];
        this.boardState = state;
    }
    movePieceTo(piece: Piece, pos, isCapture = undefined) {
        
            piece.moveTo(pos);
            this.addMove(piece.name, pos);
        if (isCapture == undefined) 
            isCapture = this.oppoPieces.filter(x => x.position + '' == pos + '').length > 0;
        // having oppo piece in target pos
        if (isCapture) this.captureOppoPiece(pos);
        
    }

    // capture piece of opponent
    // pos: position of piece to be captured
    captureOppoPiece(pos) {
        for (var i = 0; i < this.oppoPieces.length; i++) {
            if (this.oppoPieces[i].position + '' == pos + '') {
                this.oppoPieces.splice(i, 1); // remove piece from pieces
                return;
            }
        }
    }

    // add move to pastMoves
    addMove(pieceName, pos) {
        this.pastMoves.push({ "name": pieceName, "position": pos });
    }

    // agent take action
    nextMove() {
        var computeResult = this.comptuteNextMove();
        var piece = computeResult[0];
        var toPos = computeResult[1];
        this.movePieceTo(piece, toPos);
    };

    
    // TO BE IMPLEMENTED BY CHILD CLASS
    // return: [piece, toPos]
    comptuteNextMove() { alert("YOU SHOULD NOT CALL THIS!") }

    getPieceByName(name) {
        return this.myPieces.filter(x => x.name == name)[0];
    }
    copy() {
       
        return new Agent(this.team, this.reverse, this.strategy ,this.DEPTH ,false , null , this.myPieces.map(x => x.copy()), this.copyMoves());
    }


    copyMoves() {
        return this.pastMoves.slice();
    }
}
