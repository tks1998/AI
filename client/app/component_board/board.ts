import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ComputeService } from '../service/service.compute';
import { Piece } from '../Objects/Piece';
import { DummyPiece } from '../Objects/DummyPiece';
import { Draggable } from '../directive/draggable';

import { Rule } from '../ChineseChess/Rule/Rule';
import { State } from '../Strategy/State/State';
import { GreedyAgent } from '../Strategy/Greedy/GreedyAgent';
import { EvalFnAgent } from '../Strategy/EvalFn/EvaluationFn';
import { TDLearner } from '../Strategy/TDLearner/TDLearner';
import { TDLearnerTrained } from '../Strategy/TDLearner/TDLearnerTrained';
import { MCTS } from '../Strategy/MCTS/MCTS';
import { MoveReorderPruner } from '../Strategy/MoveReorderPruner/MoveReorderPruner';
import { HumanAgent } from '../Strategy/Agent/HumanAgent';
import { Agent } from '../Strategy/Agent/Agent';

@Component({
    selector: 'board',
    templateUrl: '../client/app/component_board/board.html',
    styleUrls: ['../client/app/component_board/board.css'],
    providers: [ComputeService]
})

export class BoardComponent implements OnInit {

    /***************** CONTROL *******************/
    redTeam = 1;
    blackTeam = -1;
    boardState = {}; // {postion => piece}  || NOT including dummy pieces
    humanMode = true;
    state: State;
    server: ComputeService;

    weigths_1 = [0, 0, 0, 0, 0, 0, 0];
    weigths_2 = [0, 0, 0, 0, 0, 0, 0];
    INIT_WEIGHT = [0, 0, 0, 0, 0, 0, 0];

    // Strategy
    private DEFAULT_TYPE = 0;
    redAgentType = 0;
    blackAgentType = 0;
    // DEPTH
    DEFAULT_DEPTH = 2;
    redAgentDepth = 2;
    blackAgentDepth = 2;
    blackAgentSimulations = 2000;
    redAgentSimulations = 2000;

    /***************** UI *******************/
    // keep track of all pieces, just for UI purpose (including dummy pieces)
    pieceSize: number = 67;
    selectedPiece: Piece;
    dummyPieces: DummyPiece[] = [];
    subscription: any;
    lastState: State;
    // -1: not started | 0: started but stoped | 1: in insimulation
    simulation_state = -1;
    nSimulations_input = 100;
    nSimulations = 100;
    reverse = false;
    



    /***************** EVENT *******************/
    // new game result obtained
    @Output() onResultsUpdated = new EventEmitter<boolean>();
    // new runtime for move obtained
    @Output() onTimeUpdated = new EventEmitter<boolean>();
    // {"strategy-depth": [average_move_runtime, nMoves]}
    @Output() onWeightUpdated = new EventEmitter<boolean>();
    @Output() onClear = new EventEmitter<boolean>();
    // {"strategy-depth": [average_move_runtime, nMoves]}
    runtime_dict = {};


    /***************** ANALYSIS *******************/
    results = [];
    clear_results() {
        this.results = [];
        this.report_result();
        this.weigths_1 = this.INIT_WEIGHT;
        this.weigths_2 = this.INIT_WEIGHT;
    }


    changeMode() {
        this.reverse = !this.reverse;
        this.onClear.emit();
        this.clear_results();
        console.log("---------------------------change mod ----------------------")
        this.initGame();
        console.log("---------------------------change mod2 ----------------------")
       
    }
    
    isPossibleMove(pos) {
        if (!this.selectedPiece) return false;
        // get moves of piece  from legalMoves 
        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];

