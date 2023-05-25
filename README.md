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
        
        bpm: 120,
        split: 16,

        background: './background/img.png',
        design: { /* anything you want to put ex) main color */ }
    },
    chart: {
        // | is only for convenience of dividing beats, and has no role
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

#### Play game

```js
myRhythmGame.play(myOwnSong, 'hard' /* or 'easy' */ )
```

#### Result

<p align="center">
    <img src="./examples/images/quick start.gif" style="height: 60vh;" />
</p>

### Advanced

#### Additional game options

```js
const game = new Game({
    ... /* Parameters that must be specified */,
    // bind characters in chart
    notes: {
        n: (expectedTime) => new Tap(expectedTime),
        l: (expectedTime, additionalData) => new Hold(expectedTime, additionalData),
        d: (expectedTime) => new Drag(expectedTime),
        f: (expectedTime) => new Flick(expectedTime),
        x: (expectedTime, additionalData) => new HoldFlick(expectedTime, additionalData),
        c: (expectedTime, additionalData) => new MyCustomNote(expectedTime, additionalData)
    }
    judgements: [
        // new Judgement(name, time, scoreRatio, isCombo)
        new Judgement('amazing', 50, 1, true),
        new Judgement('wow', 100, 0.5, true),
        new Judgement('umm', 50, 0.3, false)
        // miss is automatically generated
    ],
    maxScore: 1000,
    delay: 500,
    // 0 is the end point of the lane, and 1 is the start point of the lane
    judgementPosition: 0.2,
    event: {
        input: {
            keydown: (game, laneName) => {
                // something you want to execute when the player presses down a key which is bound to a specific lane
            },
            keyup: (game, laneName) => {
                // something you want to execute when the player presses up a key which is bound to a specific lane
            }
        },
        play: (game, song, mode) => {
            // something you want to execute when game.play() is called
        },
        load: (game, note) => {
            // something you want to execute when notes are loaded
        },
        judge: (game, judgementData, judgedNote) => {
            //default value: this.sendJudgeToDOM()
            // something you want to execute when judgementData is changed

            // `IMPORTANT` If you define this method as your own, score, lastJudgement, and combo would not automatically displayed in game.DOM.score, game.DOM.judgement, and game.DOM.combo
        },
        end: (game, judgementData) => {
            // something you want to execute when the game is ended
        }
    }
```

(The values written in the code are examples only, not the default values)

You may assign additional game options after creating an instance 

```js
const game = new Game(...)
game.event.input.keydown = (game, laneName) => {
    // something you want to execute when the player presses down a key which is bound to a specific lane
}
```

#### Things to help with making charts

you can pass beat as third argument of game.play

```js
const game = new Game()
game.play(song, mode, beat)
// the song would be played starting from beat
```

### Design Tips

#### Use transition for GPU render

```css
/* use */
@keyframes move {
    0% { transform: translateY(0); }
    100% { transform: translateY(var(--lane-size)); }
}

/* DO NOT use */
@keyframes move {
    0% { top: 0; }
    100% { top: var(--lane-size); }
}
```

[Information about CSS GPU animation](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)

#### Use multiple game instances to make multiplayer rhythm game

```js
const instance1 = new Game(...)
const instance2 = new Game(...) // with different args

instance1.play(song, mode)
song.info.volume = 0
instance2.play(song, mode)
```

### Examples

### License

For inquiries, please contact juneekim7@gmail.com

Copyright (c) 2023 준이 (Junee, juneekim7)\
Released under the [MIT License](./LICENSE).
