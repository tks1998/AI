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
        this.redTeam = 1;
        this.blackTeam = -1;
        this.boardState = {};
        this.DEFAULT_TYPE = 0;
        this.blackAgentType = 0;
        this.DEFAULT_DEPTH = 2;
        this.blackAgentDepth = 2;
        this.blackAgentSimulations = 2000;
        this.pieceSize = 67;
        this.dummyPieces = [];
        this.lastState = Array();
        this.redo = Array();
        this.reverse = false;
        this.StateFlag = false;
        this.runtime_dict = {};
        this.results = [];
        this.server = server;
    }
    BoardComponent.prototype.clear_results = function () {
        this.results = [];
    };
    BoardComponent.prototype.changeMode = function () {
        this.reverse = !this.reverse;
        this.clear_results();
        this.initGame();
    };
    BoardComponent.prototype.isPossibleMove = function (pos) {
        if (!this.selectedPiece)
            return false;
        var moves = this.state.redAgent.legalMoves[this.selectedPiece.name];
        return moves.map(function (x) { return x + ''; }).indexOf(pos + '') >= 0;
    };
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
    BoardComponent.prototype.chooseBlackAgent = function (desc) {
        this.blackAgentType = this.parse_agentType(desc);
        this.clear_results();
        this.initGame();
    };
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
        this.lastState = [];
        this.redo = [];
        var redAgent;
        var blackAgent;
        this.initDummyButtons();
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
        this.copyCurrentState();
        this.redo = [];
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.switchTurn();
    };
    // end_state: -1: lose | 0: draw | 1: win
    BoardComponent.prototype.end_game = function (end_state) {
        var red_win = end_state * this.state.playingTeam;
        this.state.endFlag = red_win;
        this.results.push(red_win);
        this.selectedPiece = undefined;
    };
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
    BoardComponent.prototype.switchTurn = function () {
        var _this = this;
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
        if (this.state.playingTeam == 1)
            return;
        // this.switchTurn();
        // get move of sever and reder in page
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
            if (move[1])
                agent.movePieceTo(piece, move[1]);
            _this.switchTurn();
        });
    };
    // reverse game state to previous state
    BoardComponent.prototype.go2PreviousState = function () {
        var id = this.lastState.length - 1;
        if (this.lastState.length <= 0)
            return;
        this.redo.push(this.state);
        this.state = this.lastState[id];
        if (id == 0)
            this.lastState = [];
        else
            this.lastState = this.lastState.slice(0, id);
    };
    BoardComponent.prototype.CheckLastRedo = function () {
        return this.redo.length > 0;
    };
    BoardComponent.prototype.Redo = function () {
        var id = this.redo.length - 1;
        var size = this.lastState.length - 1;
        console.log(id);
        if (id >= 0) {
            this.state = this.redo[id];
            if (size >= 0)
                this.lastState = this.lastState.slice(0, size);
            else
                this.lastState = [];
            //if (id >= 0) this.lastState.push(this.redo[id]);
            this.redo = this.redo.splice(0, id);
        }
    };
    BoardComponent.prototype.CheckLastState = function () {
        //console.log(this.lastState.length)
        return this.lastState.length > 0;
    };
    BoardComponent.prototype.copyCurrentState = function () {
        this.lastState.push(this.state.copy());
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
    /**********************recive any state && init it **********************/
    BoardComponent.prototype.newState = function (red, black) {
        this.selectedPiece = undefined;
        this.lastState = [];
        var redAgent;
        var blackAgent;
        // note : defaul pastMoves = 0 in gent 
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