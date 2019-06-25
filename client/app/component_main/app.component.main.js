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
var http_1 = require('@angular/http');
var winRate_1 = require('../component_analysis/winRate');
var AppComponent = (function () {
    function AppComponent(http) {
        this.http = http;
        this.logined = false;
        this.reverse = false; // check chinachess ? reverse chinachess
        this.selectedFile = null;
        this.chinachess = new forms_1.FormControl();
        this.flag = new forms_1.FormControl();
        this.timer = new forms_1.FormControl();
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.selectOpponent = function (v) {
        // console.log(v);
    };
    // update analysis results
    AppComponent.prototype.onFileSelected = function ($event) {
        this.selectedFile = $event.target.files[0];
    };
    AppComponent.prototype.onUpload = function () {
    };
    //
    // update analysis results
    AppComponent.prototype.update_result = function (results, agent_param) {
        this.winRaterComp.update(results, agent_param);
    };
    __decorate([
        core_1.ViewChild(winRate_1.WinRaterComponent), 
        __metadata('design:type', winRate_1.WinRaterComponent)
    ], AppComponent.prototype, "winRaterComp", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            templateUrl: '../client/app/component_main/app.component.main.html',
            styleUrls: ['../client/app/component_main//app.component.main.css']
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.main.js.map