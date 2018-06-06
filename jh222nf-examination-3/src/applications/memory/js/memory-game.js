const startMenuTemplate = require('./templates/startMenuTemplate')
const headTemplate = require('./templates/headTemplate')
const mainTemplate = require('./templates/mainTemplate')
const highScoreTemplate = require('./templates/highscoreTemplate')
const HighScore = require('./HighScore')

/**
 * A web element that can be played as a memory game.
 *
 * @class MemoryGame
 * @extends {window.HTMLElement}
 */
class MemoryGame extends window.HTMLElement {
  constructor () {
    super()
    /**
    * Attach shadow dom to this web element.
    * @type {function}
    */
    this.attachShadow({mode: 'open'})
    /**
    * Web elements that make up the head of this web element.
    * @type {webelement}
    */
    this.shadowRoot.appendChild(headTemplate.content.cloneNode(true))
    /**
    * Web elements that make up the start menu.
    * @type {webelement}
    */
    this.shadowRoot.appendChild(startMenuTemplate.content.cloneNode(true))
    /**
    * number of pairs that will be present in this game. Is set from the start menu.
    * @type {int}
    */
    this._numberOfPairs = 0
    /**
    * different pairs that will be present in the game.
    * @type {array}
    */
    this.brickTypes = ['octupus', 'grammofon', 'clock', 'cup', 'rose', 'scissor', 'hat', 'skeleton']
    /**
    * the pair that was last clicked.
    * @type {string}
    */
    this._lastClick = ''
    /**
    * Tells wether a brick is turned at the moment and the player has to wait until they
    * are automatically turned over again to choose another brick to press.
    * @type {boolean}
    */
    this._isTurned = false
    /**
    * Web element button which initializes the game from the start menu.
    * @type {webelement}
    */
    this._startButton = this.shadowRoot.querySelector('#start')
    /**
    * Web element where the form at the start will be presented.
    * @type {webelement}
    */
    this._form = this.shadowRoot.querySelector('form')
    /**
    * how many attemps to find a pair that hit.
    * @type {int}
    */
    this._hit = 0
    /**
    * how many attemps to find a pair that missed.
    * @type {int}
    */
    this._miss = 0
    /**
    * time in seconds to finish the game.
    * @type {int}
    */
    this._time = 60
    /**
    * name of this game rounds player.
    * @type {string}
    */
    this._player = ''
    /**
    * total score for this game.
    * @type {int}
    */
    this._score = 0
    /**
    * Web element where the memory bricks will be presented.
    * @type {webelement}
    */
    this._memoryDiv = ''
    /**
    * An interval function that ticks down to zero by seconds to indicate time left before game over.
    * @type {function}
    */
    this._interval = ''
  }
  /**
   * Watches the custom attritbutes data-difficulty and data-won.
   * @readonly
   * @static
   * @memberof MemoryGame
   */
  static get observedAttributes () {
    return ['data-difficulty', 'data-won']
  }

  /**
   * Called by the browser engine when an attribute changes. The attributes that can be changed
   * are data-difficulty which will start the game at the right difficulty and data-won which will
   * present the highscore if a game is won by the player. Difficulty is equal to the amount of pairs in the game.
   * @param {any} name
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof MemoryGame
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data-difficulty') {
      this._numberOfPairs = parseInt(newValue)
      this.shadowRoot.removeChild(this._form)
      this._createGame(this._createBricks())
    } else if (name === 'data-won') {
      this._wonGame()
    }
  }

  /**
   * Called when this custom element is added to the DOM.
   *
   * @memberof MemoryGame
   */
  connectedCallback () {
    this.shadowRoot.querySelector('#playername').focus()

    this._onClickBrick = e => {
      this._clickBrick(e)
    }

    this._onPressEnterBrick = e => {
      this._pressEnterBrick(e)
    }

    this._onClickStartButton = e => {
      this._clickStartButton(e)
    }

    this.shadowRoot.addEventListener('click', this._onClickBrick)
    this.shadowRoot.addEventListener('keyup', this._onPressEnterBrick)
    this._startButton.addEventListener('click', this._onClickStartButton)
  }

  /**
   * Called when this element is removed from the DOM, removing eventlisteners.
   *
   * @memberof MemoryGame
   */
  disconnectedCallback () {
    this.shadowRoot.removeEventListener('click', this._onClickBrick)
    this.shadowRoot.removeEventListener('keyup', this._onPressEnterBrick)
    this._startButton.removeEventListener('click', this._onClickStartButton)
    window.clearInterval(this._interval)
  }

  /**
   * Start button is clicked which starts the game and saves the entered username and difficulty.
   *
   * @param {any} event
   * @memberof MemoryGame
   */
  _clickStartButton (event) {
    event.preventDefault()
    if (this.shadowRoot.querySelector('#playername').value === '') {
      let pInvalid = this.shadowRoot.querySelector('#invaliduser')
      pInvalid.innerText = ''
      pInvalid.innerText = '*Enter a username'
      return
    }
    this._player = this.shadowRoot.querySelector('#playername').value
    this._numberOfPairs = this.shadowRoot.querySelector('input[name="difficulty"]:checked').value
    this.setAttribute('data-difficulty', this._numberOfPairs)
  }

