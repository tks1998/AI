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
var WeightTableComponent = (function () {
    function WeightTableComponent() {
        this.weight_record_1 = []; // [[weight]]
        this.weight_record_2 = []; // [[weight]]
        this.N = 3;
    }
    WeightTableComponent.prototype.update = function (w1, w2) {
        if (!w1)
            this.weight_record_1 = [];
        else
            this.weight_record_1.push(w1);
        this.weight_record_1 = this.weight_record_1.slice(0, this.N);
        if (!w2)
            this.weight_record_2 = [];
        else
            this.weight_record_2.push(w2);
        this.weight_record_2 = this.weight_record_2.slice(0, this.N);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], WeightTableComponent.prototype, "depth1", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], WeightTableComponent.prototype, "depth2", void 0);
    WeightTableComponent = __decorate([
        core_1.Component({
            selector: 'weightTable',
            templateUrl: '../client/app/component_analysis/weights.html',
            styleUrls: ['../client/app/component_analysis/weights.css', '../client/app/component_analysis/winRate.css'],
        }), 
        __metadata('design:paramtypes', [])
    ], WeightTableComponent);
    return WeightTableComponent;
}());
exports.WeightTableComponent = WeightTableComponent;
//# sourceMappingURL=weights.js.map