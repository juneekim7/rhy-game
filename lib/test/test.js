window.alert('hello')
import * as rhyGame from '../rhy-game.js'

const note = new rhyGame.Tap('normal', 'normal-down', 1000)
note.generateDOM(document.getElementsByClassName('lane')[0])
window.alert('hi')