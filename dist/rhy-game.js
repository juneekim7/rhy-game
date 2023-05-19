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
    hasJudged;
    judgement;
    createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio) {
        if (this.hasJudged)
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
    judge(judgements, eventName, actualTime) {
        if (this.hasJudged)
            'none';
        const diffTime = Math.abs(actualTime - this.expectedTime);
        for (const judgement of judgements) {
            if (diffTime < judgement.time) {
                this.hasJudged = true;
                this.judgement = judgement;
                return judgement;
            }
        }
        if (actualTime < this.expectedTime)
            return 'none';
        this.hasJudged = true;
        this.judgement = Judgement.miss;
        return Judgement.miss;
    }
    constructor(expectedTime, { classNames = ['note'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 0.1 } = {}) {
        this.expectedTime = expectedTime;
        this.hasJudged = false;
        this.judgement = 'none';
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
    judge(judgements, eventName, actualTime) {
        if (eventName === 'keydown' && !this.hasJudged)
            return super.judge(judgements, eventName, actualTime);
        else if (this.hasJudged)
            return Judgement.miss;
        else
            return 'none';
    }
    constructor(expectedTime, longRequiredData, { classNames = ['note', 'long'], moveAnimation = 'move', fadeAnimation = 'fade', timingFunction = 'linear', sizeRatio = 1 } = {}) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        });
        const { lane, index, timePerBeat } = longRequiredData;
        const noteChar = lane[index];
        let length = 1;
        while (lane[index + length] === noteChar)
            length++;
        this.sizeRatio = length;
        if (index > 0 && lane[index - 1] === noteChar) {
            if (length !== 1) {
                this.hasJudged = true;
                this.judge = () => Judgement.miss;
            }
            else {
                this.expectedTime += timePerBeat * length;
                this.judge = (judgements, eventName, actualTime) => {
                    if (eventName === 'keyup' && !this.hasJudged)
                        return super.judge(judgements, eventName, actualTime);
                    else if (this.hasJudged) {
                        return 'none';
                    }
                    else
                        return Judgement.miss;
                };
            }
        }
        else if (length === 1) {
            throw new Error('long notes length should be at least 2');
        }
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
    volume;
    bpm;
    split;
    delay;
    cover;
    background;
    design;
    get timePerBeat() {
        return 240000 / this.bpm / this.split;
    }
    constructor(info) {
        this.music = info.music;
        this.title = info.title;
        this.artist = info.artist;
        this.difficulty = info.difficulty;
        if (info.volume)
            this.volume = info.volume;
        else
            this.volume = 1;
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
        this.design = info.design;
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
    constructor(minusTime = 0) {
        this.initTime = new Date().getTime() + minusTime;
    }
}
class Game {
    DOM;
    keybind;
    notes;
    judgements;
    maxScore;
    delay;
    sizePerBeat;
    #laneSizeRatio;
    expectedTime = new Timer();
    actualTime = new Timer();
    createdNotes = {};
    isPressed = {};
    judgementData = {
        score: 0,
        combo: 0,
        lastJudgement: 'none',
        judgements: {}
    };
    set laneSizeRatio(ratio) {
        this.#laneSizeRatio = ratio;
        document.documentElement.style.setProperty('--lane-size', `calc(${this.sizePerBeat} * ${ratio})`);
    }
    get laneSizeRatio() {
        return this.#laneSizeRatio;
    }
    // #region judge
    initJudge() {
        this.judgementData = {
            score: 0,
            combo: 0,
            lastJudgement: 'none',
            judgements: {}
        };
        const data = this.judgementData;
        for (const judgement of this.judgements) {
            data.judgements[judgement.name] = 0;
        }
        data.judgements.miss = 0;
        this.sendJudgeToDOM();
    }
    sendJudgeToDOM() {
        const DOM = this.DOM;
        const data = this.judgementData;
        if (DOM.score) {
            DOM.score.textContent = data.score.toString()
                .padStart(this.maxScore.toString().length, '0');
        }
        if (DOM.judgement) {
            DOM.judgement.textContent = data.lastJudgement;
        }
        if (DOM.combo) {
            DOM.combo.textContent = data.combo.toString();
        }
    }
    setJudge(judgement) {
        const data = this.judgementData;
        data.lastJudgement = judgement.name;
        data.judgements[judgement.name]++;
        if (judgement.isCombo)
            data.combo++;
        else
            data.combo = 0;
        this.sendJudgeToDOM();
    }
    judgeLane(laneName, eventName, actualTime = this.actualTime.getTime()) {
        if (!this.createdNotes[laneName])
            throw new Error(`there is no lane ${laneName}`);
        if (this.createdNotes[laneName].length === 0)
            return;
        const note = this.createdNotes[laneName][0];
        if (note.hasJudged) {
            this.createdNotes[laneName].shift();
            this.judgeLane(laneName, eventName, actualTime);
            return;
        }
        const judgement = note.judge(this.judgements, eventName, actualTime);
        if (judgement === 'none')
            return;
        this.setJudge(judgement);
        this.createdNotes[laneName].shift();
    }
    // #endregion
    // #region play
    getActualChart(song, mode) {
        if (!(mode in song.chart)) {
            throw new Error(`there is no mode ${mode} in the song ${song.info.title}`);
        }
        if (song.chart[mode].length === 0) {
            throw new Error(`there is no information in the mode ${mode} of the song ${song.info.title}`);
        }
        const actualChart = {};
        for (const group of song.chart[mode]) {
            for (const laneName in group) {
                if (!(laneName in this.DOM))
                    continue;
                if (!actualChart[laneName])
                    actualChart[laneName] = '';
                actualChart[laneName] += group[laneName].replace(/\|/g, '');
                this.createdNotes[laneName] = [];
            }
        }
        return actualChart;
    }
    setKeyBind(actualChart) {
        for (const laneName in actualChart) {
            this.isPressed[laneName] = false;
            window.addEventListener('keydown', (event) => {
                if (!(event.key in this.keybind) || this.isPressed[event.key])
                    return;
                this.isPressed[event.key] = true;
                this.judgeLane(this.keybind[event.key], 'keydown');
            });
            window.addEventListener('keyup', (event) => {
                if (!(event.key in this.keybind))
                    return;
                this.isPressed[event.key] = false;
                this.judgeLane(this.keybind[event.key], 'keyup');
            });
        }
    }
    loadNote(actualChart, timePerBeat) {
        let index = 0;
        const moveTime = timePerBeat * this.laneSizeRatio;
        setInterval(() => {
            for (const laneName in actualChart) {
                const lane = actualChart[laneName];
                if (index === lane.length)
                    return;
                const noteChar = lane[index];
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](this.expectedTime.getTime(), {
                        lane,
                        index,
                        timePerBeat: timePerBeat
                    });
                    note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio);
                    this.createdNotes[laneName].push(note);
                    setTimeout(() => {
                        if (this.createdNotes[laneName].includes(note)) {
                            this.createdNotes[laneName].shift();
                        }
                        if (!note.hasJudged) {
                            note.hasJudged = true;
                            this.setJudge(Judgement.miss);
                        }
                    }, moveTime + timePerBeat * note.sizeRatio + this.judgements[this.judgements.length - 1].time);
                }
            }
            index++;
        }, timePerBeat);
    }
    play(song, mode) {
        const moveTime = song.info.timePerBeat * this.laneSizeRatio;
        this.initJudge();
        this.setKeyBind(this.getActualChart(song, mode));
        this.expectedTime = new Timer();
        this.actualTime = new Timer(moveTime);
        const music = new Audio(song.info.music);
        music.volume = song.info.volume;
        setTimeout(() => {
            this.loadNote(this.getActualChart(song, mode), song.info.timePerBeat);
        }, 0);
        setTimeout(() => {
            music.play();
        }, moveTime + this.delay);
        console.log(`${song.info.title} start`);
    }
    // #endregion
    constructor({ DOM = {}, keybind = {}, notes = {
        n: (expectedTime) => new Tap(expectedTime),
        l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData),
        d: (expectedTime) => new Drag(expectedTime),
        f: (expectedTime) => new Flick(expectedTime),
        x: (expectedTime, additionalData) => new HoldFlick(expectedTime, additionalData)
    }, judgements = [
        new Judgement('perfect', 40, true),
        new Judgement('great', 80, true),
        new Judgement('good', 100, true),
        new Judgement('bad', 200, false)
    ], maxScore = 100000, delay = 0, sizePerBeat = '100px', laneSizeRatio = 8 } = {}) {
        this.DOM = DOM;
        this.keybind = keybind;
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
