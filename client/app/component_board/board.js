"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var service_compute_1 = require('../service/service.compute');
var DummyPiece_1 = require('../Objects/DummyPiece');
var State_1 = require('../Strategy/State/State');
var GreedyAgent_1 = require('../Strategy/Greedy/GreedyAgent');
var EvaluationFn_1 = require('../Strategy/EvalFn/EvaluationFn');
var TDLearner_1 = require('../Strategy/TDLearner/TDLearner');
var TDLearnerTrained_1 = require('../Strategy/TDLearner/TDLearnerTrained');
var MCTS_1 = require('../Strategy/MCTS/MCTS');
var MoveReorderPruner_1 = require('../Strategy/MoveReorderPruner/MoveReorderPruner');
var HumanAgent_1 = require('../Strategy/Agent/HumanAgent');
var BoardComponent = (function () {
    function BoardComponent(server) {
        /***************** CONTROL *******************/
        this.redTeam = 1;
        this.blackTeam = -1;
        this.boardState = {}; // {postion => piece}  || NOT including dummy pieces
        this.humanMode = true;
        this.weigths_1 = [0, 0, 0, 0, 0, 0, 0];
        this.weigths_2 = [0, 0, 0, 0, 0, 0, 0];
        this.INIT_WEIGHT = [0, 0, 0, 0, 0, 0, 0];
        // Strategy
        this.DEFAULT_TYPE = 0;
        this.redAgentType = 0;
        this.blackAgentType = 0;
        // DEPTH
        this.DEFAULT_DEPTH = 2;
        this.redAgentDepth = 2;
        this.blackAgentDepth = 2;
        this.blackAgentSimulations = 2000;
        this.redAgentSimulations = 2000;
        /***************** UI *******************/
        // keep track of all pieces, just for UI purpose (including dummy pieces)
        this.pieceSize = 67;
        this.dummyPieces = [];
        // -1: not started | 0: started but stoped | 1: in insimulation
        this.simulation_state = -1;
        this.nSimulations_input = 100;
        this.nSimulations = 100;
        /***************** EVENT *******************/
        // new game result obtained
        this.onResultsUpdated = new core_1.EventEmitter();
        // new runtime for move obtained
        this.onTimeUpdated = new core_1.EventEmitter();
        // {"strategy-depth": [average_move_runtime, nMoves]}
        this.onWeightUpdated = new core_1.EventEmitter();
        this.onClear = new core_1.EventEmitter();
        // {"strategy-depth": [average_move_runtime, nMoves]}
        this.runtime_dict = {};
        /***************** ANALYSIS *******************/
        this.results = [];
        this.server = server;
    }
    BoardComponent.prototype.clear_results = function () {
        this.results = [];
        this.report_result();
        this.weigths_1 = this.INIT_WEIGHT;
        this.weigths_2 = this.INIT_WEIGHT;
    };
    BoardComponent.prototype.changeMode = function () {
        this.humanMode = !this.humanMode;
        this.simulation_state = -1;
        this.onClear.emit();
        this.clear_results();
        this.initGame();
    };
    BoardComponent.prototype.isPossibleMove = function (pos) {
        if (!this.selectedPiece)
            return false;
        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
        return moves.map(function (x) { return x + ''; }).indexOf(pos + '') >= 0;
    };
    // Add dummy pieces to board
    BoardComponent.prototype.initDummyButtons = function () {
        this.dummyPieces = [];
        for (var i = 1; i <= 10; i++) {
            for (var j = 1; j <= 9; j++) {
                this.dummyPieces.push(new DummyPiece_1.DummyPiece([i, j]));
            }
        }
    };
    BoardComponent.prototype.parse_agentType = function (desc) {
        if (desc == "") {
            return 0;
        }
        return parseInt(desc.split('-')[0]);
    };
    BoardComponent.prototype.chooseRedAgent = function (desc) {
        this.onClear.emit();
        this.simulation_state = -1;
        this.redAgentType = this.parse_agentType(desc);
    };
    BoardComponent.prototype.chooseBlackAgent = function (desc) {
        this.onClear.emit();
        this.simulation_state = -1;
        this.blackAgentType = this.parse_agentType(desc);
        this.clear_results();
        if (this.humanMode)
            this.initGame();
    };
    BoardComponent.prototype.chooseRedAgentDepth = function (depth) {
        this.redAgentDepth = parseInt(depth);
    };
    BoardComponent.prototype.chooseBlackAgentDepth = function (depth) {
        this.blackAgentDepth = parseInt(depth);
        if (this.humanMode)
            this.initGame();
    };
    BoardComponent.prototype.chooseBlackSimulations = function (n) {
        this.blackAgentSimulations = parseInt(n);
        // console.log(this.blackAgentSimulations)
        if (this.humanMode)
            this.initGame();
    };
    BoardComponent.prototype.chooseRedSimulations = function (n) {
        this.redAgentSimulations = parseInt(n);
    };
    /***************** LIFE_CYCLE *******************/
    BoardComponent.prototype.ngOnInit = function () {
        this.initDummyButtons();
        this.initGame();
    };
    // choose number of simulations
    BoardComponent.prototype.chooseNSimulations = function (n) {
        this.nSimulations_input = parseInt(n);
    };
    BoardComponent.prototype.initGame = function () {
        this.selectedPiece = undefined;
        this.lastState = null;
        // init agents
        var redAgent;
        switch (this.redAgentType) {
            case 0: {
                redAgent = new GreedyAgent_1.GreedyAgent(this.redTeam);
                break;
            }
            case 1: {
                redAgent = new EvaluationFn_1.EvalFnAgent(this.redTeam, this.redAgentDepth);
                break;
            }
            case 2: {
                redAgent = new MoveReorderPruner_1.MoveReorderPruner(this.redTeam, this.redAgentDepth);
                break;
            }
            case 3: {
                redAgent = new TDLearner_1.TDLearner(this.redTeam, this.redAgentDepth, this.weigths_1);
                break;
            }
            // TDLearner
            case 4: {
                redAgent = new TDLearnerTrained_1.TDLearnerTrained(this.redTeam, this.redAgentDepth);
                break;
            }
            case 5: {
                redAgent = new MCTS_1.MCTS(this.redTeam, this.redAgentSimulations);
                break;
            }
            case 6: {
                redAgent = new MoveReorderPruner_1.MoveReorderPruner(this.redTeam, this.redAgentDepth);
                break;
            }
            default:
                redAgent = new HumanAgent_1.HumanAgent(this.redTeam);
                break;
        }
        var blackAgent;
        switch (this.blackAgentType) {
            case 0: {
                blackAgent = new GreedyAgent_1.GreedyAgent(this.blackTeam);
                break;
            }
            case 1: {
                blackAgent = new EvaluationFn_1.EvalFnAgent(this.blackTeam, this.blackAgentDepth);
                break;
            }
            case 2: {
                blackAgent = new MoveReorderPruner_1.MoveReorderPruner(this.blackTeam, this.blackAgentDepth);
                break;
            }
            case 3: {
                blackAgent = new TDLearner_1.TDLearner(this.blackTeam, this.blackAgentDepth, this.weigths_2);
                break;
            }
            case 4: {
                blackAgent = new TDLearnerTrained_1.TDLearnerTrained(this.blackTeam, this.blackAgentDepth);
                break;
            }
            // TDLearner
            case 5: {
                blackAgent = new MCTS_1.MCTS(this.blackTeam, this.blackAgentSimulations);
                break;
            }
            case 6: {
                blackAgent = new MoveReorderPruner_1.MoveReorderPruner(this.blackTeam, this.blackAgentDepth);
                break;
            }
            default:
                blackAgent = new GreedyAgent_1.GreedyAgent(this.blackTeam);
                break;
        }
        this.state = new State_1.State(redAgent, blackAgent);
    };
    // response for clicking simulate
    BoardComponent.prototype.click_simulate = function () {
        this.nSimulations = this.nSimulations_input;
        this.clear_results();
        this.simulate();
    };
    BoardComponent.prototype.simulate = function () {
        this.initGame();
        this.state.switchTurn();
        this.continue_simulate();
    };
    BoardComponent.prototype.continue_simulate = function () {
        this.simulation_state = 1;
        this.switchTurn();
    };
    BoardComponent.prototype.stop_simulate = function () {
        this.simulation_state = 0;
    };
    BoardComponent.prototype.clickDummyPiece = function (piece) {
        if (!this.isPossibleMove(piece.position) || this.state.endFlag != null)
            return;
        this.humanMove(piece);
    };
    BoardComponent.prototype.clickRedPiece = function (piece) {
        if (this.state.endFlag != null)
            return;
        this.selectedPiece = piece;
    };
    BoardComponent.prototype.clickBlackPiece = function (piece) {
        if (!this.isPossibleMove(piece.position) || this.state.endFlag != null)
            return;
        this.humanMove(piece);
    };
    BoardComponent.prototype.humanMove = function (piece) {
        // before human makes move, make a copy of current state
        this.copyCurrentState();
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();
    };
    // end_state: -1: lose | 0: draw | 1: win
    BoardComponent.prototype.end_game = function (end_state) {
        var red_win = end_state * this.state.playingTeam;
        // update state for end state
        this.state.endFlag = red_win;
        this.results.push(red_win);
        this.report_result();
        this.weigths_1 = this.state.redAgent.update_weights(this.results.length, red_win);
        this.weigths_2 = this.state.blackAgent.update_weights(this.results.length, red_win);
        if (!this.humanMode)
            this.end_simulation();
        else
            this.selectedPiece = undefined;
    };
    BoardComponent.prototype.end_simulation = function () {
        // console.log(this.results);
        this.nSimulations -= 1;
        if (this.nSimulations == 0)
            this.simulation_state = -1;
        if (this.nSimulations > 0)
            this.simulate();
    };
    // report results
    BoardComponent.prototype.report_result = function () {
        this.onResultsUpdated.emit();
        this.onWeightUpdated.emit();
    };
    BoardComponent.prototype.report_runtime = function (strategy, depth, time) {
        var type = this.runtime_dict[strategy + "-" + depth];
        if (!type)
            this.runtime_dict[strategy + "-" + depth] = [time, 1];
        else {
            var new_num = type[1] + 1;
            this.runtime_dict[strategy + "-" + depth] = [Math.ceil((type[0] * type[1] + time) / new_num), new_num];
        }
        this.onTimeUpdated.emit();
    };
    // switch game turn
    BoardComponent.prototype.switchTurn = function () {
        var _this = this;
        // stop simulation
        if (!this.humanMode && this.simulation_state <= 0)
            return;
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
            if (this.state.playingTeam == 1)
                return;
        }
        // this.switchTurn();
        this.server.launchCompute(this.state.copy(false)).then(function (result) {
            var move = result['move'];
            var time = parseInt(result['time']);
            var state_feature = result['state_feature'];
            if (time)
                _this.report_runtime(agent.strategy, (agent instanceof MCTS_1.MCTS ? agent.N_SIMULATION : agent.DEPTH), time);
            if (state_feature)
                agent.save_state(state_feature);
            if (!move) {
                _this.end_game(-1);
                return;
            }
            if (move.length == 0) {
                _this.end_game(0);
                return;
            }
            var piece = agent.getPieceByName(move[0].name);
            agent.movePieceTo(piece, move[1]);
            _this.switchTurn();
        });
    };
    // reverse game state to previous state
    BoardComponent.prototype.go2PreviousState = function () {
        if (!this.lastState)
            return;
        this.state = this.lastState;
        this.lastState = null;
    };
    BoardComponent.prototype.copyCurrentState = function () {
        this.lastState = this.state.copy();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoardComponent.prototype, "onResultsUpdated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoardComponent.prototype, "onTimeUpdated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoardComponent.prototype, "onWeightUpdated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoardComponent.prototype, "onClear", void 0);
    BoardComponent = __decorate([
        core_1.Component({
            selector: 'board',
            templateUrl: '../client/app/component_board/board.html',
            styleUrls: ['../client/app/component_board/board.css'],
            providers: [service_compute_1.ComputeService]
        }), 
        __metadata('design:paramtypes', [service_compute_1.ComputeService])
    ], BoardComponent);
    return BoardComponent;
}());
exports.BoardComponent = BoardComponent;
//# sourceMappingURL=board.js.map