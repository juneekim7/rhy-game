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
        s: 'lane1',
        d: 'lane2',
        f: 'lane3',
        j: 'lane4',
        k: 'lane5',
        l: 'lane6'
    },
    notes: {
        s: (expectedTime) => new Tap(expectedTime),
        l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData)
    }
})

const song = new Song({
    info: {
        music: './염라.mp3',
        title: '염라',
        artist: '달의 하루',

        level: 5,
        bpm: 120,
        split: 16,
        delay: -450,

        cover: './cover/img.png',
        background: './background/img.png'
    },
    chart: {
        easy: [
            {
                lane1: 'n***|****|****|****|n***|****|****|****',
                lane2: '****|****|n***|****|****|****|n***|****',
                lane3: '****|****|****|n***|****|****|****|n***',
                lane4: '****|n***|****|****|****|n***|****|****'
            },
            {
                lane1: '****|****|n***|****|****|****|n***|****',
                lane2: 'n***|****|****|****|n***|****|****|****',
                lane3: '****|n***|****|****|****|n***|****|****',
                lane4: '****|****|****|n***|****|****|****|n***'
            }
        ],
        hard: [
            {}
        ]
    }
})

function play() {
    document.body.removeAttribute('onkeydown')
    game.play(song, 'hard')
}

document.body.setAttribute('onkeydown', 'play()')