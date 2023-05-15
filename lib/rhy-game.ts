class Judgement {
    public readonly name: string
    public readonly time: number
    public readonly isCombo: boolean

    public constructor(name: string, time: number, isCombo = true) {
        this.name = name
        this.time = time
        this.isCombo = isCombo
    }
}

// #region note
interface NoteParams {
    classNames?: string[]
    moveAnimation?: string
    fadeAnimation?: string
    timingFunction?: string
    sizeRatio?: number
}

abstract class Note {
    public classNames
    public moveAnimation
    public fadeAnimation
    public timingFunction
    public sizeRatio

    public createDOM(laneDOM: HTMLBodyElement, moveTime: number, sizePerBeat: string, laneSizeRatio: number) {
        if (this.sizeRatio === 0) return

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

    public constructor(lane: string, index: number, {
        classNames = ['note'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        this.classNames = classNames
        this.moveAnimation = moveAnimation
        this.fadeAnimation = fadeAnimation
        this.timingFunction = timingFunction
        this.sizeRatio = sizeRatio
    }
}

// #region basic note
class Normal extends Note {
    public constructor(lane: string, index: number, {
        classNames = ['note', 'normal'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}

class Long extends Note {
    public classNames = ['note', 'long']
    public sizeRatio = 1

    public constructor(lane: string, index: number, {
        classNames = ['note', 'long'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })

        const noteChar = lane[index]
        let length = 1
        if (index > 0 && lane[index - 1] === noteChar) length = 0
        else while (lane[index + length] === noteChar) length++
        this.sizeRatio = length
    }
}
// #endregion

// #region basic mobile note
class Tap extends Normal {
    public constructor(lane: string, index: number, {
        classNames = ['note', 'normal', 'tap'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}

class Hold extends Long {
    public constructor(lane: string, index: number, {
        classNames = ['note', 'long', 'hold'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}
// #endregion

// #region advanced note
class Drag extends Tap {
    public constructor(lane: string, index: number, {
        classNames = ['note', 'normal', 'tap', 'drag'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}

class Flick extends Tap {
    public constructor(lane: string, index: number, {
        classNames = ['note', 'normal', 'tap', 'flick'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}

class HoldFlick extends Hold {
    public constructor(lane: string, index: number, {
        classNames = ['note', 'long', 'hold', 'hold-flick'],
        moveAnimation = 'move',
        fadeAnimation = 'fade',
        timingFunction = 'linear',
        sizeRatio = 0.1
    }: NoteParams = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}
// #endregion
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
        this.split = info.split
        this.delay = info.delay

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

// #region game
type DOM = Record<string, HTMLBodyElement>
// eslint-disable-next-line no-unused-vars
type Notes = Record<string, (lane: string, index: number) => Note>
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
            }
        }

        let index = 0
        const moveTime = song.info.timePerBeat * this.laneSizeRatio
        console.log(song.info.timePerBeat)
        setInterval(() => {
            for (const laneName in chart) {
                const lane = chart[laneName]
                if (index === lane.length) return

                const noteChar = lane[index]
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar](lane, index)
                    note.createDOM(this.DOM[laneName], moveTime, this.sizePerBeat, this.laneSizeRatio)
                }
            }
            index++
        }, song.info.timePerBeat)
    }

    public play(song: Song, mode: string) {
        const music = new Audio(song.info.music)
        const moveTime = song.info.timePerBeat * this.laneSizeRatio

        setTimeout(() => {
            this.loadNote(song, mode)
        }, 0)
        setTimeout(() => {
            music.play()
        }, moveTime + this.delay)

        console.log(`${song.info.title} start`)
    }

    public constructor({
        DOM = {},
        notes = {
            n: (lane, index) => new Tap(lane, index),
            l: (lane, index) => new Hold(lane, index),
            d: (lane, index) => new Drag(lane, index),
            f: (lane, index) => new Flick(lane, index),
            x: (lane, index) => new HoldFlick(lane, index)
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
        this.judgements = judgements
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