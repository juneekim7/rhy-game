"use strict";
class Judgement {
    name;
    time;
    isCombo;
    constructor(name, time, isCombo = true) {
        this.name = name;
        this.time = time;
        this.isCombo = isCombo;
    }
}
class Note {
    className = 'note';
    moveAnimation = 'note-move';
    moveTime = 1000;
    fadeAnimation = 'note-fade';
    fadeTime = 100;
    timingFunction = 'linear';
    createDOM(laneDOM) {
        const noteDOM = document.createElement('div');
        noteDOM.setAttribute('class', this.className);
        noteDOM.style.animation = `${this.moveTime}ms ${this.timingFunction} ${this.moveAnimation}`;
        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `${this.fadeTime}ms ${this.timingFunction} ${this.fadeAnimation}`;
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove();
            });
        });
        laneDOM.appendChild(noteDOM);
    }
    constructor({ className = undefined, moveAnimation = undefined, moveTime = undefined, fadeAnimation = undefined, fadeTime = undefined, timingFunction = undefined } = {}) {
        if (className)
            this.className = className;
        if (moveAnimation)
            this.moveAnimation = moveAnimation;
        if (moveTime)
            this.moveTime = moveTime;
        if (fadeAnimation)
            this.fadeAnimation = fadeAnimation;
        if (fadeTime)
            this.fadeTime = fadeTime;
        if (timingFunction)
            this.timingFunction = timingFunction;
    }
}
// #region basic note
class Normal extends Note {
    className = 'normal';
    moveAnimation = 'normal-move';
    fadeAnimation = 'normal-fade';
}
class Long extends Note {
    className = 'long';
    moveAnimation = 'long-move';
    fadeAnimation = 'long-fade';
}
// #endregion
// #region basic mobile note
class Tap extends Normal {
    className = 'tap';
    moveAnimation = 'tap-move';
    fadeAnimation = 'tap-fade';
}
class Hold extends Long {
    className = 'hold';
    moveAnimation = 'hold-move';
    fadeAnimation = 'hold-fade';
}
// #endregion
// #region advanced note
class Drag extends Tap {
    className = 'drag';
    moveAnimation = 'drag-move';
    fadeAnimation = 'drag-fade';
}
class Flick extends Tap {
    className = 'flick';
    moveAnimation = 'flick-move';
    fadeAnimation = 'flick-fade';
}
class LongFlick extends Hold {
    className = 'long-flick';
    moveAnimation = 'long-flick-move';
    fadeAnimation = 'long-flick-fade';
}
// #endregion
// #endregion
// #region song
class Info {
    music;
    title;
    artist;
    level;
    bpm;
    split;
    cover;
    background;
    constructor(info) {
        this.music = info.music;
        this.title = info.title;
        this.artist = info.artist;
        this.level = info.level;
        this.bpm = info.bpm;
        this.split = info.split;
        this.cover = info.cover;
        this.background = info.background;
    }
}
class Song {
    info;
    chart;
    constructor({ info, chart }) {
        this.info = info,
            this.chart = chart;
    }
}
class Game {
    DOM;
    notes;
    judgements;
    maxScore;
    play(song) {
        console.log(`${song.info.title} start`);
    }
    constructor({ DOM = {}, notes = {
        n: () => new Tap(),
        l: () => new Hold(),
        d: () => new Drag(),
        f: () => new Flick(),
        x: () => new LongFlick()
    }, judgements = [
        new Judgement('perfect', 40, true),
        new Judgement('great', 100, true),
        new Judgement('great', 100, true),
        new Judgement('bad', 500, false)
    ], maxScore = 100000 } = {}) {
        this.DOM = DOM;
        this.notes = notes;
        this.judgements = judgements;
        this.maxScore = maxScore;
    }
}
// #endregion
// export {
//     Judgement,
//     Note, Normal, Long,
//     Tap, Hold, Drag, Flick, LongFlick,
//     Song, Game
// }
