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
// #region note
class Note {
    className;
    speed;
    fadeAnimation;
    createDOM(laneDOM) {
        const noteDOM = document.createElement('div');
        noteDOM.setAttribute('class', this.className);
        noteDOM.style.animationDuration = this.speed + 'ms';
        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `100ms linear ${this.fadeAnimation}`;
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove();
            });
        });
        laneDOM.appendChild(noteDOM);
    }
    constructor(className, speed, fadeAnimaion) {
        this.className = className;
        this.speed = speed;
        this.fadeAnimation = fadeAnimaion;
    }
}
// #region basic note
class Normal extends Note {
}
class Long extends Note {
}
// #endregion
// #region basic mobile note
class Tap extends Normal {
}
class Hold extends Long {
}
// #endregion
// #region advanced note
class Drag extends Tap {
}
class Flick extends Tap {
}
class LongFlick extends Hold {
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
    play(song, speed = 1000) {
        console.log(`${song.info.title} start with speed ${speed}ms`);
    }
    constructor({ DOM = {}, notes = {
        n: Tap,
        l: Hold,
        d: Drag,
        f: Flick,
        t: LongFlick
    }, judgements = [
        new Judgement('perfect', 40, true),
        new Judgement('great', 100, true),
        new Judgement('great', 100, true),
        new Judgement('bad', 500, false)
    ] } = {}) {
        this.DOM = DOM;
        this.notes = notes;
        this.judgements = judgements;
    }
}
// #endregion
/* export {
    Judgement,
    Note, Normal, Long,
    Tap, Hold, Drag, Flick, LongFlick,
    Song, Game
} */ 
