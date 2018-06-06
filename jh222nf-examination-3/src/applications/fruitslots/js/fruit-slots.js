const fruitSlotsMainTemplate = require('./templates/fruitSlotsMainTemplate')
const fruitSlotsHeadTemplate = require('./templates/fruitSlotsHeadTemplate')
const fruitSlotStartTemplate = require('./templates/fruitSlotStartTemplate')
/**
 * A web element that represent a slot machine.
 *
 * @class FruitSlots
 * @extends {window.HTMLElement}
 */
class FruitSlots extends window.HTMLElement {
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
    this.shadowRoot.appendChild(fruitSlotsHeadTemplate.content.cloneNode(true))
    /**
    * Web elements that make up the start menu.
    * @type {webelement}
    */
    this.shadowRoot.appendChild(fruitSlotStartTemplate.content.cloneNode(true))
    /**
    * array of different slots. The more of the same kind the more likely they will appear
    * on each spin.
    * @type {array[{string, int}]}
    */
    this.slots = [
    {name: 'fullmelon', value: 2}, {name: 'fullmelon', value: 2},
    {name: 'cherry', value: 0},
    {name: 'blueberry', value: 10},
    {name: 'grapes', value: 10},
    {name: 'melon', value: 2}, {name: 'melon', value: 2},
    {name: 'pineapple', value: 1},
    {name: 'lime', value: 1}, {name: 'lime', value: 1}, {name: 'lime', value: 1}]
    /**
    * A two dimensional array where the inner arrays are the coulmns with the slots.
    * @type {array[[]]}
    */
    this.arrSlots = []
    /**
    * A jackpot number that will increase the more the player plays. Stored in localstorage.
    * @type {int}
    */
    this._jackpot = parseInt(window.localStorage.getItem('fruit-slots-jackpot')) || 1000
    /**
    * The number of winning slots to be counted to get the total amount won.
    * @type {int}
    */
    this._hits = 0
    /**
    * The funds availible to play with. Stored in localstorage over sessions.
    * @type {int}
    */
    this._funds = parseInt(window.localStorage.getItem('fruit-slots-funds')) || 0
    /**
    * Betting size for each spin.
    * @type {int}
    */
    this._bet = 5
    /**
    * Web element button that will add more money to the funds.
    * @type {webelement}
    */
    this._insertBtn = ''
    /**
    * Web element button which will withdraw money from the funds.
    * @type {webelement}
    */
    this._withdrawBtn = ''
    /**
    * Web element button which initializes the game from the start menu.
    * @type {webelement}
    */
    this._startBtn = ''
    /**
    * Web element button that spins the slotmachine.
    * @type {webelement}
    */
    this._spinBtn = ''
    /**
    * Tells if the game was started.
    * @type {boolean}
    */
    this._didStartGame = false
    /**
    * Web element p show the amount won.
    * @type {webelement}
    */
    this._pAmountWon = ''
  }
  /**
   * Watches the custom attritbutes data-start.
   * @readonly
   * @static
   * @memberof FruitSlots
   */
  static get observedAttributes () {
    return ['data-start']
  }
  /**
   * Called by the browser engine when an attribute changes. Will initialize the
   * game after the startmenu.
   * @param {any} name
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof FruitSlots
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data-start') {
      this._startGame()
    }
  }
  /**
   * Called when this custom element is added to the DOM.
   * Will initialize the start menu.
   * @memberof FruitSlots
   */
  connectedCallback () {
    this._createStartMenu()
  }
  /**
   * Called when this element is removed from the DOM, removing eventlisteners.
   *
   * @memberof FruitSlots
   */
  disconnectedCallback () {
    this._insertBtn.removeEventListener('click', this._onInsertBtn)
    this._withdrawBtn.removeEventListener('click', this._onWithdrawBtn)
    this._startBtn.removeEventListener('click', this._onStartBtn)
    if (this._didStartGame) {
      this._spinBtn.removeEventListener('click', this._onSpinBtn)
    }
  }
  /**
   * Start menu is created and added to custom element.
   *
   * @param {any} event
   * @memberof FruitSlots
   */
  _createStartMenu () {
    let funds = this.shadowRoot.querySelector('p')
    funds.innerText = this._funds
    let amountField = this.shadowRoot.querySelector('#funds')
    this._insertBtn = this.shadowRoot.querySelector('#insert')
    this._withdrawBtn = this.shadowRoot.querySelector('#withdraw')
    this._startBtn = this.shadowRoot.querySelector('#startbtn')

    this._onInsertBtn = (e) => {
      e.preventDefault()
      if (!Number.isInteger(parseInt(amountField.value)) || parseInt(amountField.value) < 0) { return }
      this._funds += parseInt(amountField.value)
      funds.innerText = this._funds
      window.localStorage.setItem('fruit-slots-funds', this._funds)
    }

    this._onWithdrawBtn = (e) => {
      e.preventDefault()
      if (!Number.isInteger(parseInt(amountField.value)) || parseInt(amountField.value) < 0) { return }
      if (this._funds - parseInt(amountField.value) < 0) { return }
      this._funds -= parseInt(amountField.value)
      funds.innerText = this._funds
      window.localStorage.setItem('fruit-slots-funds', this._funds)
    }

    this._onStartBtn = (e) => {
      e.preventDefault()
      this._bet = this.shadowRoot.querySelector('input[name="bet"]:checked').value
      if (this._funds < parseInt(this._bet)) {
        let pInsufficient = this.shadowRoot.querySelector('#insufficient')
        pInsufficient.innerText = ''
        pInsufficient.innerText = '*insert more funds'
        return
      }
      this.shadowRoot.removeChild(this.shadowRoot.querySelector('#start'))
      this.setAttribute('data-start', this._bet)
    }

    this._insertBtn.addEventListener('click', this._onInsertBtn)
    this._withdrawBtn.addEventListener('click', this._onWithdrawBtn)
    this._startBtn.addEventListener('click', this._onStartBtn)
  }
  /**
   * Creates a slotmachine that can be spinned.
   *
   * @memberof FruitSlots
   */
  _startGame () {
    this._didStartGame = true
    this.shadowRoot.appendChild(fruitSlotsMainTemplate.content.cloneNode(true))
    this._createSlots()
    this._displaySlots(this.arrSlots)
    let jackpotField = this.shadowRoot.querySelector('#jackpot')
    jackpotField.innerText = this._jackpot
    let fundsField = this.shadowRoot.querySelector('#funds')
    fundsField.innerText = this._funds
    this._spinBtn = this.shadowRoot.querySelector('#spinbtn')

    this._onSpinBtn = () => {
      if (this._funds < parseInt(this._bet)) {
        let pInsufficient = this.shadowRoot.querySelector('#insufficient')
        pInsufficient.innerText = ''
        pInsufficient.innerText = '*insufficient funds'
        return
      }
      this._pAmountWon = this.shadowRoot.querySelector('#amountwon')
      this._pAmountWon.innerText = ''
      this._jackpot = parseInt(window.localStorage.getItem('fruit-slots-jackpot')) || this._jackpot
      this._funds = parseInt(window.localStorage.getItem('fruit-slots-funds'))
      this._createSlots()
      this._displaySlots(this.arrSlots)
      let amountWon = -parseInt(this._bet) + this._totalAmountWon()
      this._funds += amountWon
      if (amountWon > 0) {
        this._pAmountWon.innerText = `You won ${amountWon}`
      }
      fundsField.innerText = this._funds
      this._jackpot += this._bet / 5
      jackpotField.innerText = this._jackpot
      window.localStorage.setItem('fruit-slots-funds', this._funds)
      window.localStorage.setItem('fruit-slots-jackpot', this._jackpot)
    }

    this._spinBtn.addEventListener('click', this._onSpinBtn)
  }
  /**
   * Create two dimensional array of slots in columns.
   *
   * @memberof FruitSlots
   */
  _createSlots () {
    for (let i = 0; i < 5; i++) {
      this.arrSlots[i] = this._shuffle(this.slots.slice())
    }
  }
  /**
   * Creates a new spin.
   *
   * @param {array} arr two dimensinal array of slots.
   * @memberof FruitSlots
   */
  _displaySlots (arr) {
    let imgs = this.shadowRoot.querySelectorAll('img')
    let imgCount = 0
    imgs.forEach(img => {
      while (img.classList.length > 0) {
        img.classList.remove(img.classList[0])
      }
    })
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < 3; j++) {
        imgs[imgCount].classList.add(arr[i][j].name)
        imgCount++
      }
    }
  }
  /**
   * Check if there was a winning spin.
   *
   * @param {array} arr two dimensinal array of slots.
   * @param {int} i current slot column. Always 1. Start checking the second column.
   * @param {string} el spin element to check victory against.
   * @return {int} amount won.
   * @memberof FruitSlots
   */
  _checkSpin (arr, i, el) {
    for (let j = 0; j < 3; j++) {
      if (arr[i][j].name === el) {
        let currentValue = arr[i][j].value
        i++
        if (i === 5) {
          let img = this.shadowRoot.querySelectorAll('img')
          img.forEach(slot => {
            if (slot.classList.contains(el)) {
              slot.classList.add('winner')
              this._hits++
            }
            if (!slot.classList.contains(el)) {
              slot.classList.add('loser')
            }
          })
          if (el === 'cherry') {
            this._pAmountWon.innerText = `JACKPOT! ${this._jackpot}`
            this._funds += this._jackpot
            this._jackpot = 1000
            return 0
          }
          let AmountWon = currentValue * this._hits * this._bet
          this._hits = 0
          return AmountWon
        }
        return this._checkSpin(arr, i, el)
      }
    }
    return 0
  }
  /**
   * Return total amount won over all rows
   * @return {int} total amount won
   * @memberof FruitSlots
   */
  _totalAmountWon () {
    let won = 0

    won += this._checkSpin(this.arrSlots, 1, this.arrSlots[0][0].name)
    if (this.arrSlots[0][0].name !== this.arrSlots[0][1].name) {
      won += this._checkSpin(this.arrSlots, 1, this.arrSlots[0][1].name)
    }
    if (this.arrSlots[0][0].name !== this.arrSlots[0][2].name && this.arrSlots[0][1].name !== this.arrSlots[0][2].name) {
      won += this._checkSpin(this.arrSlots, 1, this.arrSlots[0][2].name)
    }
    return won
  }
  /**
   * Shuffles the element of an array.
   * @param {array} array to be shuffled
   * @return {array} shuffled array
   * @memberof FruitSlots
   */
  _shuffle (array) {
    let m = array.length
    let t
    let i
    while (m) {
      i = Math.floor(Math.random() * m--)
      t = array[m]
      array[m] = array[i]
      array[i] = t
    }
    return array
  }
}

window.customElements.define('fruit-slots', FruitSlots)

module.exports = FruitSlots
