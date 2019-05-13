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
var RuntimeAnalysist = (function () {
    function RuntimeAnalysist() {
        this.names = [
            'Greedy',
            'Alpha-Beta Pruning',
            'Alpha-Beta Pruning with Move Reorder',
            'Temporal Difference Learning',
            'Temporal Difference Learning (Trained)',
            'Monte Carlo Tree Search',
            'Ultimate (Combined Strategy)'
        ];
    }
    RuntimeAnalysist.prototype.update = function (dic) {
        this.runtime_dict = dic;
        this.process();
    };
    RuntimeAnalysist.prototype.process = function () {
        this.runtime_arr = [];
        for (var k in this.runtime_dict) {
            var strategy = this.names[parseInt(k.split('-')[0])];
            var depth = k.split('-')[1];
            var time = this.runtime_dict[k][0];
            this.runtime_arr.push({ 'strategy': strategy, 'depth': depth, 'time': time });
        }
    };
    RuntimeAnalysist.prototype.sort_strategy = function () {
        var _this = this;
        this.runtime_arr.sort(function (x, y) { return (_this.names.indexOf(x.strategy) - _this.names.indexOf(y.strategy)); });
    };
    RuntimeAnalysist.prototype.sort_time = function () {
        this.runtime_arr.sort(function (x, y) { return (x.time - y.time); });
    };
    RuntimeAnalysist.prototype.sort_depth = function () {
        this.runtime_arr.sort(function (x, y) { return (x.depth - y.depth); });
    };
    RuntimeAnalysist = __decorate([
        core_1.Component({
            selector: 'runtimeAnalysist',
            templateUrl: '../client/app/component_analysis/runtimeAnalysist.html',
            styleUrls: ['../client/app/component_analysis/runtimeAnalysist.css', '../client/app/component_analysis/winRate.css'],
        }), 
        __metadata('design:paramtypes', [])
    ], RuntimeAnalysist);
    return RuntimeAnalysist;
}());
exports.RuntimeAnalysist = RuntimeAnalysist;
//# sourceMappingURL=runtimeAnalysist.js.map