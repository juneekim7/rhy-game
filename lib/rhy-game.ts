// Copyright (c) 2023 준이 (Junee, juneekim7)
// Released under the MIT License.

class Judgement {
    public static miss = new Judgement('miss', 0, 0, false)

    public readonly name: string
    public readonly time: number
    public readonly scoreRatio: number
    public readonly isCombo: boolean

    public constructor(name: string, time: number, scoreRatio: number, isCombo = true) {
        if ([name, time, scoreRatio, isCombo].map((arg) => typeof arg).includes('undefined')) {
            throw new Error('judgement must requires name, time, scoreRatio')
        }
        if (time < 0) throw new Error('judgement time must be not negative')
        if (scoreRatio < 0 || scoreRatio > 1) throw new Error('scoreRatio should be between in 0 to 1')
        this.name = name
        this.time = time
        this.scoreRatio = scoreRatio
        this.isCombo = isCombo
    }
}

// #region note
interface NoteDOMParams {
    classNames?: string[]
    moveAnimation?: string
    fadeAnimation?: string
    timingFunction?: string
    sizeRatio?: number
}

type EventName = 'keydown' | 'keyup' | 'touchstart' | 'touchend'

abstract class Note {
    public expectedTime

    public classNames
    public moveAnimation
    public fadeAnimation
    public timingFunction
    public sizeRatio

    public hasJudged
    public judgement: 'none' | Judgement
    public count: number

    public readonly DOM: HTMLElement

    public createDOM(laneDOM: HTMLBodyElement, moveTime: number, sizePerBeat: string, laneSizeRatio: number) {
        if (this.hasJudged) return

        for (const className of this.classNames) {
            const currentClass = this.DOM.getAttribute('class') ?? ''
            this.DOM.setAttribute('class', currentClass + ' ' + className)
        }
        this.DOM.style.setProperty('--size', `calc(${sizePerBeat} * ${this.sizeRatio})`)
        this.DOM.style.animation = `${moveTime}ms ${this.timingFunction} ${this.moveAnimation}`

        this.DOM.addEventListener('animationend', () => {
            this.DOM.style.animation = `${moveTime / laneSizeRatio * this.sizeRatio}ms ${this.timingFunction} ${this.fadeAnimation}`
            this.DOM.addEventListener('animationend', () => {
                this.DOM.remove()
            })
        })

        laneDOM.appendChild(this.DOM)
    }

    public judge(judgements: Judgement[], eventName: EventName, actualTime: number) {
        if (this.hasJudged) 'none'

        const diffTime = Math.abs(actualTime - this.expectedTime)
        for (const judgement of judgements) {
            if (diffTime < judgement.time) {
                this.hasJudged = true
                this.judgement = judgement
                return judgement
            }
        }

        if (actualTime < this.expectedTime) return 'none'
        this.hasJudged = true
        this.judgement = Judgement.miss
        return Judgement.miss
    }

    public constructor(
        expectedTime: number,
        {
            classNames = ['note'],
            moveAnimation = 'move',
            fadeAnimation = 'fade',
            timingFunction = 'linear',
            sizeRatio = 0.1
        }: NoteDOMParams = {}
    ) {
        this.expectedTime = expectedTime

        this.classNames = classNames
        this.moveAnimation = moveAnimation
        this.fadeAnimation = fadeAnimation
        this.timingFunction = timingFunction
        this.sizeRatio = sizeRatio

        this.hasJudged = false
        this.judgement = 'none'
        this.count = 1

        this.DOM = document.createElement('div')
    }
}

// #region basic note
class Normal extends Note {
    public judge(judgements: Judgement[], eventName: EventName, actualTime: number) {
        if (eventName === 'keydown') return super.judge(judgements, eventName, actualTime)
        else return 'none'
    }

    public constructor(
        expectedTime: number,
        {
            classNames = ['note', 'normal'],
            moveAnimation = 'move',
            fadeAnimation = 'fade',
            timingFunction = 'linear',
            sizeRatio = 0.1
        }: NoteDOMParams = {}
    ) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}

interface LongRequiredData {
    lane: string,
    index: number,
    timePerBeat: number
}

class Long extends Note {
    public createDOM(laneDOM: HTMLBodyElement, moveTime: number, sizePerBeat: string, laneSizeRatio: number): void {
        if (this.sizeRatio === 1) return
        super.createDOM(laneDOM, moveTime, sizePerBeat, laneSizeRatio)
    }

