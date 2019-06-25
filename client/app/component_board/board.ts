import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ComputeService } from '../service/service.compute';
import { Piece } from '../Objects/Piece';
import { DummyPiece } from '../Objects/DummyPiece';
import { State } from '../Strategy/State/State';
import { Agent } from '../Strategy/Agent/Agent';
import { start } from 'repl';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'board',
    templateUrl: '../client/app/component_board/board.html',
    styleUrls: ['../client/app/component_board/board.css'],
    providers: [ComputeService]
})


export class BoardComponent implements OnInit {
    redTeam = 1;
    blackTeam = -1;
    boardState = {}; // {postion => piece}  || NOT including dummy pieces
    state: State;
    server: ComputeService;
    checkmate = false;

    private DEFAULT_TYPE = 0;
    blackAgentType = 0;
    DEFAULT_DEPTH = 2;
    blackAgentDepth = 2;

    pieceSize: number = 67;
    selectedPiece: Piece;
    dummyPieces: DummyPiece[] = [];
    lastState: State[] = Array();
    redo: State[] = Array();
    reverse = false;
    StateFlag = false;
    InputState: Object;

    timemode = false;
    settime: number = 10;
    redminute: number;
    blackminute: number;
    redsecond: number;
    blacksecond: number;
    redmilisec: number;
    blackmilisec: number;
    redinterval;
    blackinterval;

    InputRed: Piece[];
    InputBlack: Piece[];
    InputCurrentState = {};


    //
    /***************** EVENT *******************/
    // new game result obtained
    // creat event
    @Output() onResultsUpdated = new EventEmitter<boolean>();
    runtime_dict = {};


    results = [];
    clear_results() {
        this.results = [];
        this.report_result();
    }


    changeMode() {
        this.reverse = !this.reverse;
        this.clear_results();
        this.initGame();
    }


