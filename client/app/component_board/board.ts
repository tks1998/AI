import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ComputeService } from '../service/service.compute';
import { Piece } from '../Objects/Piece';
import { DummyPiece } from '../Objects/DummyPiece';
import { State } from '../Strategy/State/State';
import { Agent } from '../Strategy/Agent/Agent';


@Component({
    selector: 'board',
    templateUrl: '../client/app/component_board/board.html',
    styleUrls: ['../client/app/component_board/board.css'],
    providers: [ComputeService]
})


export class BoardComponent implements OnInit {
    redTeam = 1;
    blackTeam = -1;
    boardState = {};
    state: State;
    server: ComputeService;

    private DEFAULT_TYPE = 0;
    blackAgentType = 0;
    DEFAULT_DEPTH = 2;
    blackAgentDepth = 2;
    blackAgentSimulations = 2000;
    pieceSize: number = 67;
    selectedPiece: Piece;
    dummyPieces: DummyPiece[] = [];
    lastState: State[] = Array();
    redo: State[] = Array();
    reverse = false;
    StateFlag = false;
    InputState: Object;


    runtime_dict = {};


    results = [];
    clear_results() {
        this.results = [];
    }
    changeMode() {
        this.reverse = !this.reverse;
        this.clear_results();
        this.initGame();
    }

    isPossibleMove(pos) {
        if (!this.selectedPiece) return false;
        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
        return moves.map(x => x + '').indexOf(pos + '') >= 0;
    }
    initDummyButtons() {
        this.dummyPieces = [];
        for (var i = 1; i <= 10; i++) {
            for (var j = 1; j <= 9; j++) {
                this.dummyPieces.push(new DummyPiece([i, j]));
            }
        }
    }


    parse_agentType(desc) {
        if (desc == "") {
            return 0;
        }
        return parseInt(desc.split('-')[0]);
    }

    chooseBlackAgent(desc) {
        this.blackAgentType = this.parse_agentType(desc);
        this.clear_results();
        this.initGame();
    }
    chooseBlackAgentDepth(depth) {
        this.blackAgentDepth = parseInt(depth);
        this.initGame();
    }


    ngOnInit() {
        this.initDummyButtons();
        this.initGame();
    }


    constructor(server: ComputeService) {
        this.server = server;
    }


    initGame() {
        this.selectedPiece = undefined;
        this.lastState = [];
        this.redo = [];
        var redAgent;
        var blackAgent;
        this.initDummyButtons();
        blackAgent = new Agent(this.blackTeam, this.reverse);

        redAgent = new Agent(this.redTeam, this.reverse);

        this.state = new State(redAgent, blackAgent, this.reverse);
    }


    clickDummyPiece(piece: Piece) {
        if (!this.isPossibleMove(piece.position) || this.state.endFlag != null) return;
        this.humanMove(piece);
    }


    clickRedPiece(piece: Piece) {
        if (this.state.endFlag != null) return;
        this.selectedPiece = piece;
    }


    clickBlackPiece(piece: Piece) {
        if (!this.isPossibleMove(piece.position) || this.state.endFlag != null) return;
        this.humanMove(piece);
    }


    humanMove(piece: Piece) {
        this.copyCurrentState();
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();
    }


    // end_state: -1: lose | 0: draw | 1: win
    end_game(end_state) {
        var red_win = end_state * this.state.playingTeam;
        this.state.endFlag = red_win;
        this.results.push(red_win);

        this.selectedPiece = undefined;
    }


    /** report_runtime(strategy, depth, time) {
         var type = this.runtime_dict[strategy + "-" + depth];
         if (!type) this.runtime_dict[strategy + "-" + depth] = [time, 1];
         else {
             var new_num = type[1] + 1;
             this.runtime_dict[strategy + "-" + depth] = [Math.ceil((type[0] * type[1] + time) / new_num), new_num]
         }
         // this.onTimeUpdated.emit();
     } */