    public judge(judgements: Judgement[], eventName: EventName, actualTime: number) {
        if (eventName === 'keydown' && !this.hasJudged) return super.judge(judgements, eventName, actualTime)
        else if (this.hasJudged) return Judgement.miss
        else return 'none'
    }

    public constructor(
        expectedTime: number,
        longRequiredData: LongRequiredData,
        {
            classNames = ['note', 'long'],
            moveAnimation = 'move',
            fadeAnimation = 'fade',
            timingFunction = 'linear',
            sizeRatio = 1
        }: NoteDOMParams = {}
    ) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })

        const { lane, index, timePerBeat } = longRequiredData
        const noteChar = lane[index]
        let length = 1

        while (lane[index + length] === noteChar) length++
        this.sizeRatio = length
        this.count = 1

        if (index > 0 && lane[index - 1] === noteChar) {
            // 중간 노트
            if (length !== 1) {
                this.hasJudged = true
                this.count = 0
                this.judge = () => Judgement.miss
            }
            // 끝 노트
            else {
                this.expectedTime += timePerBeat * length
                this.judge = (judgements: Judgement[], eventName: EventName, actualTime: number) => {
                    if (eventName === 'keyup' && !this.hasJudged) return super.judge(judgements, eventName, actualTime)
                    else if (this.hasJudged) {
                        return 'none'
                    }
                    else return Judgement.miss
                }
            }
        }
        else if (length === 1) throw new Error('long notes length should be at least 2')
        // 시작 노트
    }
}
// #endregion

// #region basic mobile note
class Tap extends Normal {
    public judge(judgements: Judgement[], eventName: EventName, actualTime: number) {
        if (eventName === 'touchstart') return Note.prototype.judge.call(this, judgements, eventName, actualTime)
        else return super.judge(judgements, eventName, actualTime)
    }

