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
        combo: document.getElementById('combo'),
        judgement: document.getElementById('judgement'),
        score: document.getElementById('score')
    }
})
```

#### Make your own song(chart)

```js
const myOwnSong = new Song({
    info: {
        music: './music/song.mp3',
        title: 'music title',
        artist: 'artist',

        level: 5,
        bpm: 120,
        split: 16,

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
                lane1: 'n***|n*n*|****|****|n***|n*n*|****|****',
                lane2: '****|****|llll|llll|****|****|llll|llll',
                lane3: '****|****|****|llll|****|****|****|llll',
                lane4: '****|n*n*|****|****|****|n*n*|****|****'
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
myRhythmGame.play(myOwnSong, 'easy')
```

### Advanced

#### Custom judgements

#### Custom notes

#### Design tips

### Examples

### License

Copyright (c) 2023 준이 (Junee, juneekim7)\
Released under the [MIT License](./LICENSE).