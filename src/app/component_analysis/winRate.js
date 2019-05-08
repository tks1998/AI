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
var forms_1 = require('@angular/forms');
var WinRaterComponent = (function () {
    function WinRaterComponent() {
        this.names = [
            'Greedy',
            'Alpha-Beta Pruning',
            'Alpha-Beta Pruning with Move Reorder',
            'Temporal Difference Learning',
            'Temporal Difference Learning (Trained)',
            'Monte Carlo Tree Search',
            'Ultimate (Combined Strategy)'
        ];
        this.N = 10;
        this.team = 1;
        this.chartData = [];
        this.chartLabels = [];
        this.teamControl = new forms_1.FormControl();
    }
    WinRaterComponent.prototype.ngOnInit = function () {
    };
    WinRaterComponent.prototype.swithTeam = function () {
        this.team *= -1;
        this.update(this.data_input, this.humanMode, this.agent_param);
    };
    WinRaterComponent.prototype.update = function (r, humanMode, agent_param) {
        if (r.length == 0) {
            this.chartData = [];
            return;
        }
        this.data_input = r;
        this.agent_param = agent_param;
        this.humanMode = humanMode;
        r = this.pre_process(r);
        // no draw
        var x = r.filter(function (x) { return x != 0; });
        var ave_win = this.process_results_ave(x);
        var accu_win = this.process_results_accu(x);
        // include draw
        var ave_win_draw = this.process_results_ave(r);
        var accu_win_draw = this.process_results_accu(r);
        this.chartData[0] = { data: ave_win.concat([0, 1]), label: "Average Winning Rate" };
        this.chartData[1] = { data: accu_win.concat([0, 1]), label: "Current Wiining Rate" };
        this.chartData[2] = { data: ave_win_draw.concat([0, 1]), label: "Average Win+Draw Rate" };
        this.chartData[3] = { data: accu_win_draw.concat([0, 1]), label: "Current Wii+Draw Rate" };
        var n = ave_win.length;
        var interval = Math.ceil(x.length / this.N);
        // console.log(data)
        // labels
        this.chartLabels = [];
        for (var i = 0; i < n; i += 1) {
            this.chartLabels.push("Game " + (i * interval));
        }
        // console.log("labels: ", this.lineChartLabels);
    };
    // results: [1|0|-1]
    // return: [win rate]
    WinRaterComponent.prototype.process_results_ave = function (results) {
        var rate = [];
        var interval = Math.ceil(results.length / this.N);
        // console.log("interval:", interval);
        for (var i = 0; i < results.length; i += interval) {
            var period = results.slice(0, i + interval);
            var wins = period.filter(function (x) { return x >= 0; });
            // console.log("period:", period)
            // console.log("wins:", wins)
            rate.push(wins.length / period.length);
        }
        return rate;
    };
    WinRaterComponent.prototype.process_results_accu = function (results) {
        var rate = [];
        var interval = Math.ceil(results.length / this.N);
        // console.log("interval:", interval);
        for (var i = 0; i < results.length; i += interval) {
            var period = results.slice(i, i + interval);
            var wins = period.filter(function (x) { return x >= 0; });
            // console.log("period:", period)
            // console.log("wins:", wins)
            rate.push(wins.length / period.length);
        }
        return rate;
    };
    WinRaterComponent.prototype.pre_process = function (arr) {
        if (this.team == 1)
            return arr;
        return arr.map(function (x) { return x *= -1; });
    };
    WinRaterComponent.prototype.get_plot_title = function () {
        var red;
        // console.log(this.agent_param)
        if (!this.humanMode)
            red = this.names[this.agent_param[0]] + "-Depth " + this.agent_param[1];
        else
            red = "You ";
        var black = this.names[this.agent_param[2]] + "-Depth " + this.agent_param[3];
        var first = this.team == 1 ? red : black;
        var second = this.team == 1 ? black : red;
        return first + "( vs " + second + " )" + " Win Rate";
    };
    WinRaterComponent = __decorate([
        core_1.Component({
            selector: 'winRater',
            templateUrl: '../client/app/component_analysis/winRate.html',
            styleUrls: ['../client/app/component_analysis/winRate.css'],
        }), 
        __metadata('design:paramtypes', [])
    ], WinRaterComponent);
    return WinRaterComponent;
}());
exports.WinRaterComponent = WinRaterComponent;
//# sourceMappingURL=winRate.js.map