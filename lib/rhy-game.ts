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
                this.isDeleted = true
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

    public constructor(initTime = new Date().getTime()) {
        this.initTime = initTime
    }
}

// #endregion

// #region game
type DOM = Record<string, HTMLBodyElement>
// eslint-disable-next-line no-unused-vars
type Notes = Record<string, (expectedTime: number, additionalData: AdditionalData) => Note>
type Judgements = Judgement[]

interface GameParams {
    DOM?: DOM
    notes?: Notes
    judgements?: Judgements
    maxScore?: number
    delay?: number
    sizePerBeat?: number | string
    laneSizeRatio?: number
}

class Game {
    public DOM: DOM
    public notes: Notes
    public judgements: Judgements
    public maxScore: number
    public delay: number
    public sizePerBeat: string
    #laneSizeRatio: number

    private createdNotes: Record<string, Note[]> = {}
    private judgementData: Record<string, number> = {}

    public set laneSizeRatio(ratio: number) {
        this.#laneSizeRatio = ratio
        document.documentElement.style.setProperty('--lane-size', `calc(${this.sizePerBeat} * ${ratio})`)
    }

    public get laneSizeRatio() {
        return this.#laneSizeRatio
    }

    private loadNote(song: Song, mode: string) {
        if (!(mode in song.chart)) {
            throw new Error(`there is no mode ${mode} in the song ${song.info.title}`)
        }
        if (song.chart[mode].length === 0) {
            throw new Error(`there is no information in the mode ${mode} of the song ${song.info.title}`)
        }

        const chart: Record<string, string> = {}
        for (const group of song.chart[mode]) {
            for (const laneName in group) {
                if (!(laneName in this.DOM)) continue
                if (! chart[laneName]) chart[laneName] = ''
                chart[laneName] += group[laneName].replace(/\|/g, '')
                this.createdNotes[laneName] = []
            }
        }

        let index = 0
        const moveTime = song.info.timePerBeat * this.laneSizeRatio
        const expected = new Timer()
        setInterval(() => {
            for (const laneName in chart) {
                const lane = chart[laneName]
                if (index === lane.length) return

                const noteChar = lane[index]
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](expected.getTime(), {
                        lane,
                        index,
                        timePerBeat: song.info.timePerBeat
                    })
                    note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio)
                    this.createdNotes[laneName].push(note)
                }
            }
            index++
        }, song.info.timePerBeat)
    }

    public play(song: Song, mode: string) {
        const music = new Audio(song.info.music)
        const moveTime = song.info.timePerBeat * this.laneSizeRatio
        this.initJudge()

        setTimeout(() => {
            this.loadNote(song, mode)
        }, 0)
        setTimeout(() => {
            music.play()
        }, moveTime + this.delay)

        console.log(`${song.info.title} start`)
    }

    private initJudge() {
        this.judgementData = {
            score: 0,
            combo: 0
        }

        for (const judgement of this.judgements) {
            this.judgementData[judgement.name] = 0
        }

        this.judgementData.miss = 0
    }

    private setJudge(judgement: Judgement) {
        const data = this.judgementData
        data[judgement.name]++
        if (judgement.isCombo) data.combo++
        else data.combo = 0

    }

    public judgeLane(laneName: string, actualTime: number) {
        if (this.createdNotes[laneName].length === 0) return
        const note = this.createdNotes[laneName][0]
        // check missed note
        if (note.isDeleted) {
            this.createdNotes[laneName].shift()
            this.judgeLane(laneName, actualTime)
            return
        }

        const judgement = note.judge(this.judgements, actualTime)
        if (judgement === 'none') return

        this.setJudge(judgement)
        this.createdNotes[laneName].shift()
    }

    public constructor({
        DOM = {},
        notes = {
            n: (expectedTime) => new Tap(expectedTime),
            l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData),
            d: (expectedTime) => new Drag(expectedTime),
            f: (expectedTime) => new Flick(expectedTime),
            x: (expectedTime, additionalData) => new HoldFlick(expectedTime, additionalData)
        },
        judgements = [
            new Judgement('perfect', 40, true),
            new Judgement('great', 100, true),
            new Judgement('great', 100, true),
            new Judgement('bad', 500, false)
        ],
        maxScore = 100000,
        delay = 0,
        sizePerBeat = '100px',
        laneSizeRatio = 8
    }: GameParams = {}) {
        this.DOM = DOM
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