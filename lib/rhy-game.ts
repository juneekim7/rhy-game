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
    public className: string
    public animationName: string

    public constructor(className: string, animationName: string) {
        this.className = className
        this.animationName = animationName
    }
}

// #region basic note
class Normal extends Note {
    public constructor(className: string, animationName: string) {
        super(className, animationName)
    }
}

class Long extends Note {}
// #endregion

// #region basic mobile note
class Tab extends Normal {}

class Hold extends Long {}
// #endregion

// #region advanced note
class Drag extends Tab {}

class Flick extends Tab {}

class LongFlick extends Hold {}
// #endregion
// #endregion

// #region map
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

interface Data {
    [mode: string]: []
}

interface MapParams {
    info: Info,
    data: Data
}

class Map {
    public readonly info: Info
    public readonly data: Data

    public constructor({ info, data }: MapParams) {
        this.info = info,
        this.data = data
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

    public play(map: Map, speed = 1000) {
        console.log(`${map.info.title} start with speed ${speed}ms`)
    }

    public constructor({
        DOM = {},
        notes = {
            n: Tab,
            l: Hold,
            d: Drag,
            f: Flick
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

export { Judgement, Note, Map, Game }