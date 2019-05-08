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
var Draggable = (function () {
    function Draggable(element) {
        var _this = this;
        this.element = element;
        this.mouseup = new core_1.EventEmitter();
        this.mousedown = new core_1.EventEmitter();
        this.mousemove = new core_1.EventEmitter();
        this.element.nativeElement.style.position = 'relative';
        this.element.nativeElement.style.cursor = 'pointer';
        this.mousedrag = this.mousedown.subscribe(function (event) {
            event.preventDefault();
            return {
                left: event.clientX - _this.element.nativeElement.getBoundingClientRect().left,
                top: event.clientY - _this.element.nativeElement.getBoundingClientRect().top
            };
        });
        //   .flatMap(imageOffset => this.mousemove.subscribe(pos => ({
        //     top:  pos.clientY - imageOffset.top,
        //     left: pos.clientX - imageOffset.left
        //   }))
        //   .takeUntil(this.mouseup.subscribe()));
    }
    Draggable.prototype.onMouseup = function (event) { this.mouseup.next(event); };
    Draggable.prototype.onMousedown = function (event) { this.mousedown.next(event); };
    Draggable.prototype.onMousemove = function (event) { this.mousemove.next(event); };
    Draggable.prototype.onInit = function () {
        var _this = this;
        this.mousedrag.ub({
            next: function (pos) {
                // Update position
                _this.element.nativeElement.style.top = pos.top + 'px';
                _this.element.nativeElement.style.left = pos.left + 'px';
            }
        });
    };
    __decorate([
        core_1.HostListener('mouseup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Draggable.prototype, "onMouseup", null);
    __decorate([
        core_1.HostListener('mousedown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Draggable.prototype, "onMousedown", null);
    __decorate([
        core_1.HostListener('mousemove', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], Draggable.prototype, "onMousemove", null);
    Draggable = __decorate([
        core_1.Directive({
            selector: '[draggable]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Draggable);
    return Draggable;
}());
exports.Draggable = Draggable;
//# sourceMappingURL=draggable.js.map