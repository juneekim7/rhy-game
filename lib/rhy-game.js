"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Map = exports.LongFlick = exports.Flick = exports.Drag = exports.Hold = exports.Tap = exports.Long = exports.Normal = exports.Note = exports.Judgement = void 0;
var Judgement = /** @class */ (function () {
    function Judgement(name, time, isCombo) {
        if (isCombo === void 0) { isCombo = true; }
        this.name = name;
        this.time = time;
        this.isCombo = isCombo;
    }
    return Judgement;
}());
exports.Judgement = Judgement;
// #region note
var Note = /** @class */ (function () {
    function Note(className, animationName, animationDuration) {
        this.className = className;
        this.animationName = animationName;
        this.animationDuration = animationDuration;
    }
    Note.prototype.generateDOM = function (laneDOM) {
        var noteDOM = document.createElement('div');
        noteDOM.setAttribute('class', this.className);
        noteDOM.setAttribute('animationName', this.animationName);
        noteDOM.setAttribute('animationDuration', this.animationDuration + 'ms');
        laneDOM.appendChild(noteDOM);
        setTimeout(function () {
            noteDOM.setAttribute('display', 'none');
            noteDOM.remove();
        }, 1);
    };
    return Note;
}());
exports.Note = Note;
// #region basic note
var Normal = /** @class */ (function (_super) {
    __extends(Normal, _super);
    function Normal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Normal;
}(Note));
exports.Normal = Normal;
var Long = /** @class */ (function (_super) {
    __extends(Long, _super);
    function Long() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Long;
}(Note));
exports.Long = Long;
// #endregion
// #region basic mobile note
var Tap = /** @class */ (function (_super) {
    __extends(Tap, _super);
    function Tap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Tap;
}(Normal));
exports.Tap = Tap;
var Hold = /** @class */ (function (_super) {
    __extends(Hold, _super);
    function Hold() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Hold;
}(Long));
exports.Hold = Hold;
// #endregion
// #region advanced note
var Drag = /** @class */ (function (_super) {
    __extends(Drag, _super);
    function Drag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Drag;
}(Tap));
exports.Drag = Drag;
var Flick = /** @class */ (function (_super) {
    __extends(Flick, _super);
    function Flick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Flick;
}(Tap));
exports.Flick = Flick;
var LongFlick = /** @class */ (function (_super) {
    __extends(LongFlick, _super);
    function LongFlick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LongFlick;
}(Hold));
exports.LongFlick = LongFlick;
// #endregion
// #endregion
// #region map
var Info = /** @class */ (function () {
    function Info(info) {
        this.music = info.music;
        this.title = info.title;
        this.artist = info.artist;
        this.level = info.level;
        this.bpm = info.bpm;
        this.split = info.split;
        this.cover = info.cover;
        this.background = info.background;
    }
    return Info;
}());
var Map = /** @class */ (function () {
    function Map(_a) {
        var info = _a.info, data = _a.data;
        this.info = info,
            this.data = data;
    }
    return Map;
}());
exports.Map = Map;
var Game = /** @class */ (function () {
    function Game(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.DOM, DOM = _c === void 0 ? {} : _c, _d = _b.notes, notes = _d === void 0 ? {
            n: Tap,
            l: Hold,
            d: Drag,
            f: Flick,
            t: LongFlick
        } : _d, _e = _b.judgements, judgements = _e === void 0 ? [
            new Judgement('perfect', 40, true),
            new Judgement('great', 100, true),
            new Judgement('great', 100, true),
            new Judgement('bad', 500, false)
        ] : _e;
        this.DOM = DOM;
        this.notes = notes;
        this.judgements = judgements;
    }
    Game.prototype.play = function (map, speed) {
        if (speed === void 0) { speed = 1000; }
        console.log("".concat(map.info.title, " start with speed ").concat(speed, "ms"));
    };
    return Game;
}());
exports.Game = Game;
