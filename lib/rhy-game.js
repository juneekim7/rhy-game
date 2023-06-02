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
var Judgement = /** @class */ (function () {
    function Judgement(name, time, isCombo) {
        if (isCombo === void 0) { isCombo = true; }
        this.name = name;
        this.time = time;
        this.isCombo = isCombo;
    }
    return Judgement;
}());
// #region note
var Note = /** @class */ (function () {
    function Note(classNames, speed, fadeAnimaion) {
        this.classNames = classNames;
        this.speed = speed;
        this.fadeAnimation = fadeAnimaion;
    }
    Note.prototype.createDOM = function (laneDOM) {
        var _this = this;
        var noteDOM = document.createElement('div');
        noteDOM.setAttribute('class', this.classNames);
        noteDOM.style.animationDuration = this.speed + 'ms';
        noteDOM.addEventListener('animationend', function () {
            noteDOM.style.animation = "1000ms linear ".concat(_this.fadeAnimation);
            noteDOM.addEventListener('animationend', function () {
                noteDOM.remove();
            });
        });
        laneDOM.appendChild(noteDOM);
    };
    return Note;
}());
// #region basic note
var Normal = /** @class */ (function (_super) {
    __extends(Normal, _super);
    function Normal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Normal;
}(Note));
var Long = /** @class */ (function (_super) {
    __extends(Long, _super);
    function Long() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Long;
}(Note));
// #endregion
// #region basic mobile note
var Tap = /** @class */ (function (_super) {
    __extends(Tap, _super);
    function Tap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Tap;
}(Normal));
var Hold = /** @class */ (function (_super) {
    __extends(Hold, _super);
    function Hold() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Hold;
}(Long));
// #endregion
// #region advanced note
var Drag = /** @class */ (function (_super) {
    __extends(Drag, _super);
    function Drag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Drag;
}(Tap));
var Flick = /** @class */ (function (_super) {
    __extends(Flick, _super);
    function Flick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Flick;
}(Tap));
var HoldFlick = /** @class */ (function (_super) {
    __extends(HoldFlick, _super);
    function HoldFlick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HoldFlick;
}(Hold));
// #endregion
// #endregion
// #region song
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
var Song = /** @class */ (function () {
    function Song(_a) {
        var info = _a.info, chart = _a.chart;
        this.info = info,
            this.chart = chart;
    }
    return Song;
}());
var Game = /** @class */ (function () {
    function Game(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.DOM, DOM = _c === void 0 ? {} : _c, _d = _b.notes, notes = _d === void 0 ? {
            n: Tap,
            l: Hold,
            d: Drag,
            f: Flick,
            t: HoldFlick
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
    Game.prototype.play = function (song, speed) {
        if (speed === void 0) { speed = 1000; }
        console.log("".concat(song.info.title, " start with speed ").concat(speed, "ms"));
    };
    return Game;
}());
// #endregion
/* export {
    Judgement,
    Note, Normal, Long,
    Tap, Hold, Drag, Flick, HoldFlick,
    Song, Game
} */ 
