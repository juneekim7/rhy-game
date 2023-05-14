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
    moveAnimation = 'move';
    fadeAnimation = 'fade';
    timingFunction = 'linear';
    sizeRatio = 0.1;
    createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio) {
        const noteDOM = document.createElement('div');
        noteDOM.setAttribute('class', this.className);
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
    constructor({ className = undefined, moveAnimation = undefined, fadeAnimation = undefined, timingFunction = undefined, sizeRatio } = {}) {
        if (className)
            this.className = className;
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
    className = 'normal';
    sizeRatio = 0.1;
}
class Long extends Note {
    className = 'long';
    sizeRatio = 1;
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
    className = 'drag';
}
class Flick extends Tap {
    className = 'flick';
}
class LongFlick extends Hold {
    className = 'long-flick';
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
        this.cover = info.cover;
        this.background = info.background;
    }
}
class Song {
    info;
    charts;
    constructor({ info, charts }) {
        this.info = info,
            this.charts = charts;
    }
}
class Game {
    DOM;
    notes;
    judgements;
    maxScore;
    time;
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
        setInterval(() => {
            for (const laneName in chart) {
                const lane = chart[laneName];
                if (index === lane.length)
                    return;
                const noteChar = lane[index];
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar]();
                    note.createDOM(this.DOM[laneName], this.time.move, this.sizePerBeat, this.laneSizeRatio);
                }
            }
            index++;
        }, song.info.timePerBeat);
    }
    play(song, mode) {
        const music = new Audio(song.info.music);
        setTimeout(() => {
            this.loadNote(song, mode);
        }, 0);
        setTimeout(() => {
            music.play();
        }, this.time.move + this.time.delay);
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
    ], maxScore = 100000, time = {
        move: 1000,
        delay: 0
    }, sizePerBeat = '100px', laneSizeRatio = 8 } = {}) {
        this.DOM = DOM;
        this.notes = notes;
        this.judgements = judgements;
        this.maxScore = maxScore;
        this.time = time;
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
//     Tap, Hold, Drag, Flick, LongFlick,
//     Song, Game
// }
