const startMenuTemplate = require('./templates/startMenu')
const mainTemplate = require('./templates/main')
const HighScore = require('./HighScore')

class MemoryGame extends window.HTMLElement {
  constructor () {
    // calls the html constructor
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(mainTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(startMenuTemplate.content.cloneNode(true))
    this.size = 0
    this.brickTypes = ['octupus', 'grammofon', 'clock', 'cup', 'rose', 'scissor', 'hat', 'skeleton']
    this._lastClick = ''
    this._isTurned = false
    this._startButton = this.shadowRoot.querySelector('#start')
    this._form = this.shadowRoot.querySelector('form')
    this._pairs = 0
    this._player = ''
    this.memoryDiv = ''
  }
  static get observedAttributes () {
    return ['data-size', 'data-won']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data-size') {
      this.size = parseInt(newValue)
      this.shadowRoot.removeChild(this._form)
      this._createGame(this._createBricks())
    } else if (name === 'data-won') {
      this.shadowRoot.removeChild(this.memoryDiv)
      let highscores = window.localStorage.getItem('memory')
      console.log(highscores)
      let game = new HighScore('memory', this._player, this._pairs)
      game.addToStorage()
      game.sortByScore()
      highscores = JSON.parse(window.localStorage.getItem('memory'))
      console.log(highscores)
    }
  }
  connectedCallback () {
    this._onClickBrick = e => { this._clickBrick(e) }
    this.shadowRoot.addEventListener('click', this._onClickBrick)

    this._onPressEnter = e => {
      if (e.which === 13) {
        console.log('en')
        this._clickBrick(e)
      }
    }
    this.shadowRoot.addEventListener('keyup', this._onPressEnter)

    this._onClickStartButton = e => {
      e.preventDefault()
      this._player = this.shadowRoot.querySelector('#playername').value
      this.size = this.shadowRoot.querySelector('input[name="difficulty"]:checked').value
      this.setAttribute('data-size', this.size)
    }
    this._startButton.addEventListener('click', this._onClickStartButton)
  }

  disconnectedCallback () {
    this.shadowRoot.removeEventListener('click', this._onClickBrick)
    this.shadowRoot.removeEventListener('keyup', this._onPressEnter)
    this._startButton.removeEventListener('click', this._onClickStartButton)
  }
  _createGame (bricks) {
    this.memoryDiv = document.createElement('div')
    this.memoryDiv.setAttribute('id', 'memorydiv')
    this.shadowRoot.appendChild(this.memoryDiv)
    let row = 0
    let column = 0
    if (this.size === 2) {
      row = 2
      column = 2
    } else if (this.size === 4) {
      row = 2
      column = 4
    } else if (this.size === 8) {
      row = 4
      column = 4
    }
    let currentBrick = 0
    for (let i = 0; i < row; i++) {
      let rowDiv = document.createElement('div')
      this.memoryDiv.appendChild(rowDiv)
      rowDiv.classList.add('row')
      for (let j = 0; j < column; j++) {
        let a = document.createElement('a')
        a.setAttribute('tabindex', -1)
        a.setAttribute('href', '#')
        let img = document.createElement('img')
        img.setAttribute('tabindex', currentBrick)
        a.appendChild(img)
        img.classList.add(bricks[currentBrick])
        img.classList.add('question')
        rowDiv.appendChild(a)
        currentBrick++
      }
    }
  }

  _createBricks () {
    let bricks = this.brickTypes.slice(0, this.size)
    bricks.forEach(brick => {
      bricks.push(brick)
    })
    let m = bricks.length
    let t
    let i
    while (m) {
      i = Math.floor(Math.random() * m--)
      t = bricks[m]
      bricks[m] = bricks[i]
      bricks[i] = t
    }
    return bricks
  }
  _clickBrick (e) {
    let img = this.shadowRoot.querySelectorAll('img')
    if (!e.target.classList.contains('question') || this._isTurned) return
    e.target.classList.remove('question')
    if (this._lastClick === '') {
      this._lastClick = e.target.classList[0]
      return
    }
    if (e.target.classList.contains(this._lastClick)) {
      img.forEach(img => {
        if (!img.classList.contains('question') && !img.classList.contains('removed')) {
          img.classList.add('removed')
        }
      })
      this._pairs++
      if (this._pairs === this.size) {
        this.setAttribute('data-won', 'true')
      }
      this._lastClick = ''
    } else {
      this._isTurned = true
      setTimeout(() => {
        img.forEach(img => {
          if (!img.classList.contains('question') && !img.classList.contains('removed')) {
            img.classList.add('question')
            this._isTurned = false
          }
        })
      }, 1000)
      this._lastClick = ''
    }
  }
}
window.customElements.define('memory-game', MemoryGame)

module.exports = MemoryGame
