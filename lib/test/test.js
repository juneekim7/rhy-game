/* eslint-disable no-undef */
// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../rhy-game.ts"/>

const game = new Game({
    DOM: {
        lane1: document.getElementsByClassName('lane')[0],
        lane2: document.getElementsByClassName('lane')[1],
        lane3: document.getElementsByClassName('lane')[2],
        lane4: document.getElementsByClassName('lane')[3]
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
        ]
    }
})

function play() {
    game.play(song, 'hard')
    document.body.removeAttribute('onkeydown')
}

document.body.setAttribute('onkeydown', 'play()')