    public constructor(
        expectedTime: number,
        {
            classNames = ['note', 'normal'],
            moveAnimation = 'move',
            fadeAnimation = 'fade',
            timingFunction = 'linear',
            sizeRatio = 0.1
        }: NoteDOMParams = {}
    ) {
        super(expectedTime, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}

class Hold extends Long {
    public judge(judgements: Judgement[], eventName: EventName, actualTime: number) {
        if (['touchstart', 'keydown'].includes(eventName) && !this.hasJudged) {
            return Note.prototype.judge.call(this, judgements, eventName, actualTime)
        }
        else if (this.hasJudged) return Judgement.miss
        else return 'none'
    }

    public constructor(
        expectedTime: number,
        longRequiredData: LongRequiredData,
        {
            classNames = ['note', 'long', 'hold'],
            moveAnimation = 'move',
            fadeAnimation = 'fade',
            timingFunction = 'linear',
            sizeRatio = 0.1
        }: NoteDOMParams = {}
    ) {
        super(
            expectedTime,
            longRequiredData,
            {
                classNames,
                moveAnimation,
                fadeAnimation,
                timingFunction,
                sizeRatio
            }
        )

        const { lane, index } = longRequiredData
        const noteChar = lane[index]
        // 끝 노트
        if (index + 1 < lane.length && lane[index + 1] !== noteChar) {
            this.judge = (judgements: Judgement[], eventName: EventName, actualTime: number) => {
                if (['touchend', 'keyup'].includes(eventName) && !this.hasJudged) {
                    return Note.prototype.judge.call(this, judgements, eventName, actualTime)
                }
                else if (this.hasJudged) {
                    return 'none'
                }
                else return Judgement.miss
            }
        }
    }
}
// #endregion

type AdditionalData = {
    laneName: string,
    lane: string,
    index: number,
    timePerBeat: number
}
// #endregion

// #region song
class Info {
    public readonly music: string
    public readonly title: string
    public readonly artist: string

    public readonly difficulty: Record<string, number>
    public readonly volume: number
    public readonly bpm: number
    public readonly split: number
    public readonly delay: number
    public readonly startFrom: number

    public readonly cover: string
    public readonly background: string

    public readonly design: object

    public get timePerBeat() {
        return 240000 / this.bpm / this.split
    }

    public constructor(info: Info) {
        this.music = info.music
        this.title = info.title
        this.artist = info.artist

        this.difficulty = info.difficulty
        if (info.volume) {
            if (info.volume < 0 || info.volume > 1) throw new Error('volume should be between in 0 to 1')
            this.volume = info.volume
        }
        else this.volume = 1
        this.bpm = info.bpm
        if (info.split) this.split = info.split
        else this.split = 16
        if (info.delay) this.delay = info.delay
        else this.delay = 0
        if (info.startFrom) this.startFrom = info.startFrom
        else this.startFrom = 0

        this.cover = info.cover
        this.background = info.background

        this.design = info.design
    }
}

interface Chart {
    [mode: string]: Record<string, string>[]
}

interface SongParams {
    info: Info,
    chart: Chart
}

class Song {
    public readonly info: Info
    public readonly chart: {
        [mode: string]: Record<string, string>[]
    }

    public constructor({ info, chart }: SongParams) {
        this.info = new Info(info),
        this.chart = chart
    }
}
// #endregion

// #region timer
class Timer {
    private initTime: number

    public getTime() {
        return new Date().getTime() - this.initTime
    }

    public constructor(minusTime = 0) {
        this.initTime = new Date().getTime() + minusTime
    }
}
// #endregion

// #region game
type DOM = Record<string, HTMLBodyElement>
type Keybind = Record<string, string>
type Notes = Record<string, (expectedTime: number, additionalData: AdditionalData) => Note>

interface JudgementData {
    score: number
    combo: number
    maxCombo: number
    lastJudgement: string
    judgements: {
        [judgementName: string]: number
    }
}

interface GameEventParams {
    input?: {
        'keydown'?: (game: Game, laneName: string) => void
        'keyup'?: (game: Game, laneName: string) => void
    },
    play?: (game: Game, song: Song, mode: string) => void
    load?: (game: Game, note: Note) => void
    judge?: (game: Game, judgementData: JudgementData, judgedNote: Note | null) => void
    end?: (game: Game, judgementData: JudgementData) => void
}

interface GameEvent extends GameEventParams {
    input: {
        'keydown'?: (game: Game, laneName: string) => void
        'keyup'?: (game: Game, laneName: string) => void
    },
    play: (game: Game, song: Song, mode: string) => void
    load: (game: Game, note: Note) => void
    judge: (game: Game, judgementData: JudgementData, judgedNote: Note | null) => void
    end: (game: Game, judgementData: JudgementData) => void
}

type ActualChart = Record<string, string>

interface GameParams {
    DOM?: DOM
    keybind?: Keybind
    notes?: Notes
    judgements?: Judgement[]
    maxScore?: number
    delay?: number
    sizePerBeat?: number | string
    laneSizeRatio?: number
    judgementPosition?: number
    event?: GameEventParams
}

class Game {
    public DOM: DOM
    public keybind: Keybind
    public notes: Notes
    public judgements: Judgement[]
    public maxScore: number
    public delay: number
    public sizePerBeat: string
    #laneSizeRatio: number
    public judgementPosition: number
    public event: GameEvent

    private expectedTime: Timer = new Timer()
    private actualTime: Timer = new Timer()

    private scorePerNote = 0
    private music: HTMLAudioElement = new Audio()
    private readonly createdNotes: Record<string, Note[]> = {}
    public readonly isPressed: Record<string, boolean> = {}
    public readonly judgementData: JudgementData = {
        score: 0,
        combo: 0,
        maxCombo: 0,
        lastJudgement: 'none',
        judgements: {}
    }

    public set laneSizeRatio(ratio: number) {
        this.#laneSizeRatio = ratio
        document.documentElement.style.setProperty('--lane-size', `calc(${this.sizePerBeat} * ${ratio})`)
    }

    public get laneSizeRatio() {
        return this.#laneSizeRatio
    }

    // #region judge
    private sendJudgeToDOM() {
        const DOM = this.DOM
        const data = this.judgementData

        if (DOM.score) {
            DOM.score.textContent = Math.round(data.score).toString()
                .padStart(this.maxScore.toString().length, '0')
        }
        if (DOM.judgement) {
            DOM.judgement.textContent = data.lastJudgement
        }
        if (DOM.combo) {
            DOM.combo.textContent = data.combo.toString()
        }
    }

    private initJudge() {
        const data = this.judgementData

        data.score = 0
        data.combo = 0
        data.maxCombo = 0
        data.lastJudgement = 'none'

        for (const judgement of this.judgements) {
            data.judgements[judgement.name] = 0
        }
        data.judgements.miss = 0

        this.event.judge(this, data, null)
    }

    private setJudge(judgement: Judgement, judgedNote: Note | null) {
        const data = this.judgementData
        data.judgements[judgement.name]++
        data.score += this.scorePerNote * judgement.scoreRatio
        if (judgement.isCombo) {
            data.combo++
            data.maxCombo = Math.max(data.combo, data.maxCombo)
        }
        else data.combo = 0
        data.lastJudgement = judgement.name

        this.event.judge(this, data, judgedNote)
    }

    public judgeLane(laneName: string, eventName: EventName, actualTime = this.actualTime.getTime()) {
        if (!this.createdNotes[laneName]) throw new Error(`there is no lane '${laneName}'`)
        if (this.createdNotes[laneName].length === 0) return

        const note = this.createdNotes[laneName][0]
        if (note.hasJudged) {
            this.createdNotes[laneName].shift()
            this.judgeLane(laneName, eventName, actualTime)
            return
        }

        const judgement = note.judge(this.judgements, eventName, actualTime)
        if (judgement === 'none') return

        this.setJudge(judgement, this.createdNotes[laneName][0])
        this.createdNotes[laneName].shift()
    }
    // #endregion

    // #region play
    private getActualChart(song: Song, mode: string) {
        if (!(mode in song.chart)) {
            throw new Error(`There is no mode '${mode}' in the song '${song.info.title}'`)
        }
        if (song.chart[mode].length === 0) {
            throw new Error(`There is no information in the mode '${mode}' of the song '${song.info.title}'`)
        }

        const actualChart: ActualChart = {}
        for (const group of song.chart[mode]) {
            for (const laneName in group) {
                if (!(laneName in this.DOM)) continue
                if (! actualChart[laneName]) actualChart[laneName] = ''
                actualChart[laneName] += group[laneName].replace(/\|/g, '')
                this.createdNotes[laneName] = []
            }
        }

        if (Object.keys(actualChart).length === 0) {
            throw new Error(`There is no lane of the song '${song.info.title}' in mode '${mode}' that matches to DOM`)
        }
        return actualChart
    }

    private fadeMusic() {
        if (this.music.volume < 0.1) {
            this.music.pause()
            return
        }

        this.music.volume -= 0.03
        setTimeout(() => {
            this.fadeMusic()
        }, 100)
    }

    private countNote(actualChart: ActualChart) {
        let count = 0

        for (const laneName of Object.keys(actualChart)) {
            const lane = actualChart[laneName]
            for (let index = 0; index < lane.length; index++) {
                const noteChar = lane[index]
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](this.expectedTime.getTime(), {
                        laneName,
                        lane,
                        index,
                        timePerBeat: 0
                    })
                    count += note.count
                }
            }
        }

        return count
    }