        // in that case , I use  syxtax lambda  foreach x in array -> x =  x+ ' ' &&  
        return moves.map(x => x + '').indexOf(pos + '') >= 0;
    }
    // Add dummy pieces to board
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

    chooseRedAgent(desc) {
        this.onClear.emit();
        this.simulation_state = -1;
        this.redAgentType = this.parse_agentType(desc);

    }
    chooseBlackAgent(desc) {
        this.onClear.emit();
        this.simulation_state = -1;
        this.blackAgentType = this.parse_agentType(desc);
        this.clear_results();
        this.initGame();
    }
    chooseRedAgentDepth(depth) {
        this.redAgentDepth = parseInt(depth);
    }
    chooseBlackAgentDepth(depth) {
        this.blackAgentDepth = parseInt(depth);
        if (this.humanMode) this.initGame();
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
        this.lastState = null;
        // init agents
        var redAgent;
        var blackAgent;
        // choose type of red team 
        blackAgent = new GreedyAgent(this.blackTeam,this.reverse);
        
        redAgent = new Agent(this.redTeam,this.reverse);
        
       /* if (redAgent.reverse) console.log("day la quan co up ");
            switch (this.blackAgentType) {
            /*    case 0: { blackAgent = new GreedyAgent(this.blackTeam,this.reverse); break; }
                case 1: { blackAgent = new EvalFnAgent(this.blackTeam, this.reverse,this.blackAgentDepth); break; }

                case 2: { blackAgent = new MoveReorderPruner(this.blackTeam,this.reverse, this.blackAgentDepth); break; }
                case 3: { blackAgent = new TDLearner(this.blackTeam,this.reverse,this.blackAgentDepth, this.weigths_2); break; }
                case 4: { blackAgent = new TDLearnerTrained(this.blackTeam, this.reverse, this.blackAgentDepth); break; }
                // TDLearner
                case 5: { blackAgent = new MCTS(this.blackTeam, this.blackAgentSimulations,this.reverse); break; }
                case 6: { blackAgent = new MoveReorderPruner(this.blackTeam, this.reverse,this.blackAgentDepth); break; }
              */  
             //   default: blackAgent = new GreedyAgent(this.blackTeam,this.reverse); break;
          //  }
        // make state with readAgent , black Agent , && type chess 
        this.state = new State(redAgent, blackAgent,this.reverse);    
    }
    Reverse(){
        this.initGame();
        this.state.switchTurn();
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
        // before human makes move, make a copy of current state
        this.copyCurrentState();
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();
    }

    // end_state: -1: lose | 0: draw | 1: win
    end_game(end_state) {
        var red_win = end_state * this.state.playingTeam;
        // update state for end state
        this.state.endFlag = red_win;
        this.results.push(red_win);
        this.report_result();
        this.weigths_1 = this.state.redAgent.update_weights(this.results.length, red_win);
        this.weigths_2 = this.state.blackAgent.update_weights(this.results.length, red_win);
        /*if (!this.humanMode) this.end_simulation();
        else */ 
        this.selectedPiece = undefined;
    }



    // report results
    report_result() {
        this.onResultsUpdated.emit();
        this.onWeightUpdated.emit();
    }
    report_runtime(strategy, depth, time) {
        var type = this.runtime_dict[strategy + "-" + depth];
        if (!type) this.runtime_dict[strategy + "-" + depth] = [time, 1];
        else {
            var new_num = type[1] + 1;
            this.runtime_dict[strategy + "-" + depth] = [Math.ceil((type[0] * type[1] + time) / new_num), new_num]
        }
        this.onTimeUpdated.emit();
    }


    // switch game turn
    switchTurn() {
        // stop simulation
        if (!this.humanMode && this.simulation_state <= 0) return;
        // update playing team
        this.state.switchTurn();
        var agent = (this.state.playingTeam == 1 ? this.state.redAgent : this.state.blackAgent);
        agent.updateState();
        // agent.nextMove();
        var endState = this.state.getEndState();
        if (endState != 0) {
            this.end_game(endState);
            return;
        }

        if (this.humanMode) {
            this.selectedPiece = undefined;
            // if human's turn, return
            if (this.state.playingTeam == 1) return;
        }

        // this.switchTurn();
        this.server.launchCompute(this.state.copy(false)).then(
            result => {
                var move = result['move'];
                var time = parseInt(result['time']);
                var state_feature = result['state_feature'];
                if (time) this.report_runtime(agent.strategy, (agent instanceof MCTS ? agent.N_SIMULATION : agent.DEPTH), time)
                if (state_feature) agent.save_state(state_feature);
                if (!move) { // FAIL
                    this.end_game(-1);
                    return;
                }
                if (move.length == 0) { // DRAW
                    this.end_game(0);
                    return;
                }

                var piece = agent.getPieceByName(move[0].name);
                agent.movePieceTo(piece, move[1]);
                this.switchTurn();
            }
        );
    }
    // reverse game state to previous state
    go2PreviousState() {
        if (!this.lastState) return;
        this.state = this.lastState;
        this.lastState = null;
    }

    copyCurrentState() {
        this.lastState = this.state.copy();
    }
}
