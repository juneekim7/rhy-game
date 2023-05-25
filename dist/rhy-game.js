"use strict";
class Judgement {
    static miss = new Judgement('miss', 0, 0, false);
    name;
    time;
    scoreRatio;
    isCombo;
    constructor(name, time, scoreRatio, isCombo = true) {
        if ([name, time, scoreRatio, isCombo].map((arg) => typeof arg).includes('undefined')) {
            throw new Error('judgement must requires name, time, scoreRatio');
        }
        if (time < 0)
            throw new Error('judgement time must be not negative');
        if (scoreRatio < 0 || scoreRatio > 1)
            throw new Error('scoreRatio should be between in 0 to 1');
        this.name = name;
        this.time = time;
        this.scoreRatio = scoreRatio;
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
    count;
    noteDOM;
    createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio) {
        if (this.hasJudged)
            return;
        for (const className of this.classNames) {
            const currentClass = this.noteDOM.getAttribute('class') ?? '';
            this.noteDOM.setAttribute('class', currentClass + ' ' + className);
        }
        this.noteDOM.style.setProperty('--size', `calc(${sizePerBeat} * ${this.sizeRatio})`);
        this.noteDOM.style.animation = `${moveTime}ms ${this.timingFunction} ${this.moveAnimation}`;
        this.noteDOM.addEventListener('animationend', () => {
            this.noteDOM.style.animation = `${moveTime / laneSizeRatio * this.sizeRatio}ms ${this.timingFunction} ${this.fadeAnimation}`;
            this.noteDOM.addEventListener('animationend', () => {
                this.noteDOM.remove();
            });
        });
        laneDOM.appendChild(this.noteDOM);
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
        this.classNames = classNames;
        this.moveAnimation = moveAnimation;
        this.fadeAnimation = fadeAnimation;
        this.timingFunction = timingFunction;
        this.sizeRatio = sizeRatio;
        this.hasJudged = false;
        this.judgement = 'none';
        this.count = 1;
        this.noteDOM = document.createElement('div');
    }
}
// #region basic note
class Normal extends Note {
    judge(judgements, eventName, actualTime) {
        if (eventName === 'keydown')
            return super.judge(judgements, eventName, actualTime);
        else
            return 'none';
    }
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
    createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio) {
        if (this.sizeRatio === 1)
            return;
        super.createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio);
    }
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
        this.count = 1;
        if (index > 0 && lane[index - 1] === noteChar) {
            // 중간 노트
            if (length !== 1) {
                this.hasJudged = true;
                this.count = 0;
                this.judge = () => Judgement.miss;
            }
            // 끝 노트
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
        else if (length === 1)
            throw new Error('long notes length should be at least 2');
        // 시작 노트
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
    startFrom;
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
        if (info.volume) {
            if (info.volume < 0 || info.volume > 1)
                throw new Error('volume should be between in 0 to 1');
            this.volume = info.volume;
        }
        else
            this.volume = 1;
        this.bpm = info.bpm;
        if (info.split)
            this.split = info.split;
        else
            this.split = 16;
        if (info.delay)
            this.delay = info.delay;
        else
            this.delay = 0;
        if (info.startFrom)
            this.startFrom = info.startFrom;
        else
            this.startFrom = 0;
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
    judgementPosition;
    event;
    expectedTime = new Timer();
    actualTime = new Timer();
    scorePerNote = 0;
    music = new Audio();
    createdNotes = {};
    isPressed = {};
    judgementData = {
        score: 0,
        combo: 0,
        maxCombo: 0,
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
    sendJudgeToDOM() {
        const DOM = this.DOM;
        const data = this.judgementData;
        if (DOM.score) {
            DOM.score.textContent = Math.round(data.score).toString()
                .padStart(this.maxScore.toString().length, '0');
        }
        if (DOM.judgement) {
            DOM.judgement.textContent = data.lastJudgement;
        }
        if (DOM.combo) {
            DOM.combo.textContent = data.combo.toString();
        }
    }
    initJudge() {
        const data = this.judgementData;
        data.score = 0;
        data.combo = 0;
        data.maxCombo = 0;
        data.lastJudgement = 'none';
        for (const judgement of this.judgements) {
            data.judgements[judgement.name] = 0;
        }
        data.judgements.miss = 0;
        this.event.judge(this, data, null);
    }
    setJudge(judgement, judgedNote) {
        const data = this.judgementData;
        data.judgements[judgement.name]++;
        data.score += this.scorePerNote * judgement.scoreRatio;
        if (judgement.isCombo) {
            data.combo++;
            data.maxCombo = Math.max(data.combo, data.maxCombo);
        }
        else
            data.combo = 0;
        data.lastJudgement = judgement.name;
        this.event.judge(this, data, judgedNote);
    }
    judgeLane(laneName, eventName, actualTime = this.actualTime.getTime()) {
        if (!this.createdNotes[laneName])
            throw new Error(`there is no lane '${laneName}'`);
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
        this.setJudge(judgement, this.createdNotes[laneName][0]);
        this.createdNotes[laneName].shift();
    }
    // #endregion
    // #region play
    getActualChart(song, mode) {
        if (!(mode in song.chart)) {
            throw new Error(`There is no mode '${mode}' in the song '${song.info.title}'`);
        }
        if (song.chart[mode].length === 0) {
            throw new Error(`There is no information in the mode '${mode}' of the song '${song.info.title}'`);
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
        if (Object.keys(actualChart).length === 0) {
            throw new Error(`There is no lane of the song '${song.info.title}' in mode '${mode}' that matches to DOM`);
        }
        return actualChart;
    }
    setKeyBind(actualChart) {
        for (const laneName in actualChart) {
            this.isPressed[laneName] = false;
        }
        window.addEventListener('keydown', (event) => {
            if (!(event.key in this.keybind) || this.isPressed[event.key])
                return;
            this.isPressed[event.key] = true;
            this.judgeLane(this.keybind[event.key], 'keydown');
            if (this.event.input['keydown']) {
                this.event.input['keydown'](this, this.keybind[event.key]);
            }
        });
        window.addEventListener('keyup', (event) => {
            if (!(event.key in this.keybind))
                return;
            this.isPressed[event.key] = false;
            this.judgeLane(this.keybind[event.key], 'keyup');
            if (this.event.input['keyup']) {
                this.event.input['keyup'](this, this.keybind[event.key]);
            }
        });
    }
    fadeMusic() {
        if (this.music.volume < 0.1) {
            this.music.pause();
            return;
        }
        this.music.volume -= 0.03;
        setTimeout(() => {
            this.fadeMusic();
        }, 100);
    }
    countNote(actualChart) {
        let count = 0;
        for (const lane of Object.values(actualChart)) {
            for (let index = 0; index < lane.length; index++) {
                const noteChar = lane[index];
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](this.expectedTime.getTime(), {
                        lane,
                        index,
                        timePerBeat: 0
                    });
                    count += note.count;
                }
            }
        }
        return count;
    }
    loadNote(actualChart, timePerBeat, startIndex = 0, beat = 0) {
        const moveTime = timePerBeat * this.laneSizeRatio;
        const judgeTime = moveTime * (1 - this.judgementPosition);
        const worstJudgement = this.judgements.at(-1);
        const index = startIndex + beat;
        if (worstJudgement === undefined)
            throw new Error('There should be at least one judgement.');
        if (index === Object.values(actualChart)[0].length) {
            this.fadeMusic();
            setTimeout(() => {
                this.event.end(this, this.judgementData);
            }, moveTime + timePerBeat + this.judgements[this.judgements.length - 1].time);
            return;
        }
        for (const laneName in actualChart) {
            const lane = actualChart[laneName];
            const noteChar = lane[index];
            if (noteChar in this.notes) {
                const note = this.notes[noteChar](this.expectedTime.getTime(), {
                    lane,
                    index,
                    timePerBeat
                });
                note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio);
                this.createdNotes[laneName].push(note);
                setTimeout(() => {
                    if (this.createdNotes[laneName].includes(note)) {
                        this.createdNotes[laneName].shift();
                    }
                    if (!note.hasJudged) {
                        note.hasJudged = true;
                        this.setJudge(Judgement.miss, note);
                    }
                }, judgeTime + worstJudgement.time);
                this.event.load(this, note);
            }
        }
        beat++;
        setTimeout(() => {
            this.loadNote(actualChart, timePerBeat, startIndex, beat);
        }, timePerBeat * beat - this.expectedTime.getTime());
    }
    play(song, mode, index = 0) {
        if (!(mode in song.chart))
            throw new Error(`there is no mode '${mode}' in '${song.info.title}'`);
        const moveTime = song.info.timePerBeat * this.laneSizeRatio;
        const judgeTime = moveTime * (1 - this.judgementPosition);
        const actualChart = this.getActualChart(song, mode);
        this.initJudge();
        this.setKeyBind(actualChart);
        this.scorePerNote = this.maxScore / this.countNote(actualChart);
        this.expectedTime = new Timer();
        this.actualTime = new Timer(judgeTime);
        this.music = new Audio(song.info.music);
        this.music.volume = song.info.volume;
        this.music.currentTime = (index * song.info.timePerBeat + song.info.startFrom) / 1000;
        if (this.DOM.background)
            this.DOM.background.style.backgroundImage = `url('${song.info.background}')`;
        setTimeout(() => {
            this.loadNote(actualChart, song.info.timePerBeat, index);
        }, 0);
        setTimeout(() => {
            this.music.play();
        }, judgeTime + this.delay + song.info.delay - this.expectedTime.getTime());
        this.event.play(this, song, mode);
    }
    // #endregion
    constructor({ 
    // must be specified
    DOM = {}, keybind = {}, sizePerBeat = '100px', laneSizeRatio = 8, 
    // additional options
    notes = {
        n: (expectedTime) => new Tap(expectedTime),
        l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData),
        d: (expectedTime) => new Drag(expectedTime),
        f: (expectedTime) => new Flick(expectedTime),
        x: (expectedTime, additionalData) => new HoldFlick(expectedTime, additionalData)
    }, judgements = [
        new Judgement('perfect', 40, 1, true),
        new Judgement('great', 80, 0.75, true),
        new Judgement('good', 100, 0.5, true),
        new Judgement('bad', 200, 0.25, false)
    ], maxScore = 100000, delay = 0, judgementPosition = 0, event = {} } = {}) {
        // must be specified
        this.DOM = DOM;
        this.keybind = keybind;
        if (typeof sizePerBeat === 'number')
            sizePerBeat = sizePerBeat + 'px';
        this.sizePerBeat = sizePerBeat;
        this.#laneSizeRatio = laneSizeRatio;
        this.laneSizeRatio = laneSizeRatio;
        // additional options
        this.notes = notes;
        this.judgements = judgements.sort((j1, j2) => j1.time - j2.time);
        this.maxScore = maxScore;
        this.delay = delay;
        if (judgementPosition < 0 || judgementPosition > 1)
            throw new Error('The value of judgementPosition must be between 0 and 1.');
        this.judgementPosition = judgementPosition;
        this.event = {
            input: {},
            play: (game, song, mode) => {
                console.log(`${song.info.title} ${mode} start`);
            },
            load: () => { },
            judge: () => {
                this.sendJudgeToDOM();
            },
            end: (game, judgementData) => {
                console.log(JSON.stringify(judgementData));
            },
            ...event
        };
    }
}
// #endregion
// export {
//     Judgement,
//     Note, Normal, Long,
//     Tap, Hold, Drag, Flick, HoldFlick,
//     Song, Game
// }
