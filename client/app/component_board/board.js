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
var Agent_1 = require('../Strategy/Agent/Agent');
var BoardComponent = (function () {
    function BoardComponent(server) {
        /***************** CONTROL *******************/
        this.redTeam = 1;
        this.blackTeam = -1;
        this.boardState = {}; // {postion => piece}  || NOT including dummy pieces
        this.humanMode = true;
        // weigths_1 = [0, 0, 0, 0, 0, 0, 0];
        // weigths_2 = [0, 0, 0, 0, 0, 0, 0];
        // INIT_WEIGHT = [0, 0, 0, 0, 0, 0, 0];
        // Strategy
        this.DEFAULT_TYPE = 0;
        // redAgentType = 0;
        this.blackAgentType = 0;
        // DEPTH
        this.DEFAULT_DEPTH = 2;
        // redAgentDepth = 2;
        this.blackAgentDepth = 2;
        this.blackAgentSimulations = 2000;
        // redAgentSimulations = 2000;
        /***************** UI *******************/
        // keep track of all pieces, just for UI purpose (including dummy pieces)
        this.pieceSize = 67;
        this.dummyPieces = [];
        // -1: not started | 0: started but stoped | 1: in insimulation
        // simulation_state = -1;
        // nSimulations_input = 100;
        // nSimulations = 100;
        // If "reverse chinachess " -> reverse = 0 else reverse = 1 
        this.reverse = false;
        this.StateFlag = false;
        /***************** EVENT *******************/
        // new game result obtained
        // @Output() onResultsUpdated = new EventEmitter<boolean>();
        // // new runtime for move obtained
        // @Output() onTimeUpdated = new EventEmitter<boolean>();
        // // {"strategy-depth": [average_move_runtime, nMoves]}
        // @Output() onWeightUpdated = new EventEmitter<boolean>();
        // @Output() onClear = new EventEmitter<boolean>();
        // // {"strategy-depth": [average_move_runtime, nMoves]}
        this.runtime_dict = {};
        /***************** ANALYSIS *******************/
        this.results = [];
        this.server = server;
    }
    BoardComponent.prototype.clear_results = function () {
        this.results = [];
        // this.report_result();
        // this.weigths_1 = this.INIT_WEIGHT;
        // this.weigths_2 = this.INIT_WEIGHT;
    };
    // change type of game , this.reverse = true -> reverse chiana chess else china chess
    BoardComponent.prototype.changeMode = function () {
        this.reverse = !this.reverse;
        // this.onClear.emit();
        this.clear_results();
        this.initGame();
    };
    BoardComponent.prototype.checkTname = function (current_piece) {
        return current_piece.name == current_piece.truthname;
    };
    BoardComponent.prototype.isPossibleMove = function (pos) {
        if (!this.selectedPiece)
            return false;
        // get moves of piece  from legalMoves 
        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
        // in that case , I use  syxtax lambda  foreach x in array -> x =  x+ ' ' &&  
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
    // chooseRedAgent(desc) {
    //     this.onClear.emit();
    //     this.simulation_state = -1;
    //     this.redAgentType = this.parse_agentType(desc);
    // }
    BoardComponent.prototype.chooseBlackAgent = function (desc) {
        // this.onClear.emit();
        // this.simulation_state = -1;
        this.blackAgentType = this.parse_agentType(desc);
        this.clear_results();
        this.initGame();
    };
    // chooseRedAgentDepth(depth) {
    //     this.redAgentDepth = parseInt(depth);
    // }
    BoardComponent.prototype.chooseBlackAgentDepth = function (depth) {
        this.blackAgentDepth = parseInt(depth);
        this.initGame();
    };
    BoardComponent.prototype.ngOnInit = function () {
        this.initDummyButtons();
        this.initGame();
    };
    BoardComponent.prototype.initGame = function () {
        this.selectedPiece = undefined;
        this.lastState = null;
        // init agents
        var redAgent;
        var blackAgent;
        // choose type of red team 
        blackAgent = new Agent_1.Agent(this.blackTeam, this.reverse);
        redAgent = new Agent_1.Agent(this.redTeam, this.reverse);
        this.state = new State_1.State(redAgent, blackAgent, this.reverse);
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
        // this.report_result();
        // this.weigths_1 = this.state.redAgent.update_weights(this.results.length, red_win);
        // this.weigths_2 = this.state.blackAgent.update_weights(this.results.length, red_win);
        /*if (!this.humanMode) this.end_simulation();
        else */
        this.selectedPiece = undefined;
    };
    // report results
    // report_result() {
    //     this.onResultsUpdated.emit();
    //     this.onWeightUpdated.emit();
    // }
    BoardComponent.prototype.report_runtime = function (strategy, depth, time) {
        var type = this.runtime_dict[strategy + "-" + depth];
        if (!type)
            this.runtime_dict[strategy + "-" + depth] = [time, 1];
        else {
            var new_num = type[1] + 1;
            this.runtime_dict[strategy + "-" + depth] = [Math.ceil((type[0] * type[1] + time) / new_num), new_num];
        }
        // this.onTimeUpdated.emit();
    };
    // switch game turn
    BoardComponent.prototype.switchTurn = function () {
        var _this = this;
        // stop simulation
        //  if (!this.humanMode && this.simulation_state <= 0) return;
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
            //if (state_feature) agent.save_state(state_feature);
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
    BoardComponent.prototype.checkReverse = function () {
        return this.reverse;
    };
    BoardComponent.prototype.checkMove = function (currentpiece) {
        if (currentpiece.name[0] == 'k')
            return true;
        if (currentpiece.isMove > 0)
            return true;
        else
            return false;
    };
    BoardComponent.prototype.runState = function () {
        console.log("success");
    };
    BoardComponent.prototype.SaveState = function (input) {
        var xy = [input];
        //  console.log(typeof([xy]));
        this.InputState = xy;
    };
    BoardComponent.prototype.SolveState = function () {
        var newstate = []; //this.InputState;
        var extract;
        var red = [], black = [], currentState = {};
        var key = null;
        for (var _i = 0, newstate_1 = newstate; _i < newstate_1.length; _i++) {
            var x = newstate_1[_i];
            extract = x.split(' ');
            if (extract[3] == "1")
                red.push(extract);
            if (extract[3] == "-1")
                black.push(extract);
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
    };
    BoardComponent.prototype.NumberMove = function (numbermove) {
        console.log(numbermove);
    };
    BoardComponent.prototype.newState = function (red, black) {
        this.selectedPiece = undefined;
        this.lastState = null;
        var redAgent;
        var blackAgent;
        blackAgent = new Agent_1.Agent(this.blackTeam, false, this.StateFlag, black);
        redAgent = new Agent_1.Agent(this.redTeam, false, this.StateFlag, red);
        this.state = new State_1.State(redAgent, blackAgent, false);
    };
    BoardComponent.prototype.ChangeType = function () {
        this.reverse = false;
        this.StateFlag = !this.StateFlag;
        // this.onClear.emit();
        this.clear_results();
        var objectState = this.SolveState();
        this.boardState = objectState["CurrentBoardState"];
        console.log(this.boardState);
        this.newState(objectState["red"], objectState["black"]);
    };
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