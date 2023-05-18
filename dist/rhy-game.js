"use strict";
class Judgement {
    static miss = new Judgement('miss', 0, false);
    name;
    time;
    isCombo;
    constructor(name, time, isCombo = true) {
        if (time < 0)
            throw new Error('judgement time must be not negative');
        this.name = name;
        this.time = time;
        this.isCombo = isCombo;
    }
}
class Note {
    expectedTime;
    classNames;
    moveAnimation;
    fadeAnimation;
    timingFunction;
    sizeRatio;
    isDeleted;
    createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio) {
        if (this.isDeleted || this.sizeRatio === 0)
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
                this.isDeleted = true;
                noteDOM.remove();
            });
        });
        laneDOM.appendChild(noteDOM);
    }
    judge(judgements, actualTime) {
        if (this.isDeleted)
            return 'none';
        const diffTime = Math.abs(actualTime - this.expectedTime);
        for (const judgement of judgements) {
            if (diffTime < judgement.time) {
                this.isDeleted = true;
                return judgement;
            }
        }
        if (actualTime < this.expectedTime)
            return 'none';
        this.isDeleted = true;
        return Judgement.miss;
    }
    constructor(expectedTime, { classNames = ['note'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        this.expectedTime = expectedTime;
        this.isDeleted = false;
        this.classNames = classNames;
        this.moveAnimation = moveAnimation;
        this.fadeAnimation = fadeAnimation;
        this.timingFunction = timingFunction;
        this.sizeRatio = sizeRatio;
    }
}
// #region basic note
class Normal extends Note {
    constructor(expectedTime, { classNames = ['note', 'normal'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
    }
}
class Long extends Note {
    classNames = ['note', 'long'];
    sizeRatio = 1;
    constructor(expectedTime, longRequiredData, { classNames = ['note', 'long'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 1 } = {}) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
        const { lane, index } = longRequiredData;
        const noteChar = lane[index];
        let length = 1;
        if (index > 0 && lane[index - 1] === noteChar) {
            this.isDeleted = true;
            return;
        }
        else
            while (lane[index + length] === noteChar)
                length++;
        this.sizeRatio = length;
    }
}
// #endregion
// #region basic mobile note
class Tap extends Normal {
    constructor(expectedTime, { classNames = ['note', 'normal', 'tap'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
    }
}
class Hold extends Long {
    constructor(expectedTime, longRequiredData, { classNames = ['note', 'long', 'hold'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        super(expectedTime, longRequiredData, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
    }
}
// #endregion
// #region advanced note
class Drag extends Tap {
    constructor(expectedTime, { classNames = ['note', 'normal', 'tap', 'drag'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
    }
}
class Flick extends Tap {
    constructor(expectedTime, { classNames = ['note', 'normal', 'tap', 'flick'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
    }
}
class HoldFlick extends Hold {
    constructor(expectedTime, longRequiredData, { classNames = ['note', 'long', 'hold', 'hold-flick'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        super(expectedTime, longRequiredData, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
    }
}
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
        if (info.split)
            this.split = info.split;
        else
            this.split = 16;
        this.split = info.split;
        if (info.delay)
            this.delay = info.delay;
        else
            this.delay = 0;
        this.cover = info.cover;
        this.background = info.background;
    }
}
class Song {
    info;
    chart;
    constructor({ info, chart }) {
        this.info = new Info(info),
            this.chart = chart;
    }
}
// #endregion
// #region timer
class Timer {
    initTime;
    getTime() {
        return new Date().getTime() - this.initTime;
    }
    constructor(initTime = new Date().getTime()) {
        this.initTime = initTime;
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
    createdNotes = {};
    set laneSizeRatio(ratio) {
        this.#laneSizeRatio = ratio;
        document.documentElement.style.setProperty('--lane-size', `calc(${this.sizePerBeat} * ${ratio})`);
    }
    get laneSizeRatio() {
        return this.#laneSizeRatio;
    }
    loadNote(song, mode) {
        if (!(mode in song.chart)) {
            throw new Error(`there is no mode ${mode} in the song ${song.info.title}`);
        }
        if (song.chart[mode].length === 0) {
            throw new Error(`there is no information in the mode ${mode} of the song ${song.info.title}`);
        }
        const chart = {};
        for (const group of song.chart[mode]) {
            for (const laneName in group) {
                if (!(laneName in this.DOM))
                    continue;
                if (!chart[laneName])
                    chart[laneName] = '';
                chart[laneName] += group[laneName].replace(/\|/g, '');
                this.createdNotes[laneName] = [];
            }
        }
        let index = 0;
        const moveTime = song.info.timePerBeat * this.laneSizeRatio;
        const expected = new Timer();
        setInterval(() => {
            for (const laneName in chart) {
                const lane = chart[laneName];
                if (index === lane.length)
                    return;
                const noteChar = lane[index];
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](expected.getTime(), {
                        lane,
                        index,
                        timePerBeat: song.info.timePerBeat
                    });
                    note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio);
                    this.createdNotes[laneName].push(note);
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
    judgeLane(laneName, actualTime) {
        if (this.createdNotes[laneName].length === 0)
            return;
        const note = this.createdNotes[laneName][0];
        // check missed note
        if (note.isDeleted) {
            this.createdNotes[laneName].shift();
            this.judgeLane(laneName, actualTime);
            return;
        }
        const judgement = note.judge(this.judgements, actualTime);
        if (judgement === 'none')
            return;
        else
            ; // do something
        this.createdNotes[laneName].shift();
    }
    constructor({ DOM = {}, notes = {
        n: (expectedTime) => new Tap(expectedTime),
        l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData),
        d: (expectedTime) => new Drag(expectedTime),
        f: (expectedTime) => new Flick(expectedTime),
        x: (expectedTime, additionalData) => new HoldFlick(expectedTime, additionalData)
    }, judgements = [
        new Judgement('perfect', 40, true),
        new Judgement('great', 100, true),
        new Judgement('great', 100, true),
        new Judgement('bad', 500, false)
    ], maxScore = 100000, delay = 0, sizePerBeat = '100px', laneSizeRatio = 8 } = {}) {
        this.DOM = DOM;
        this.notes = notes;
        this.judgements = judgements.sort((j1, j2) => j1.time - j2.time);
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
