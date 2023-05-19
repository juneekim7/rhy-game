class Judgement {
    public static miss = new Judgement('miss', 0, false)

    public readonly name: string
    public readonly time: number
    public readonly isCombo: boolean

    public constructor(name: string, time: number, isCombo = true) {
        if (time < 0) throw new Error('judgement time must be not negative')
        this.name = name
        this.time = time
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

abstract class Note {
    public expectedTime

    public classNames
    public moveAnimation
    public fadeAnimation
    public timingFunction
    public sizeRatio

    public isDeleted

    public createDOM(laneDOM: HTMLBodyElement, moveTime: number, sizePerBeat: string, laneSizeRatio: number) {
        if (this.isDeleted || this.sizeRatio === 0) return

        const noteDOM = document.createElement('div')
        for (const className of this.classNames) {
            const currentClass = noteDOM.getAttribute('class') ?? ''
            noteDOM.setAttribute('class', currentClass + ' ' + className)
        }
        noteDOM.style.setProperty('--size', `calc(${sizePerBeat} * ${this.sizeRatio})`)
        noteDOM.style.animation = `${moveTime}ms ${this.timingFunction} ${this.moveAnimation}`

        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `${moveTime / laneSizeRatio * this.sizeRatio}ms ${this.timingFunction} ${this.fadeAnimation}`
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove()
            })
        })

        laneDOM.appendChild(noteDOM)
    }

    public judge(judgements: Judgement[], actualTime: number) {
        if (this.isDeleted) return 'none'

        const diffTime = Math.abs(actualTime - this.expectedTime)
        for (const judgement of judgements) {
            if (diffTime < judgement.time) {
                this.isDeleted = true
                return judgement
            }
        }

        if (actualTime < this.expectedTime) return 'none'
        this.isDeleted = true
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
        this.isDeleted = false

        this.classNames = classNames
        this.moveAnimation = moveAnimation
        this.fadeAnimation = fadeAnimation
        this.timingFunction = timingFunction
        this.sizeRatio = sizeRatio
    }
}

// #region basic note
class Normal extends Note {
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
    public classNames = ['note', 'long']
    public sizeRatio = 1

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

        const { lane, index } = longRequiredData

        const noteChar = lane[index]
        let length = 1
        if (index > 0 && lane[index - 1] === noteChar) {
            this.isDeleted = true
            return
        }
        else while (lane[index + length] === noteChar) length++
        this.sizeRatio = length
    }
}
// #endregion

