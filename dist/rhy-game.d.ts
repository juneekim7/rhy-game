declare class Judgement {
    static miss: Judgement;
    readonly name: string;
    readonly time: number;
    readonly scoreRatio: number;
    readonly isCombo: boolean;
    constructor(name: string, time: number, scoreRatio: number, isCombo?: boolean);
}
interface NoteDOMParams {
    classNames?: string[];
    moveAnimation?: string;
    fadeAnimation?: string;
    timingFunction?: string;
    sizeRatio?: number;
}
type EventName = 'keydown' | 'keyup' | 'touchstart' | 'touchend';
declare abstract class Note {
    expectedTime: number;
    classNames: string[];
    moveAnimation: string;
    fadeAnimation: string;
    timingFunction: string;
    sizeRatio: number;
    hasJudged: boolean;
    judgement: 'none' | Judgement;
    count: number;
    createDOM(laneDOM: HTMLBodyElement, moveTime: number, sizePerBeat: string, laneSizeRatio: number): void;
    judge(judgements: Judgement[], eventName: EventName, actualTime: number): Judgement | "none";
    constructor(expectedTime: number, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
declare class Normal extends Note {
    constructor(expectedTime: number, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
interface LongRequiredData {
    lane: string;
    index: number;
    timePerBeat: number;
}
declare class Long extends Note {
    createDOM(laneDOM: HTMLBodyElement, moveTime: number, sizePerBeat: string, laneSizeRatio: number): void;
    judge(judgements: Judgement[], eventName: EventName, actualTime: number): Judgement | "none";
    constructor(expectedTime: number, longRequiredData: LongRequiredData, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
declare class Tap extends Normal {
    constructor(expectedTime: number, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
declare class Hold extends Long {
    constructor(expectedTime: number, longRequiredData: LongRequiredData, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
declare class Drag extends Tap {
    constructor(expectedTime: number, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
declare class Flick extends Tap {
    constructor(expectedTime: number, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
declare class HoldFlick extends Hold {
    constructor(expectedTime: number, longRequiredData: LongRequiredData, { classNames, moveAnimation, fadeAnimation, timingFunction, sizeRatio }?: NoteDOMParams);
}
type AdditionalData = LongRequiredData;
declare class Info {
    readonly music: string;
    readonly title: string;
    readonly artist: string;
    readonly difficulty: Record<string, number>;
    readonly volume: number;
    readonly bpm: number;
    readonly split: number;
    readonly delay: number;
    readonly cover: string;
    readonly background: string;
    readonly design: object;
    get timePerBeat(): number;
    constructor(info: Info);
}
interface Chart {
    [mode: string]: Record<string, string>[];
}
interface SongParams {
    info: Info;
    chart: Chart;
}
declare class Song {
    readonly info: Info;
    readonly chart: {
        [mode: string]: Record<string, string>[];
    };
    constructor({ info, chart }: SongParams);
}
declare class Timer {
    private initTime;
    getTime(): number;
    constructor(minusTime?: number);
}
type DOM = Record<string, HTMLBodyElement>;
type Keybind = Record<string, string>;
type Notes = Record<string, (expectedTime: number, additionalData: AdditionalData) => Note>;
type Judgements = Judgement[];
interface GameParams {
    DOM?: DOM;
    keybind?: Keybind;
    notes?: Notes;
    judgements?: Judgements;
    maxScore?: number;
    delay?: number;
    sizePerBeat?: number | string;
    laneSizeRatio?: number;
    judgementVar?: object;
    update?: (judgementData: JudgementData) => void;
    end?: (judgementData: JudgementData) => void;
}
interface JudgementData {
    score: number;
    combo: number;
    maxCombo: number;
    lastJudgement: string;
    judgements: {
        [judgementName: string]: number;
    };
}
type ActualChart = Record<string, string>;
declare class Game {
    #private;
    DOM: DOM;
    keybind: Keybind;
    notes: Notes;
    judgements: Judgements;
    maxScore: number;
    delay: number;
    sizePerBeat: string;
    update: (judgementData: JudgementData) => void;
    end: (judgementData: JudgementData) => void;
    private expectedTime;
    private actualTime;
    private scorePerNote;
    private music;
    private readonly createdNotes;
    private readonly isPressed;
    readonly judgementData: JudgementData;
    set laneSizeRatio(ratio: number);
    get laneSizeRatio(): number;
    private initJudge;
    private sendJudgeToDOM;
    private setJudge;
    judgeLane(laneName: string, eventName: EventName, actualTime?: number): void;
    private getActualChart;
    private setKeyBind;
    private fadeMusic;
    private countNote;
    private loadNote;
    play(song: Song, mode: string, index?: number): void;
    constructor({ DOM, keybind, notes, judgements, maxScore, delay, sizePerBeat, laneSizeRatio, update, end }?: GameParams);
}
//# sourceMappingURL=rhy-game.d.ts.map