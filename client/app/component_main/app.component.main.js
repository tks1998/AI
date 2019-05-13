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
var winRate_1 = require('../component_analysis/winRate');
var runtimeAnalysist_1 = require('../component_analysis/runtimeAnalysist');
var weights_1 = require('../component_analysis/weights');
var AppComponent = (function () {
    function AppComponent() {
        this.logined = false;
        this.humanMode = new forms_1.FormControl();
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.selectOpponent = function (v) {
        // console.log(v);
    };
    // update analysis results
    AppComponent.prototype.update_result = function (x, humanMode, agent_param) {
        this.winRaterComp.update(x, humanMode, agent_param);
    };
    AppComponent.prototype.update_runtime = function (x) {
        this.runtimeAnalysist.update(x);
    };
    AppComponent.prototype.update_weight = function (w1, w2) {
        this.weightTable.update(w1, w2);
    };
    AppComponent.prototype.clear = function () {
        this.update_weight(null, null);
    };
    __decorate([
        core_1.ViewChild(winRate_1.WinRaterComponent), 
        __metadata('design:type', winRate_1.WinRaterComponent)
    ], AppComponent.prototype, "winRaterComp", void 0);
    __decorate([
        core_1.ViewChild(runtimeAnalysist_1.RuntimeAnalysist), 
        __metadata('design:type', runtimeAnalysist_1.RuntimeAnalysist)
    ], AppComponent.prototype, "runtimeAnalysist", void 0);
    __decorate([
        core_1.ViewChild(weights_1.WeightTableComponent), 
        __metadata('design:type', weights_1.WeightTableComponent)
    ], AppComponent.prototype, "weightTable", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            templateUrl: '../client/app/component_main/app.component.main.html',
            styleUrls: ['../client/app/component_main//app.component.main.css']
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.main.js.map