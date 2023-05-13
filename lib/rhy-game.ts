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
    className?: string
    moveAnimation?: string
    moveTime?: number
    fadeAnimation?: string
    fadeTime?: number
    timingFunction?: string
}

abstract class Note {
    public className = 'note'
    public moveAnimation = 'note-move'
    public moveTime = 1000
    public fadeAnimation = 'note-fade'
    public fadeTime = 100
    public timingFunction = 'linear'

    public createDOM(laneDOM: HTMLBodyElement) {
        const noteDOM = document.createElement('div')
        noteDOM.setAttribute('class', this.className)
        noteDOM.style.animation = `${this.moveTime}ms ${this.timingFunction} ${this.moveAnimation}`

        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `${this.fadeTime}ms ${this.timingFunction} ${this.fadeAnimation}`
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove()
            })
        })

        laneDOM.appendChild(noteDOM)
    }

    public constructor({
        className = undefined,
        moveAnimation = undefined,
        moveTime = undefined,
        fadeAnimation = undefined,
        fadeTime = undefined,
        timingFunction = undefined
    }: NoteParams = {}) {
        if (className) this.className = className
        if (moveAnimation) this.moveAnimation = moveAnimation
        if (moveTime) this.moveTime = moveTime
        if (fadeAnimation) this.fadeAnimation = fadeAnimation
        if (fadeTime) this.fadeTime = fadeTime
        if (timingFunction) this.timingFunction = timingFunction
    }
}

// #region basic note
class Normal extends Note {
    public className = 'normal'
    public moveAnimation = 'normal-move'
    public fadeAnimation = 'normal-fade'
}

class Long extends Note {
    public className = 'long'
    public moveAnimation = 'long-move'
    public fadeAnimation = 'long-fade'
}
// #endregion

// #region basic mobile note
class Tap extends Normal {
    public className = 'tap'
    public moveAnimation = 'tap-move'
    public fadeAnimation = 'tap-fade'
}

class Hold extends Long {
    public className = 'hold'
    public moveAnimation = 'hold-move'
    public fadeAnimation = 'hold-fade'
}
// #endregion

// #region advanced note
class Drag extends Tap {
    public className = 'drag'
    public moveAnimation = 'drag-move'
    public fadeAnimation = 'drag-fade'
}

class Flick extends Tap {
    public className = 'flick'
    public moveAnimation = 'flick-move'
    public fadeAnimation = 'flick-fade'
}

class LongFlick extends Hold {
    public className = 'long-flick'
    public moveAnimation = 'long-flick-move'
    public fadeAnimation = 'long-flick-fade'
}
// #endregion
// #endregion

// #region song
class Info {
    public readonly music: string
    public readonly title: string
    public readonly artist: string

    public readonly level: number
    public readonly bpm: number
    public readonly split: number

    public readonly cover: string
    public readonly background: string

    public constructor(info: Info) {
        this.music = info.music
        this.title = info.title
        this.artist = info.artist

        this.level = info.level
        this.bpm = info.bpm
        this.split = info.split

        this.cover = info.cover
        this.background = info.background
    }
}

interface Chart {
    [mode: string]: []
}

interface SongParams {
    info: Info,
    chart: Chart
}

class Song {
    public readonly info: Info
    public readonly chart: Chart

    public constructor({ info, chart }: SongParams) {
        this.info = info,
        this.chart = chart
    }
}
// #endregion

// #region game
type DOM = Record<string, HTMLBodyElement>
type Notes = Record<string, () => Note>
type Judgements = Judgement[]

interface GameParams {
    DOM?: DOM
    notes?: Notes
    judgements?: Judgements
    maxScore?: number
}

class Game {
    public readonly DOM: DOM
    public readonly notes: Notes
    public readonly judgements: Judgements
    public readonly maxScore: number

    public play(song: Song) {
        console.log(`${song.info.title} start`)
    }

    public constructor({
        DOM = {},
        notes = {
            n: () => new Tap(),
            l: () => new Hold(),
            d: () => new Drag(),
            f: () => new Flick(),
            x: () => new LongFlick()
        },
        judgements = [
            new Judgement('perfect', 40, true),
            new Judgement('great', 100, true),
            new Judgement('great', 100, true),
            new Judgement('bad', 500, false)
        ],
        maxScore = 100000
    }: GameParams = {}) {
        this.DOM = DOM
        this.notes = notes
        this.judgements = judgements
        this.maxScore = maxScore
    }
}
// #endregion

// export {
//     Judgement,
//     Note, Normal, Long,
//     Tap, Hold, Drag, Flick, LongFlick,
//     Song, Game
// }