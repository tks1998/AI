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
        this.chartType = 'bar';
        this.chartData = [];
        this.chartLabels = [];
        this.chartColors = [
            {
                backgroundColor: 'rgba(207, 161, 32, 0.3)',
                borderColor: 'rgba(207, 67, 32, .7)',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(207, 67, 32, .7)',
            },
            {
                backgroundColor: 'rgba(0, 94, 137, 0.3)',
                borderColor: 'rgba(38, 24, 114, 0.7)',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(38, 24, 114, .7)',
            }
        ];
        this.lineChartLegend = true;
        this.chartOptions = {
            responsive: true
        };
        this.names = [
            'Greedy',
            'Alpha-Beta Pruning',
            'Monte Carlo Tree Search',
            'Ultimate (Combined Strategy)'
        ];
        this.teamControl = new forms_1.FormControl();
        this.N = 10;
        this.team = 1;
    }
    WinRaterComponent.prototype.chartClicked = function (e) { };
    WinRaterComponent.prototype.chartHovered = function (e) { };
    WinRaterComponent.prototype.ngOnInit = function () {
    };
    WinRaterComponent.prototype.swithTeam = function () {
        this.team *= -1;
        this.update(this.data, this.agent_param);
    };
    WinRaterComponent.prototype.update = function (r, agent_param) {
        if (r.length == 0) {
            this.chartData = [];
            return;
        }
        this.data = r;
        this.agent_param = agent_param;
        r = this.team_results(r);
        var x = r.filter(function (x) { return x != 0; });
        // console.log("result: ", x)
        // no draw
        var w_ratio = this.process_results_ave(x);
        // console.log("w_ratio: ",w_ratio)
        // include draw
        var wd_ratio = this.process_results_ave(r);
        this.chartData[0] = { data: w_ratio, label: "Winning Rate" };
        this.chartData[1] = { data: wd_ratio, label: "Winning (included draw) Rate" };
        var n = w_ratio.length;
        var interval = Math.ceil(x.length / this.N);
        // labels
        this.chartLabels = [];
        for (var i = 0; i < n; i += 1) {
            this.chartLabels.push("Game " + (i * interval + 1));
        }
    };
    // results: [1|0|-1]
    // return: [win rate]
    WinRaterComponent.prototype.process_results_ave = function (results) {
        var rate = [];
        var interval = Math.ceil(results.length / this.N);
        // console.log("interval ave:", interval);
        for (var i = 0; i < results.length; i += interval) {
            var period = results.slice(0, i + interval);
            // console.log("p ave: ",period);
            var wins = period.filter(function (x) { return x >= 0; });
            // console.log("r ave: ", wins);
            rate.push(wins.length / period.length);
        }
        return rate;
    };
    WinRaterComponent.prototype.team_results = function (arr) {
        if (this.team == 1)
            return arr;
        return arr.map(function (x) { return x *= -1; });
    };
    WinRaterComponent.prototype.get_plot_title = function () {
        var red = "You";
        var black = this.names[this.agent_param[0]];
        if (this.agent_param[0] == 0)
            black = black;
        else
            (this.agent_param[0] == 2) ? black = black + "-Simulation " + this.agent_param[1] : black = black + "-Depth " + this.agent_param[1];
        var first = this.team == 1 ? red : black;
        var second = this.team == 1 ? black : red;
        return first + " ( vs " + second + " ) " + "Win Rate";
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