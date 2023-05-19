/* eslint-disable no-undef */
// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../rhy-game.ts"/>

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
        j: 'lane3',
        k: 'lane4'
    },
    delay: 500,
    sizePerBeat: '25vh',
    laneSizeRatio: 4
})

const song = new Song({
    info: {
        music: './wave.mp3',
        title: 'wave',
        artist: 'Junee',

        level: 5,
        bpm: 159,
        split: 4,

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
            {
                lane1: 'nn**|n*n*|****|****|nn**|n*n*|****|****',
                lane2: '**ll|****|llll|llll|**ll|****|llll|llll',
                lane3: '****|ll**|nnnn|llll|****|ll**|****|llll',
                lane4: '*n*n|n*n*|****|****|*n*n|n*n*|****|****'
            },
            {
                lane1: '****|****|llll|llll|****|****|llll|llll',
                lane2: 'n***|n*n*|****|****|n***|n*n*|****|****',
                lane3: '****|n*n*|****|****|****|n*n*|****|****',
                lane4: '****|****|****|llll|****|****|****|llll'
            }
        ],
        test: [
            {
                lane1: '****|****|****|****|****|****|****|****',
                lane2: '****|****|****|****|****|****|****|****',
                lane3: '****|****|****|****|****|****|****|****',
                lane4: 'n***|ll**|ll**|llll|n***|ll**|ll**|llll'
            }
        ]
    }
})

function play() {
    document.body.removeAttribute('onkeydown')
    game.play(song, 'test')
}

document.body.setAttribute('onkeydown', 'play()')