  /**
   * Creates a board game of memory bricks
   *
   * @param {array} bricks array of bricks of pairs that will represent the memory bricks
   * @memberof MemoryGame
   */
  _createGame (bricks) {
    this.shadowRoot.appendChild(mainTemplate.content.cloneNode(true))
    this._memoryDiv = this.shadowRoot.querySelector('#memorydiv')
    this.shadowRoot.appendChild(this._memoryDiv)
    this._memoryDiv.focus()
    this._timeLeft(this.shadowRoot.querySelector('#timer'))
    let row = 0
    let column = 0
    if (this._numberOfPairs === 2) {
      row = 2
      column = 2
    } else if (this._numberOfPairs === 4) {
      row = 2
      column = 4
    } else if (this._numberOfPairs === 8) {
      row = 4
      column = 4
    }
    let currentBrick = 0
    for (let i = 0; i < row; i++) {
      let rowDiv = document.createElement('div')
      this._memoryDiv.appendChild(rowDiv)
      rowDiv.classList.add('row')
      for (let j = 0; j < column; j++) {
        let brickNode = this.shadowRoot.querySelector('#brick-template')
        let brick = document.importNode(brickNode.content, true)
        let img = brick.querySelector('img')
        img.classList.add(bricks[currentBrick])
        img.classList.add('question')
        rowDiv.appendChild(brick)
        currentBrick++
      }
    }
  }

  /**
   * Creates an array of brick pairs
   *
   * @memberof MemoryGame
   * @return {array} bricks array of bricks of pairs that will represent the memory bricks
   */
  _createBricks () {
    let bricks = this.brickTypes.slice(0, this._numberOfPairs)
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

  /**
   * Handles the clicks that will turn the memory bricks.
   *
   * @param {any} event
   * @memberof MemoryGame
   */
  _clickBrick (event) {
    let img = this.shadowRoot.querySelectorAll('img')
    if (!event.target.classList.contains('question') || this._isTurned) return
    event.target.classList.remove('question')
    if (this._lastClick === '') {
      this._lastClick = event.target.classList[0]
      return
    }
    if (event.target.classList.contains(this._lastClick)) {
      img.forEach(img => {
        if (!img.classList.contains('question') && !img.classList.contains('removed')) {
          img.classList.add('removed')
        }
      })
      this._hit++
      if (this._hit === this._numberOfPairs) {
        this.setAttribute('data-won', 'true')
      }
      this._lastClick = ''
    } else {
      this._isTurned = true
      this._miss++
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

  /**
   * Turn bricks with the enter key.
   *
   * @param {any} event
   * @memberof MemoryGame
   */
  _pressEnterBrick (event) {
    if (event.which === 13) {
      this._clickBrick(event)
    }
  }

  /**
   * The time left before the game is lost.
   *
   * @memberof MemoryGame
   */
  _timeLeft (timerElement) {
    this._interval = setInterval(() => {
      if (this._time < 1) {
        this.shadowRoot.removeChild(this._memoryDiv)
        let pGameOver = document.createElement('p')
        pGameOver.setAttribute('id', 'gameover')
        this.shadowRoot.appendChild(pGameOver)
        pGameOver.innerText = 'YOU LOST'
        window.clearInterval(this._interval)
      }
      this._time--
      timerElement.innerText = parseInt(this._time)
    }, 1000)
  }

  /**
   * Creates a highscore board and saves scores to local storage.
   *
   * @memberof MemoryGame
   */
  _wonGame () {
    this.shadowRoot.removeChild(this._memoryDiv)
    this.shadowRoot.appendChild(highScoreTemplate.content.cloneNode(true))
    let highscores = window.localStorage.getItem('memory')
    window.clearInterval(this._interval)
    this._score = this._time * this._hit - 10 * this._miss
    if (this._score < 0) { this._score = 0 }
    let game = new HighScore('memory', this._player, this._score)
    game.addToStorage()
    game.sortByScore()
    highscores = JSON.parse(window.localStorage.getItem('memory'))

    let pScore = this.shadowRoot.querySelector('#yourscore')
    pScore.innerText = `Your score ${this._score}`

    let hsTable = this.shadowRoot.querySelector('#hsBoard')
    let length = 5
    if (highscores.length < 5) { length = highscores.length }
    for (let i = 0; i < length; i++) {
      hsTable.innerHTML += `
      <tr>
      <td class="leftcolumn">${i + 1}</td>
      <td>${highscores[i].player}</td> 
      <td class="rightcolumn">${highscores[i].score}</td>
    </tr>     
      `
    }
  }
}

// Registers the custom event.
window.customElements.define('memory-game', MemoryGame)

module.exports = MemoryGame