    private loadNote(actualChart: ActualChart, timePerBeat: number, startIndex = 0, beat = 0) {
        const moveTime = timePerBeat * this.laneSizeRatio
        const judgeTime = moveTime * (1 - this.judgementPosition)
        const worstJudgement = this.judgements.at(-1)
        const index = startIndex + beat
        if (worstJudgement === undefined) throw new Error('There should be at least one judgement.')

        if (index === Object.values(actualChart)[0].length) {
            this.fadeMusic()
            setTimeout(() => {
                this.event.end(this, this.judgementData)
            }, moveTime + timePerBeat + this.judgements[this.judgements.length - 1].time)
            return
        }

        for (const laneName in actualChart) {
            const lane = actualChart[laneName]

            const noteChar = lane[index]
            if (noteChar in this.notes) {
                const note = this.notes[noteChar](this.expectedTime.getTime(), {
                    laneName,
                    lane,
                    index,
                    timePerBeat
                })
                note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio)
                this.createdNotes[laneName].push(note)

                setTimeout(() => {
                    if (this.createdNotes[laneName].includes(note)) {
                        this.createdNotes[laneName].shift()
                    }
                    if (!note.hasJudged) {
                        note.hasJudged = true
                        this.setJudge(Judgement.miss, note)
                    }
                }, judgeTime + worstJudgement.time)

                this.event.load(this, note)
            }
        }

