# rhy-game (incomplete project)

## Translation

- [한국어](./README.kr.md)

## Description

"make your own web rhythm game easily!"

Most rhythm games have similar features and mechanism except for design, details, and a bit of personality. Using rhy-game can help you to make your own note-based web rhythm game easily. Since your game is on the web, it will be lightweight and accessible to people.

### Features

- make note-based web rhythm game easily
- link HTML DOM elements to rhythm game objects
- all you need to do is design your game with css
- make custom rhythm game map by bmson or load map from online
- custom your rhythm game with many options
- you may also make new notes and judgements

### What cannot be made

#### rhythm game that is not note-based

- [A Dance of Fire and Ice](https://store.steampowered.com/app/977950/A_Dance_of_Fire_and_Ice/)
- [geometry dash](https://www.robtopgames.com/)
- [Just Dance](https://justdancenow.com/)
- [Just Shapes & Beats](https://store.steampowered.com/app/531510/Just_Shapes__Beats/)

#### rhythm game using notes that do not follow designated lanes

- [osu!](https://osu.ppy.sh/home/)
- [cytus](https://rayark.com/g/cytus/) \
(You can make it similar with a little trick but it would be hard to make slide notes)
- [cytusII](https://rayark.com/g/cytus2/)

## Documentation

### Contents

### Download

### Quick Start

#### Make new game and bind HTML DOM elements

```js
const myRhythmGame = new Game({
    DOM: {
        lane1: document.getElementsByClassName('lane')[0],
        lane2: document.getElementsByClassName('lane')[1],
        lane3: document.getElementsByClassName('lane')[2],
        lane4: document.getElementsByClassName('lane')[3],

        background: document.getElementById('background'),
        score: document.getElementById('score'),
        judgement: document.getElementById('judgement'),
        combo: document.getElementById('combo')
    },
    keybind: {
        d: 'lane1',
        f: 'lane2',
        j: 'lane3',
        k: 'lane4'
    },
    sizePerBeat: '25vh',
    laneSizeRaio: 4
})
```

#### Design your game elements

```css
.lane {
    width: 100px;
    height: var(--lane-size);
    border: 1px solid black;

    display: inline-block;
}

.note {
    width: 100px;
    height: var(--size);
    background-color: skyblue;

    position: absolute;
    bottom: var(--size);
}

@keyframes move {
    0% { transform: translateY(0); }
    100% { transform: translateY(var(--lane-size)); }
}

@keyframes fade {
    0% { bottom: 0; height: var(--size); }
    100% { bottom: 0; height: 0; }
}
```

#### Make your own song(chart)

```js
const myOwnSong = new Song({
    info: {
        music: './music/song.mp3',
        title: 'music title',
        artist: 'artist',
        
        bpm: 120,
        split: 16,
        difficulty: {
            easy: 3,
            hard: 5
        },

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
```

#### Play Game

```js
myRhythmGame.play(myOwnSong, 'hard' /* or 'easy' */ )
```

#### Result

<p align="center">
    <img src="./examples/images/quick start.gif" style="height: 60vh;" />
</p>

### Advanced

#### Custom notes

```js
class MyCustomNote extends Flick {
    constructor(lane, index, {
        classNames = ['note', 'normal', 'tap', 'flick', 'up'],
        moveAnimation = 'flickMove',
        fadeAnimation = 'flickFade',
        timingFunction = 'linear',
        sizeRatio = 0.2
    } = {}) {
        super(lane, index, {
            classNames,
            moveAnimation,
            fadeAnimation,
            timingFunction,
            sizeRatio
        })
    }
}
```

#### Additional game options

```js
const myRhythmGame = new Game({
    DOM: { ... },
    notes: {
        n: (lane, index) => new Normal(lane, index),
        l: (lane, index) => new Long(lane, index),
        d: (lane, index) => new Drag(lane, index),
        f: (lane, index) => new Flick(lane, index),
        x: (lane, index) => new HoldFlick(lane, index),
        c: (lane, index) => new MyCustomNote(lane, index)
    }
    judgements: [
        // new Judgement(name, time, isCombo)
        new Judgement('amazing', 50, 1, true),
        new Judgement('wow', 100, 0.5, true),
        new Judgement('umm', 50, 0.3, false)
        // miss is automatically generated
    ],
    maxScore: 1000,
    sizePerBeat: ...,
    laneSizeRaio: ...
})
```

### Design Tips

#### use transition to use GPU

### Examples

### License

For inquiries, please contact juneekim7@gmail.com

Copyright (c) 2023 준이 (Junee, juneekim7)\
Released under the [MIT License](./LICENSE).
