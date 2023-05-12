/* eslint-disable no-undef */
// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../rhy-game.ts"/>

const note = new Tap('normal', 1000, 'normal-fade')
note.createDOM(document.getElementsByClassName('lane')[0])