// #region basic mobile note
class Tap extends Normal {
    public constructor(
        expectedTime: number,
        {
            classNames = ['note', 'normal', 'tap'],
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
    }
}
// #endregion

// #region advanced note
class Drag extends Tap {
    public constructor(
        expectedTime: number,
        {
            classNames = ['note', 'normal', 'tap', 'drag'],
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

class Flick extends Tap {
    public constructor(
        expectedTime: number,
        {
            classNames = ['note', 'normal', 'tap', 'flick'],
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

class HoldFlick extends Hold {
    public constructor(
        expectedTime: number,
        longRequiredData: LongRequiredData,
        {
            classNames = ['note', 'long', 'hold', 'hold-flick'],
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
    }
}
// #endregion

type AdditionalData = LongRequiredData

// #endregion

// #region song
class Info {
    public readonly music: string
    public readonly title: string
    public readonly artist: string
    public readonly chorus: number

    public readonly difficulty: Record<string, number>
    public readonly bpm: number
    public readonly split: number
    public readonly delay: number

    public readonly cover: string
    public readonly background: string

    public get timePerBeat() {
        return 240000 / this.bpm / this.split
    }

    public constructor(info: Info) {
        this.music = info.music
        this.title = info.title
        this.artist = info.artist
        this.chorus = info.chorus

        this.difficulty = info.difficulty
        this.bpm = info.bpm
        if (info.split) this.split = info.split
        else this.split = 16
        this.split = info.split
        if (info.delay) this.delay = info.delay
        else this.delay = 0

        this.cover = info.cover
        this.background = info.background
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
// eslint-disable-next-line no-unused-vars
type Notes = Record<string, (expectedTime: number, additionalData: AdditionalData) => Note>
type Judgements = Judgement[]

interface GameParams {
    DOM?: DOM
    keybind?: Keybind
    notes?: Notes
    judgements?: Judgements
    maxScore?: number
    delay?: number
    sizePerBeat?: number | string
    laneSizeRatio?: number
}

interface JudgementData {
    score: number
    combo: number
    lastJudgement: string
    judgements: {
        [judgementName: string]: number
    }
}

type ActualChart = Record<string, string>

class Game {
    public DOM: DOM
    public keybind: Keybind
    public notes: Notes
    public judgements: Judgements
    public maxScore: number
    public delay: number
    public sizePerBeat: string
    #laneSizeRatio: number

    private expectedTime: Timer = new Timer()
    private actualTime: Timer = new Timer()

    private createdNotes: Record<string, Note[]> = {}
    private isPressed: Record<string, boolean> = {}
    private judgementData: JudgementData = {
        score: 0,
        combo: 0,
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
    private initJudge() {
        this.judgementData = {
            score: 0,
            combo: 0,
            lastJudgement: 'none',
            judgements: {}
        }

        const data = this.judgementData
        for (const judgement of this.judgements) {
            data.judgements[judgement.name] = 0
        }
        data.judgements.miss = 0

        this.sendJudgeToDOM()
    }

    private sendJudgeToDOM() {
        const DOM = this.DOM
        const data = this.judgementData

        if (DOM.score) {
            DOM.score.textContent = data.score.toString()
                .padStart(this.maxScore.toString().length, '0')
        }
        if (DOM.judgement) {
            DOM.judgement.textContent = data.lastJudgement
        }
        if (DOM.combo) {
            DOM.combo.textContent = data.combo.toString()
        }
    }

    private setJudge(judgement: Judgement) {
        const data = this.judgementData
        data.lastJudgement = judgement.name
        data.judgements[judgement.name]++
        if (judgement.isCombo) data.combo++
        else data.combo = 0

        this.sendJudgeToDOM()
    }

    public judgeLane(laneName: string, actualTime = this.actualTime.getTime()) {
        if (! this.createdNotes[laneName]) throw new Error(`there is no lane ${laneName}`)
        if (this.createdNotes[laneName].length === 0) return
        const note = this.createdNotes[laneName][0]
        // check missed note
        const judgement = note.judge(this.judgements, actualTime)
        if (judgement === 'none') return

        this.setJudge(judgement)
        this.createdNotes[laneName].shift()
        if (judgement === Judgement.miss) this.judgeLane(laneName, actualTime)
    }
    // #endregion

    private getActualChart(song: Song, mode: string) {
        if (!(mode in song.chart)) {
            throw new Error(`there is no mode ${mode} in the song ${song.info.title}`)
        }
        if (song.chart[mode].length === 0) {
            throw new Error(`there is no information in the mode ${mode} of the song ${song.info.title}`)
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

        return actualChart
    }

    private setKeyBind(actualChart: ActualChart) {
        for (const laneName in actualChart) {
            this.isPressed[laneName] = false

            window.addEventListener('keydown', (event) => {
                if (!(event.key in this.keybind) || this.isPressed[event.key]) return

                this.isPressed[event.key] = true
                this.judgeLane(this.keybind[event.key])
            })

            window.addEventListener('keyup', (event) => {
                if (!(event.key in this.keybind)) return

                this.isPressed[event.key] = false
                this.judgeLane(this.keybind[event.key])
            })
        }
    }

    private loadNote(actualChart: ActualChart, timePerBeat: number) {
        let index = 0
        const moveTime = timePerBeat * this.laneSizeRatio
        setInterval(() => {
            for (const laneName in actualChart) {
                const lane = actualChart[laneName]
                if (index === lane.length) return

                const noteChar = lane[index]
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](this.expectedTime.getTime(), {
                        lane,
                        index,
                        timePerBeat: timePerBeat
                    })
                    note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio)

                    this.createdNotes[laneName].push(note)
                    setTimeout(() => {
                        if (this.createdNotes[laneName].includes(note)) {
                            this.setJudge(Judgement.miss)
                            this.createdNotes[laneName].shift()
                        }
                    }, moveTime + this.judgements[this.judgements.length - 1].time)
                }
            }
            index++
        }, timePerBeat)
    }

    public play(song: Song, mode: string) {
        const music = new Audio(song.info.music)
        const moveTime = song.info.timePerBeat * this.laneSizeRatio
        this.initJudge()
        this.setKeyBind(this.getActualChart(song, mode))
        this.expectedTime = new Timer()
        this.actualTime = new Timer(moveTime)

        setTimeout(() => {
            this.loadNote(this.getActualChart(song, mode), song.info.timePerBeat)
        }, 0)
        setTimeout(() => {
            music.play()
        }, moveTime + this.delay)

        console.log(`${song.info.title} start`)
    }

    public constructor({
        DOM = {},
        keybind = {},
        notes = {
            n: (expectedTime) => new Tap(expectedTime),
            l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData),
            d: (expectedTime) => new Drag(expectedTime),
            f: (expectedTime) => new Flick(expectedTime),
            x: (expectedTime, additionalData) => new HoldFlick(expectedTime, additionalData)
        },
        judgements = [
            new Judgement('perfect', 40, true),
            new Judgement('great', 80, true),
            new Judgement('good', 100, true),
            new Judgement('bad', 200, false)
        ],
        maxScore = 100000,
        delay = 0,
        sizePerBeat = '100px',
        laneSizeRatio = 8
    }: GameParams = {}) {
        this.DOM = DOM
        this.keybind = keybind
        this.notes = notes
        this.judgements = judgements.sort((j1, j2) => j1.time - j2.time)
        this.maxScore = maxScore
        this.delay = delay
        if (typeof sizePerBeat === 'number') sizePerBeat = sizePerBeat + 'px'
        this.sizePerBeat = sizePerBeat
        this.#laneSizeRatio = laneSizeRatio
        this.laneSizeRatio = laneSizeRatio
    }
}
// #endregion

// export {
//     Judgement,
//     Note, Normal, Long,
//     Tap, Hold, Drag, Flick, HoldFlick,
//     Song, Game
// }