    isPossibleMove(pos) {
        if (!this.selectedPiece) return false;

        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
        // console.log("TOI la isposioble",this.selectedPiece.name);
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
        var redAgent: Agent;
        var blackAgent: Agent;
        this.redminute = this.settime;
        this.blackminute = this.settime;
        this.redsecond = 0;
        this.blacksecond = 0;
        this.redmilisec = 0;
        this.blackmilisec = 0;
        this.redinterval;
        this.blackinterval;
        this.checkmate = false;
        this.pauseTimer(-1);
        this.pauseTimer(1);
        this.initDummyButtons();
        blackAgent = new Agent(this.blackTeam, this.reverse, this.blackAgentType, this.blackAgentDepth);

        redAgent = new Agent(this.redTeam, this.reverse, this.blackAgentType, this.blackAgentDepth);

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


    chooseBlackSimulations(dept) {
        this.blackAgentDepth = dept;
    }


    humanMove(piece: Piece) {
        this.copyCurrentState();
        this.redo = [];
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();

    }


    // end_state: -1: lose | 0: draw | 1: win
    end_game(end_state) {
        var red_win = end_state * this.state.playingTeam;
        this.state.endFlag = red_win;

        // get result of the game
        this.results.push(red_win);
        this.report_result();

        this.selectedPiece = undefined;

        this.pauseTimer(1);
        this.pauseTimer(-1);
    }


    setCheckMate(value) {
        this.checkmate = value;
    }


    // switch game turn
    switchTurn() {
        this.state.switchTurn();
        var agent = (this.state.playingTeam == 1 ? this.state.redAgent : this.state.blackAgent);
        agent.updateState();
        this.pauseTimer(-this.state.playingTeam);
        this.startTimer(this.state.playingTeam);

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
        this.server.checkMate(this.state.copy(false)).then(
            result => {
                var checkmateS = result['checkmate'];
                this.setCheckMate(checkmateS);
            }
        );
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

                this.server.checkMate(this.state.copy(false)).then(
                    result => {
                        var checkmateS = result['checkmate'];
                        this.setCheckMate(checkmateS);
                    }
                );
                this.switchTurn();
            }
        );
    }


    // reverse game state to previous state
    go2PreviousState() {
        var id = this.lastState.length - 1;
        if (this.lastState.length <= 0) return;
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
        var size = this.lastState.length - 1;

        if (id >= 0) {
            this.state = this.redo[id];
            if (size >= 0) this.lastState = this.lastState.slice(0, size)
            else this.lastState = [];
            //if (id >= 0) this.lastState.push(this.redo[id]);
            this.redo = this.redo.splice(0, id - 1);
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
        return (currentpiece.isMove > 0);
    }


    runState() {
        console.log("success");
    }


    SaveState(input) {
        var xy = [input];
        this.InputState = xy;
    }

    NumberMove(numbermove) {
        console.log(numbermove);
    }


    /**********************recive any state && init it **********************/
    /** default stategy = 2 && dept = 4 */

    newState(red: Piece[], black: Piece[]) {
        this.selectedPiece = undefined;
        this.lastState = [];

        var redAgent: Agent;
        var blackAgent: Agent;
        this.initDummyButtons();
        blackAgent = new Agent(this.blackTeam, false, 1, 4, this.StateFlag, black);
        redAgent = new Agent(this.redTeam, false, 1, 4, this.StateFlag, red);
        // default turn = 1, 
        //  var turn = -1 ;
        this.state = new State(redAgent, blackAgent, false, 1);
        // if (turn == -1) this.switchTurn();
    }
    /** --------------------------------------------------------------------*/

    // Check move && change image 

    //part of Timer
    TimeMode() {
        this.timemode = !this.timemode;
        this.initGame();
    }


    hiddentimer(): boolean {
        return this.timemode;
    }

    inputTime(f: NgForm){
        this.settime = f.value["timeinput"];
        if (!this.settime)
            this.settime = 10;
        this.initGame();
    }

    startTimer(team) {
        function pad(n) {
            return (n < 10 ? "0" + n : n);
        }

        if (this.timemode) {
            if (team == 1) {
                this.redinterval = setInterval(() => {
                    if (this.redminute >= 0) {
                        if (this.redmilisec >= 0) {
                            this.redmilisec--;
                        }
                        if (this.redmilisec == -1) {
                            this.redsecond--;
                            this.redmilisec = 99;
                        }
                        if (this.redsecond == -1) {
                            this.redminute--;
                            this.redsecond = 59;
                        }
                    }
                    else {
                        this.redminute = 0;
                        this.redsecond = 0;
                        this.redmilisec = 0;
                        this.end_game(-team);
                    }
                    //document.getElementById("redclock").innerHTML = pad(this.redminute) + ":" + pad(this.redsecond) + ":" + pad(this.redmilisec);
                }, 10)
            } else {
                this.blackinterval = setInterval(() => {
                    if (this.blackminute >= 0) {
                        if (this.blackmilisec >= 0) {
                            this.blackmilisec--;
                        }
                        if (this.blackmilisec == -1) {
                            this.blacksecond--;
                            this.blackmilisec = 99;
                        }
                        if (this.blacksecond == -1) {
                            this.blackminute--;
                            this.blacksecond = 59;
                        }
                    }
                    else {
                        this.blackminute = 0;
                        this.blacksecond = 0;
                        this.blackmilisec = 0;
                        this.end_game(team);
                    }
                    //document.getElementById("blackclock").innerHTML = pad(this.blackminute) + ":" + pad(this.blacksecond) + ":" + pad(this.blackmilisec);
                }, 10)
            }
        }
    }


    pauseTimer(team) {
        if (team == 1) {
            clearInterval(this.redinterval);
        }
        else {
            clearInterval(this.blackinterval);
        }
    }


    /** submit form && extract data && make current state */
    SolveState(f: NgForm) {
        var newstate = f.value['anystate'];
        newstate = newstate.split(',');
        var extract;
        var red = [], black = [], currentState = {};
        var key = null;
        this.pauseTimer(-1);
        this.pauseTimer(1);
        this.redminute = this.settime;
        this.blackminute = this.settime;
        this.redsecond = 0;
        this.blacksecond = 0;
        this.redmilisec = 0;
        this.blackmilisec = 0;
        this.redinterval;
        this.blackinterval;

        for (var x of newstate) {
            extract = x.split(' ');
            key = [extract[1], extract[2]].toString();
            console.log("day la extract ", extract);
            if (extract[3] == "1") {
                red.push(new Piece(extract[0], [Number(extract[1]), Number(extract[2])], false, extract[0], 0));
            }
            if (extract[3] == "-1") {
                black.push(new Piece(extract[0], [Number(extract[1]), Number(extract[2])], false, extract[0], 0));
            }

            if (!(key in currentState)) {
                currentState[key] = [extract[0], extract[3]];
            }
        }
        this.InputRed = red;
        this.InputBlack = black;
        this.InputCurrentState = currentState;


        this.ChangeType();
    }


    ChangeType() {
        this.reverse = false;
        this.StateFlag = !this.StateFlag;
        if (!this.StateFlag) return;
        this.boardState = this.InputCurrentState;
        this.newState(this.InputRed, this.InputBlack);
    }


    SupportSwitchTurn() {
        this.switchTurn();
    }

    //
    // report results
    report_result() {
        this.onResultsUpdated.emit();
    }
}
