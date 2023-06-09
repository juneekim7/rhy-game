/* eslint-disable no-undef */
// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/rhy-game.ts"/>

const game = new Game({
    DOM: {
        lane1: document.getElementsByClassName('lane')[0],
        lane2: document.getElementsByClassName('lane')[1],
        lane3: document.getElementsByClassName('lane')[2],
        lane4: document.getElementsByClassName('lane')[3],

        score: document.getElementById('score'),
        combo: document.getElementById('combo'),
        judgement: document.getElementById('judgement')
    },
    keybind: {
        d: 'lane1',
        f: 'lane2',
        g: 'lane3',
        h: 'lane4',
        j: 'lane5',
        k: 'lane6'
    },
    notes: {
        s: (expectedTime) => new Tap(expectedTime),
        l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData)
    }
})

const song = new Song({
    info: {
        music: './염라.mp3',
        volume: 0.5,
        title: '염라',
        artist: '달의 하루',

        bpm: 132,
        split: 16,
        delay: -450
    },
    chart: {
        normal: [
            {
                lane1: '|****|***|****|s***|',
                lane2: '|****|***|***s|*s**|',
                lane3: '|****|***|**s*|****|',
                lane4: '|****|***|*s**|****|',
                lane5: '|****|***|****|****|',
                lane6: '|****|***|****|****|'
            },
            {
                lane1: '||***s|s***|****|****||***s|s***|****|****||****|**s*|lll*|****||****|**s*|lll*|****||',
                lane2: '||**s*|**s*|s***|****||**s*|**s*|s***|****||****|s***|****|****||****|s***|***s|****||',
                lane3: '||*s**|s***|**s*|s***||*s**|s***|**s*|**s*||**s*|****|****|**s*||**s*|****|****|****||',
                lane4: '||s***|****|s***|**s*||s***|****|s***|s***||s***|****|***s|****||s***|****|****|****||',
                lane5: '||****|****|****|****||****|****|****|****||****|****|lll*|****||****|****|lll*|****||',
                lane6: '||****|****|****|****||****|****|****|****||****|****|***s|****||****|****|***s|****||'
            }
        ]
    }
})

function play() {
    document.body.removeAttribute('onkeydown')
    document.body.removeAttribute('ontouchstart')
    game.play(song, 'normal')
}

document.body.setAttribute('onkeydown', 'play()')
document.body.setAttribute('ontouchstart', 'play()')