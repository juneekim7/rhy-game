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
    classNames = ['note'];
    moveAnimation = 'move';
    fadeAnimation = 'fade';
    timingFunction = 'linear';
    sizeRatio = 0.1;
    createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio) {
        if (this.sizeRatio === 0)
            return;
        const noteDOM = document.createElement('div');
        for (const className of this.classNames) {
            const currentClass = noteDOM.getAttribute('class') ?? '';
            noteDOM.setAttribute('class', currentClass + ' ' + className);
        }
        noteDOM.style.setProperty('--size', `calc(${sizePerBeat} * ${this.sizeRatio})`);
        noteDOM.style.animation = `${moveTime}ms ${this.timingFunction} ${this.moveAnimation}`;
        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `${moveTime / laneSizeRatio * this.sizeRatio}ms ${this.timingFunction} ${this.fadeAnimation}`;
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove();
            });
        });
        laneDOM.appendChild(noteDOM);
    }
    constructor(lane, index, { classNames = undefined, moveAnimation = undefined, fadeAnimation = undefined, timingFunction = undefined, sizeRatio } = {}) {
        if (classNames)
            this.classNames = classNames;
        if (moveAnimation)
            this.moveAnimation = moveAnimation;
        if (fadeAnimation)
            this.fadeAnimation = fadeAnimation;
        if (timingFunction)
            this.timingFunction = timingFunction;
        if (sizeRatio)
            this.sizeRatio = sizeRatio;
    }
}
// #region basic note
class Normal extends Note {
    classNames = ['note', 'normal'];
    sizeRatio = 0.1;
}
class Long extends Note {
    classNames = ['note', 'long'];
    sizeRatio = 1;
    constructor(lane, index, { classNames = undefined, moveAnimation = undefined, fadeAnimation = undefined, timingFunction = undefined, sizeRatio } = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
        const noteChar = lane[index];
        let length = 1;
        if (index > 0 && lane[index - 1] === noteChar)
            length = 0;
        else
            while (lane[index + length] === noteChar)
                length++;
        this.sizeRatio = length;
    }
}
// #endregion
// #region basic mobile note
class Tap extends Normal {
    classNames = ['note', 'normal', 'tap'];
}
class Hold extends Long {
    classNames = ['note', 'long', 'hold'];
}
// #endregion
// #region advanced note
class Drag extends Tap {
    classNames = ['note', 'normal', 'tap', 'drag'];
}
class Flick extends Tap {
    classNames = ['note', 'normal', 'tap', 'flick'];
}
class HoldFlick extends Hold {
    classNames = ['note', 'long', 'hold', 'hold-flick'];
}
// #endregion
// #endregion
// #region song
class Info {
    music;
    title;
    artist;
    difficulty;
    bpm;
    split;
    delay;
    cover;
    background;
    get timePerBeat() {
        return 240000 / this.bpm / this.split;
    }
    constructor(info) {
        this.music = info.music;
        this.title = info.title;
        this.artist = info.artist;
        this.difficulty = info.difficulty;
        this.bpm = info.bpm;
        this.split = info.split;
        this.delay = info.delay;
        this.cover = info.cover;
        this.background = info.background;
    }
}
class Song {
    info;
    charts;
    constructor({ info, charts }) {
        this.info = new Info(info),
            this.charts = charts;
    }
}
class Game {
    DOM;
    notes;
    judgements;
    maxScore;
    delay;
    sizePerBeat;
    #laneSizeRatio;
    set laneSizeRatio(ratio) {
        this.#laneSizeRatio = ratio;
        document.documentElement.style.setProperty('--lane-size', `calc(${this.sizePerBeat} * ${ratio})`);
    }
    get laneSizeRatio() {
        return this.#laneSizeRatio;
    }
    loadNote(song, mode) {
        if (!(mode in song.charts)) {
            throw new Error(`there is no mode ${mode} in the song ${song.info.title}`);
        }
        if (song.charts[mode].length === 0) {
            throw new Error(`there is no information in the mode ${mode} of the song ${song.info.title}`);
        }
        const chart = {};
        for (const group of song.charts[mode]) {
            for (const laneName in group) {
                if (!(laneName in this.DOM))
                    continue;
                if (!chart[laneName])
                    chart[laneName] = '';
                chart[laneName] += group[laneName].replace(/\|/g, '');
            }
        }
        let index = 0;
        const moveTime = song.info.timePerBeat * this.laneSizeRatio;
        console.log(song.info.timePerBeat);
        setInterval(() => {
            for (const laneName in chart) {
                const lane = chart[laneName];
                if (index === lane.length)
                    return;
                const noteChar = lane[index];
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](lane, index);
                    note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio);
                }
            }
            index++;
        }, song.info.timePerBeat);
    }
    play(song, mode) {
        const music = new Audio(song.info.music);
        const moveTime = song.info.timePerBeat * this.laneSizeRatio;
        setTimeout(() => {
            this.loadNote(song, mode);
        }, 0);
        setTimeout(() => {
            music.play();
        }, moveTime + this.delay);
        console.log(`${song.info.title} start`);
    }
    constructor({ DOM = {}, notes = {
        n: (lane, index) => new Tap(lane, index),
        l: (lane, index) => new Hold(lane, index),
        d: (lane, index) => new Drag(lane, index),
        f: (lane, index) => new Flick(lane, index),
        x: (lane, index) => new HoldFlick(lane, index)
    }, judgements = [
        new Judgement('perfect', 40, true),
        new Judgement('great', 100, true),
        new Judgement('great', 100, true),
        new Judgement('bad', 500, false)
    ], maxScore = 100000, delay = 0, sizePerBeat = '100px', laneSizeRatio = 8 } = {}) {
        this.DOM = DOM;
        this.notes = notes;
        this.judgements = judgements;
        this.maxScore = maxScore;
        this.delay = delay;
        if (typeof sizePerBeat === 'number')
            sizePerBeat = sizePerBeat + 'px';
        this.sizePerBeat = sizePerBeat;
        this.#laneSizeRatio = laneSizeRatio;
        this.laneSizeRatio = laneSizeRatio;
    }
}
// #endregion
// export {
//     Judgement,
//     Note, Normal, Long,
//     Tap, Hold, Drag, Flick, HoldFlick,
//     Song, Game
// }
