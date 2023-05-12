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
abstract class Note {
    private readonly className: string
    private readonly speed: number
    private readonly fadeAnimation: string

    public createDOM(laneDOM: HTMLBodyElement) {
        const noteDOM = document.createElement('div')
        noteDOM.setAttribute('class', this.className)
        noteDOM.style.animationDuration = this.speed + 'ms'

        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `100ms linear ${this.fadeAnimation}`
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove()
            })
        })

        laneDOM.appendChild(noteDOM)
    }

    public constructor(className: string, speed: number, fadeAnimaion: string) {
        this.className = className
        this.speed = speed
        this.fadeAnimation = fadeAnimaion
    }
}

// #region basic note
class Normal extends Note {}

class Long extends Note {}
// #endregion

// #region basic mobile note
class Tap extends Normal {}

class Hold extends Long {}
// #endregion

// #region advanced note
class Drag extends Tap {}

class Flick extends Tap {}

class LongFlick extends Hold {}
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
type Notes = Record<string, typeof Note>
type Judgements = Judgement[]

interface GameParams {
    DOM?: DOM
    notes?: Notes
    judgements?: Judgements
}

class Game {
    public readonly DOM: DOM
    public readonly notes: Notes
    public readonly judgements: Judgements

    public play(song: Song, speed = 1000) {
        console.log(`${song.info.title} start with speed ${speed}ms`)
    }

    public constructor({
        DOM = {},
        notes = {
            n: Tap,
            l: Hold,
            d: Drag,
            f: Flick,
            t: LongFlick
        },
        judgements = [
            new Judgement('perfect', 40, true),
            new Judgement('great', 100, true),
            new Judgement('great', 100, true),
            new Judgement('bad', 500, false)
        ]
    }: GameParams = {}) {
        this.DOM = DOM
        this.notes = notes
        this.judgements = judgements
    }
}
// #endregion

/* export {
    Judgement,
    Note, Normal, Long,
    Tap, Hold, Drag, Flick, LongFlick,
    Song, Game
} */