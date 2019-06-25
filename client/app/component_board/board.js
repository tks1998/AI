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
var Piece_1 = require('../Objects/Piece');
var DummyPiece_1 = require('../Objects/DummyPiece');
var State_1 = require('../Strategy/State/State');
var Agent_1 = require('../Strategy/Agent/Agent');
var BoardComponent = (function () {
    function BoardComponent(server) {
        this.redTeam = 1;
        this.blackTeam = -1;
        this.boardState = {}; // {postion => piece}  || NOT including dummy pieces
        this.checkmate = false;
        this.DEFAULT_TYPE = 0;
        this.blackAgentType = 0;
        this.DEFAULT_DEPTH = 2;
        this.blackAgentDepth = 2;
        this.pieceSize = 67;
        this.dummyPieces = [];
        this.lastState = Array();
        this.redo = Array();
        this.repeat = Array();
        this.reverse = false;
        this.StateFlag = false;
        this.timemode = false;
        this.settime = 10;
        this.InputCurrentState = {};
        //
        /***************** EVENT *******************/
        // new game result obtained
        // creat event
        this.onResultsUpdated = new core_1.EventEmitter();
        this.runtime_dict = {};
        this.results = [];
        this.server = server;
    }
    BoardComponent.prototype.clear_results = function () {
        this.results = [];
        this.report_result();
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
        // console.log("TOI la isposioble",this.selectedPiece.name);
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
        this.repeat = [];
        var redAgent;
        var blackAgent;
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
        blackAgent = new Agent_1.Agent(this.blackTeam, this.reverse, this.blackAgentType, this.blackAgentDepth);
        redAgent = new Agent_1.Agent(this.redTeam, this.reverse, this.blackAgentType, this.blackAgentDepth);
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
    BoardComponent.prototype.chooseBlackSimulations = function (dept) {
        this.blackAgentDepth = dept;
    };
    // static samveMove(move1, move2) {
    //     return move1.name == move2.name && (move1.position.toString() == move2.position.toString());
    // }
    BoardComponent.prototype.humanMove = function (piece) {
        this.copyCurrentState();
        this.redo = [];
        this.repeat = [];
        this.state.redAgent.movePieceTo(this.selectedPiece, piece.position, true);
        this.repeat.push(this.selectedPiece);
        var n = this.repeat.length;
        console.log(this.repeat);
        console.log(this.selectedPiece);
        if (this.repeat[n - 1].name == this.repeat[n - 3].name && (this.repeat[n - 1].position.toString() == this.repeat[n - 3].position.toString())) {
            this.state.redAgent.updateban(this.repeat[n - 1]);
        }
        this.switchTurn();
    };
    // end_state: -1: lose | 0: draw | 1: win
    BoardComponent.prototype.end_game = function (end_state) {
        var red_win = end_state * this.state.playingTeam;
        this.state.endFlag = red_win;
        // get result of the game
        this.results.push(red_win);
        this.report_result();
        this.selectedPiece = undefined;
        this.pauseTimer(1);
        this.pauseTimer(-1);
    };
    BoardComponent.prototype.setCheckMate = function (value) {
        this.checkmate = value;
    };
    // switch game turn
    BoardComponent.prototype.switchTurn = function () {
        var _this = this;
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
        if (this.state.playingTeam == 1)
            return;
        // this.switchTurn();
        // get move of sever and reder in page
        this.server.checkMate(this.state.copy(false)).then(function (result) {
            var checkmateS = result['checkmate'];
            _this.setCheckMate(checkmateS);
        });
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
            _this.server.checkMate(_this.state.copy(false)).then(function (result) {
                var checkmateS = result['checkmate'];
                _this.setCheckMate(checkmateS);
            });
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
        if (id >= 0) {
            this.state = this.redo[id];
            if (size >= 0)
                this.lastState = this.lastState.slice(0, size);
            else
                this.lastState = [];
            //if (id >= 0) this.lastState.push(this.redo[id]);
            this.redo = this.redo.splice(0, id - 1);
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
        return (currentpiece.isMove > 0);
    };
    BoardComponent.prototype.runState = function () {
        console.log("success");
    };
    BoardComponent.prototype.SaveState = function (input) {
        var xy = [input];
        this.InputState = xy;
    };
    BoardComponent.prototype.NumberMove = function (numbermove) {
        console.log(numbermove);
    };
    /**********************recive any state && init it **********************/
    /** default stategy = 2 && dept = 4 */
    BoardComponent.prototype.newState = function (red, black) {
        this.selectedPiece = undefined;
        this.lastState = [];
        var redAgent;
        var blackAgent;
        this.initDummyButtons();
        blackAgent = new Agent_1.Agent(this.blackTeam, false, 1, 4, this.StateFlag, black);
        redAgent = new Agent_1.Agent(this.redTeam, false, 1, 4, this.StateFlag, red);
        // default turn = 1, 
        //  var turn = -1 ;
        this.state = new State_1.State(redAgent, blackAgent, false, 1);
        // if (turn == -1) this.switchTurn();
    };
    /** --------------------------------------------------------------------*/
    // Check move && change image 
    //part of Timer
    BoardComponent.prototype.TimeMode = function () {
        this.timemode = !this.timemode;
        this.initGame();
    };
    BoardComponent.prototype.hiddentimer = function () {
        return this.timemode;
    };
    BoardComponent.prototype.inputTime = function (f) {
        this.settime = f.value["timeinput"];
        if (!this.settime)
            this.settime = 10;
        this.initGame();
    };
    BoardComponent.prototype.startTimer = function (team) {
        var _this = this;
        function pad(n) {
            return (n < 10 ? "0" + n : n);
        }
        if (this.timemode) {
            if (team == 1) {
                this.redinterval = setInterval(function () {
                    if (_this.redminute >= 0) {
                        if (_this.redmilisec >= 0) {
                            _this.redmilisec--;
                        }
                        if (_this.redmilisec == -1) {
                            _this.redsecond--;
                            _this.redmilisec = 99;
                        }
                        if (_this.redsecond == -1) {
                            _this.redminute--;
                            _this.redsecond = 59;
                        }
                    }
                    else {
                        _this.redminute = 0;
                        _this.redsecond = 0;
                        _this.redmilisec = 0;
                        _this.end_game(-team);
                    }
                    document.getElementById("redclock").innerHTML = pad(_this.redminute) + ":" + pad(_this.redsecond) + ":" + pad(_this.redmilisec);
                }, 10);
            }
            else {
                this.blackinterval = setInterval(function () {
                    if (_this.blackminute >= 0) {
                        if (_this.blackmilisec >= 0) {
                            _this.blackmilisec--;
                        }
                        if (_this.blackmilisec == -1) {
                            _this.blacksecond--;
                            _this.blackmilisec = 99;
                        }
                        if (_this.blacksecond == -1) {
                            _this.blackminute--;
                            _this.blacksecond = 59;
                        }
                    }
                    else {
                        _this.blackminute = 0;
                        _this.blacksecond = 0;
                        _this.blackmilisec = 0;
                        _this.end_game(team);
                    }
                    document.getElementById("blackclock").innerHTML = pad(_this.blackminute) + ":" + pad(_this.blacksecond) + ":" + pad(_this.blackmilisec);
                }, 10);
            }
        }
    };
    BoardComponent.prototype.pauseTimer = function (team) {
        if (team == 1) {
            clearInterval(this.redinterval);
        }
        else {
            clearInterval(this.blackinterval);
        }
    };
    /** submit form && extract data && make current state */
    BoardComponent.prototype.SolveState = function (f) {
        var newstate = f.value['anystate'];
        newstate = newstate.split(',');
        var extract;
        var red = [], black = [], currentState = {};
        var key = null;
        for (var _i = 0, newstate_1 = newstate; _i < newstate_1.length; _i++) {
            var x = newstate_1[_i];
            extract = x.split(' ');
            key = [extract[1], extract[2]].toString();
            console.log("day la extract ", extract);
            if (extract[3] == "1") {
                red.push(new Piece_1.Piece(extract[0], [Number(extract[1]), Number(extract[2])], false, extract[0], 0));
            }
            if (extract[3] == "-1") {
                black.push(new Piece_1.Piece(extract[0], [Number(extract[1]), Number(extract[2])], false, extract[0], 0));
            }
            if (!(key in currentState)) {
                currentState[key] = [extract[0], extract[3]];
            }
        }
        this.InputRed = red;
        this.InputBlack = black;
        this.InputCurrentState = currentState;
        this.ChangeType();
    };
    BoardComponent.prototype.ChangeType = function () {
        this.reverse = false;
        this.StateFlag = !this.StateFlag;
        if (!this.StateFlag)
            return;
        this.boardState = this.InputCurrentState;
        this.newState(this.InputRed, this.InputBlack);
    };
    BoardComponent.prototype.SupportSwitchTurn = function () {
        this.switchTurn();
    };
    //
    // report results
    BoardComponent.prototype.report_result = function () {
        this.onResultsUpdated.emit();
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoardComponent.prototype, "onResultsUpdated", void 0);
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