        beat++
        setTimeout(() => {
            this.loadNote(actualChart, timePerBeat, startIndex, beat)
        }, timePerBeat * beat - this.expectedTime.getTime())
    }

    // #region setting
    private setKeyBind(actualChart: ActualChart) {
        for (const laneName in actualChart) {
            this.isPressed[laneName] = false
        }

        window.addEventListener('keydown', (event) => {
            if (!(event.key in this.keybind) || this.isPressed[event.key]) return

            this.isPressed[event.key] = true
            this.judgeLane(this.keybind[event.key], 'keydown')

            if (this.event.input['keydown']) {
                this.event.input['keydown'](this, this.keybind[event.key])
            }
        })

        window.addEventListener('keyup', (event) => {
            if (!(event.key in this.keybind)) return

            this.isPressed[event.key] = false
            this.judgeLane(this.keybind[event.key], 'keyup')

            if (this.event.input['keyup']) {
                this.event.input['keyup'](this, this.keybind[event.key])
            }
        })
    }

    private setTouch(actualChart: ActualChart) {
        for (const laneName in actualChart) {
            if (!(laneName in this.DOM)) continue

            this.DOM[laneName].addEventListener('touchstart', () => {
                this.judgeLane(laneName, 'touchstart')
            })
            this.DOM[laneName].addEventListener('touchend', () => {
                this.judgeLane(laneName, 'touchend')
            })
        }
    }

    private setEvent(actualChart: ActualChart) {
        this.setKeyBind(actualChart)
        this.setTouch(actualChart)
    }
    // #endregion

    public play(song: Song, mode: string, index = 0) {
        if (!(mode in song.chart)) throw new Error(`there is no mode '${mode}' in '${song.info.title}'`)

        const moveTime = song.info.timePerBeat * this.laneSizeRatio
        const judgeTime = moveTime * (1 - this.judgementPosition)
        const actualChart = this.getActualChart(song, mode)
        this.initJudge()
        this.setEvent(actualChart)
        this.scorePerNote = this.maxScore / this.countNote(actualChart)

        this.expectedTime = new Timer()
        this.actualTime = new Timer(judgeTime)

        this.music = new Audio(song.info.music)
        this.music.volume = song.info.volume
        this.music.currentTime = (index * song.info.timePerBeat + song.info.startFrom) / 1000

        if (this.DOM.background) this.DOM.background.style.backgroundImage = `url('${song.info.background}')`

        setTimeout(() => {
            this.loadNote(actualChart, song.info.timePerBeat, index)
        }, 0)
        setTimeout(() => {
            this.music.play()
        }, judgeTime + this.delay + song.info.delay - this.expectedTime.getTime())

        this.event.play(this, song, mode)
    }
    // #endregion

    public constructor({
        // must be specified
        DOM = {},
        keybind = {},
        sizePerBeat = '100px',
        laneSizeRatio = 8,

        // additional options
        notes = {
            n: (expectedTime) => new Tap(expectedTime),
            l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData)
        },
        judgements = [
            new Judgement('perfect', 40, 1, true),
            new Judgement('great', 80, 0.75, true),
            new Judgement('good', 100, 0.5, true),
            new Judgement('bad', 200, 0.25, false)
        ],
        maxScore = 100000,
        delay = 0,
        judgementPosition = 0,
        event = {}
    }: GameParams = {}) {
        // must be specified
        this.DOM = DOM
        this.keybind = keybind
        if (typeof sizePerBeat === 'number') sizePerBeat = sizePerBeat + 'px'
        this.sizePerBeat = sizePerBeat
        this.#laneSizeRatio = laneSizeRatio
        this.laneSizeRatio = laneSizeRatio

        // additional options
        this.notes = notes
        this.judgements = judgements.sort((j1, j2) => j1.time - j2.time)
        this.maxScore = maxScore
        this.delay = delay
        if (judgementPosition < 0 || judgementPosition > 1) throw new Error('The value of judgementPosition must be between 0 and 1.')
        this.judgementPosition = judgementPosition
        this.event = {
            input: {},
            play: (game, song, mode) => {
                console.log(`${song.info.title} ${mode} start`)
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            load: () => {},
            judge: () => {
                this.sendJudgeToDOM()
            },
            end: (game: Game, judgementData: JudgementData) => {
                console.log(JSON.stringify(judgementData))
            },
            ...event
        }
    }
}
// #endregion

/*
if (typeof define !== 'function' && define.amd) {
    define([], function() {
        return {
            Judgement,
            Note, Normal, Long,
            Tap, Hold,
            Song, Game
        }
    })
}

if (typeof exports !== 'undefined') {
    // eslint-disable-next-line no-undef
    exports = {
        Judgement,
        Note, Normal, Long,
        Tap, Hold,
        Song, Game
    }
}
*/