    // switch game turn
    switchTurn() {
        this.state.switchTurn();
        var agent = (this.state.playingTeam == 1 ? this.state.redAgent : this.state.blackAgent);
        agent.updateState();
        // agent.nextMove();
        var endState = this.state.getEndState();
        if (endState != 0) {
            this.end_game(endState);
            return;
        }
        this.selectedPiece = undefined;
        if (this.state.playingTeam == 1) return;
        // this.switchTurn();
        // get move of sever and reder in page
        this.server.launchCompute(this.state.copy(false)).then(
            result => {
                var move = result['move'];
                var time = parseInt(result['time']);
                var state_feature = result['state_feature'];

                //if (state_feature) agent.save_state(state_feature);
                if (!move) { // FAIL
                    this.end_game(-1);
                    return;
                }
                if (move.length == 0) { // DRAW
                    this.end_game(0);
                    return;
                }

                var piece = agent.getPieceByName(move[0].name);
                if (move[1]) agent.movePieceTo(piece, move[1]);
                this.switchTurn();
            }
        );
    }
    // reverse game state to previous state

    go2PreviousState() {
        var id = this.lastState.length - 1; //id =1 
        if (this.state ! = this.lastState[id]) this.redo = [];
        if (this.lastState.length <= 0) return;
        //this.redo.push(this.lastState[size]);
        this.redo.push(this.state)
        this.state = this.lastState[id];
        if (id == 0) 
            this.lastState = [];
        else 
            this.lastState = this.lastState.slice(0, id);
    }
    CheckLastRedo(): Boolean {
        return this.redo.length > 0
    }
    Redo() {
        var id = this.redo.length - 1;
        var size = this.lastState.length -1 ;
        if (id >= 0) {
            this.state = this.redo[id];
            if (size>=0) this.lastState = this.lastState.slice(0,size)
            else this.lastState = [];
            this.lastState.push(this.state);
            this.redo = this.redo.splice(0, id);
        }

    }
    CheckLastState(): Boolean {
        //console.log(this.lastState.length)
        return this.lastState.length > 0;
    }
    copyCurrentState() {
        this.lastState.push(this.state.copy())
    }
    checkReverse(): Boolean {
        return this.reverse;
    }
    checkMove(currentpiece: Piece): Boolean {
        if (currentpiece.name[0] == 'k') return true;
        if (currentpiece.isMove > 0) return true;
        else return false;
    }
    runState() {
        console.log("success");
    }
    SaveState(input) {
        var xy = [input];
        this.InputState = xy;
    }


    SolveState() {
        var newstate = [];//this.InputState;
        var extract;
        var red = [], black = [], currentState = {};
        var key = null;

        for (var x of newstate) {
            extract = x.split(' ');
            if (extract[3] == "1") red.push(extract);
            if (extract[3] == "-1") black.push(extract);
            key = [extract[1], extract[2]].toString();
            if (!(key in currentState)) {
                currentState[key] = [extract[0], extract[3]];
            }
        }
        return {
            "red": red,
            "black": black,
            "CurrentBoardState": currentState
        };
    }


    NumberMove(numbermove) {
        console.log(numbermove);
    }

    /**********************recive any state && init it **********************/
    newState(red: any, black: any) {

        this.selectedPiece = undefined;
        this.lastState = [];

        var redAgent;
        var blackAgent;
        // note : defaul pastMoves = 0 in gent 
        blackAgent = new Agent(this.blackTeam, false, this.StateFlag, black);
        redAgent = new Agent(this.redTeam, false, this.StateFlag, red);
        this.state = new State(redAgent, blackAgent, false);

    }


    ChangeType() {
        this.reverse = false;
        this.StateFlag = !this.StateFlag;
        // this.onClear.emit();
        this.clear_results();
        var objectState = this.SolveState();
        this.boardState = objectState["CurrentBoardState"];
        this.newState(objectState["red"], objectState["black"]);
    }
    // Check move && change image 

}
