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

class Note {
    // 아직 안 만듦
}

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
type ClassName = Record<string, string>
type Judgements = Judgement[]

interface GameParams {
    DOM?: DOM
    className?: ClassName
    judgements?: Judgements
}

class Game {
    public readonly DOM: DOM
    public readonly className: ClassName
    public readonly judgements: Judgements

    public play(map: Map) {
        console.log(`${map.info.title} start`)
    }

    public constructor({
        DOM = {},
        className = {},
        judgements = [
            new Judgement('perfect', 40, true),
            new Judgement('great', 100, true),
            new Judgement('great', 100, true),
            new Judgement('bad', 500, false)
        ]
    }: GameParams = {}) {
        this.DOM = DOM
        this.className = className
        this.judgements = judgements
    }
}
// #endregion

export {Game}