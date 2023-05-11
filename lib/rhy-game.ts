class Judgement {
    name: string
    time: number
    isCombo: boolean
    constructor(name: string, time: number, isCombo = true) {
        this.name = name
        this.time = time
        this.isCombo = isCombo
    }
}

class Game {
    DOM: Record<string, HTMLBodyElement>
    className: Record<string, string>
    judgement: Judgement[]

    constructor({
        DOM = {},
        className = {},
        judgement = [
            new Judgement('perfect', 40, true),
            new Judgement('great', 100, true),
            new Judgement('great', 100, true),
            new Judgement('bad', 500, false)
        ]
    }) {
        this.DOM = DOM
        this.className = className
        this.judgement = judgement
    }
}

export {Game}