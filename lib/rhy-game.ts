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
    fadeAnimation?: string
    timingFunction?: string
    sizeRatio?: number
}

abstract class Note {
    public className = 'note'
    public moveAnimation = 'move'
    public fadeAnimation = 'note-fade'
    public timingFunction = 'linear'
    public sizeRatio = 1

    public createDOM(laneDOM: HTMLBodyElement, moveTime: number) {
        const noteDOM = document.createElement('div')
        noteDOM.setAttribute('class', this.className)
        noteDOM.style.animation = `${moveTime}ms ${this.timingFunction} ${this.moveAnimation}`

        noteDOM.addEventListener('animationend', () => {
            noteDOM.style.animation = `${moveTime * this.sizeRatio}ms ${this.timingFunction} ${this.fadeAnimation}`
            noteDOM.addEventListener('animationend', () => {
                noteDOM.remove()
            })
        })

        laneDOM.appendChild(noteDOM)
    }

    public constructor({
        className = undefined,
        moveAnimation = undefined,
        fadeAnimation = undefined,
        timingFunction = undefined,
        sizeRatio
    }: NoteParams = {}) {
        if (className) this.className = className
        if (moveAnimation) this.moveAnimation = moveAnimation
        if (fadeAnimation) this.fadeAnimation = fadeAnimation
        if (timingFunction) this.timingFunction = timingFunction
        if (sizeRatio) this.sizeRatio = sizeRatio
    }
}

// #region basic note
class Normal extends Note {
    public className = 'normal'
    public fadeAnimation = 'normal-fade'
    public sizeRatio = 0.1
}

class Long extends Note {
    public className = 'long'
    public fadeAnimation = 'long-fade'
    public sizeRatio = 1
}
// #endregion

// #region basic mobile note
class Tap extends Normal {}

class Hold extends Long {}
// #endregion

// #region advanced note
class Drag extends Tap {
    public className = 'drag'
}

class Flick extends Tap {
    public className = 'flick'
}

class LongFlick extends Hold {
    public className = 'long-flick'
}
// #endregion
// #endregion

// #region song
class Info {
    public readonly music: string
    public readonly title: string
    public readonly artist: string

    public readonly difficulty: number
    public readonly bpm: number
    public readonly split: number

    public readonly cover: string
    public readonly background: string

    public constructor(info: Info) {
        this.music = info.music
        this.title = info.title
        this.artist = info.artist

        this.difficulty = info.difficulty
        this.bpm = info.bpm
        this.split = info.split

        this.cover = info.cover
        this.background = info.background
    }
}

interface Chart {
    [mode: string]: Record<string, string>[]
}

interface SongParams {
    info: Info,
    charts: Chart
}

class Song {
    public readonly info: Info
    public readonly charts: {
        [mode: string]: Record<string, string>[]
    }

    public constructor({ info, charts }: SongParams) {
        this.info = info,
        this.charts = charts
    }
}
// #endregion

// #region game
type DOM = Record<string, HTMLBodyElement>
type Notes = Record<string, () => Note>
type Judgements = Judgement[]
interface Time {
    move: number
    delay: number
}

interface GameParams {
    DOM?: DOM
    notes?: Notes
    judgements?: Judgements
    maxScore?: number
    time?: Time
}

class Game {
    public DOM: DOM
    public notes: Notes
    public judgements: Judgements
    public maxScore: number
    public time: Time

    private loadNote(song: Song, mode: string) {
        if (!(mode in song.charts)) {
            throw new Error(`there is no mode ${mode} in the song ${song.info.title}`)
        }
        if (song.charts[mode].length === 0) {
            throw new Error(`there is no information in the mode ${mode} of the song ${song.info.title}`)
        }

        const chart: Record<string, string> = {}
        for (const group of song.charts[mode]) {
            for (const laneName in group) {
                if (!(laneName in this.DOM)) continue
                if (! chart[laneName]) chart[laneName] = ''
                chart[laneName] += group[laneName].replace(/\|/g, '')
            }
        }

        let index = 0
        setInterval(() => {
            for (const laneName in chart) {
                const lane = chart[laneName]
                if (index === lane.length) return

                const noteChar = lane[index]
                if (noteChar in this.notes) {
                    const note = this.notes[noteChar]()
                    note.createDOM(this.DOM[laneName], this.time.move)
                }
            }
            index++
        }, 240000 / song.info.bpm / song.info.split)
    }

    public play(song: Song, mode: string) {
        const music = new Audio(song.info.music)

        setTimeout(() => {
            this.loadNote(song, mode)
        }, 0)
        setTimeout(() => {
            music.play()
        }, this.time.move + this.time.delay)

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
        maxScore = 100000,
        time = {
            move: 1000,
            delay: 0
        }
    }: GameParams = {}) {
        this.DOM = DOM
        this.notes = notes
        this.judgements = judgements
        this.maxScore = maxScore
        this.time = time
    }
}
// #endregion

// export {
//     Judgement,
//     Note, Normal, Long,
//     Tap, Hold, Drag, Flick, LongFlick,
//     Song, Game
// }