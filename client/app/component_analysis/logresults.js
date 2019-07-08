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
var core_1 = require("@angular/core");
var logResultsComponent = (function () {
    function logResultsComponent() {
    }
    logResultsComponent.prototype.ngOnInit = function () {
    };
    logResultsComponent.prototype.display = function (log_red, log_black) {
        if (log_red.length != log_black.length)
            log_black.push(" ");
        this.log_red = log_red;
        this.log_black = log_black;
        return true;
    };
    logResultsComponent = __decorate([
        core_1.Component({
            selector: 'log-results',
            templateUrl: '../client/app/component_analysis/logresults.html',
            styleUrls: ['../client/app/component_analysis/logresults.css'],
        }), 
        __metadata('design:paramtypes', [])
    ], logResultsComponent);
    return logResultsComponent;
}());
exports.logResultsComponent = logResultsComponent;
//# sourceMappingURL=logresults.js.map