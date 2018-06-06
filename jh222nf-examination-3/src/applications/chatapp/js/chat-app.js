const chatHeadTemplate = require('./templates/chatHeadTemplate')
const chatTemplate = require('./templates/chatTemplate')
const chatStartTemplate = require('./templates/chatStartTemplate')
/**
 * A web element that work as a chat window.
 *
 * @class ChatApp
 * @extends {window.HTMLElement}
 */
class ChatApp extends window.HTMLElement {
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
    this.shadowRoot.appendChild(chatHeadTemplate.content.cloneNode(true))
   /**
    * Web socket to get chat messages from.
    * @type {websocket}
    */
    this._socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
   /**
    * Name of user.
    * @type {string}
    */
    this._userName = 'test'
   /**
    * Web element that make up text box to write messages in.
    * @type {webelement}
    */
    this._textarea = ''
   /**
    * Web element that make up box where messages are displayed.
    * @type {webelement}
    */
    this._messageDiv = ''
   /**
    * Web element button that will start chat.
    * @type {webelement}
    */
    this._startButton = ''
   /**
    * Web element button that will send messages.
    * @type {webelement}
    */
    this._sendMessageBtn = ''
   /**
    * If user visited set user name menu.
    * @type {boolean}
    */
    this._didEnterUsername = false
   /**
    * If user started the chat.
    * @type {boolean}
    */
    this._didStartChat = false
    /**
    * Web element in main menu that give option to change name.
    * @type {webelement}
    */
    this._changeNameOption = ''
    /**
    * How many messages are currently displayed.
    * @type {int}
    */
    this._messageCount = 0
    /**
    * Web element button that will reload chat conversations.
    * @type {webelement}
    */
    this._reloadBtn = ''
  }
  /**
   * Watches the custom attritbutes data-start.
   * @readonly
   * @static
   * @memberof ChatApp
   */
  static get observedAttributes () {
    return ['data-start']
  }
  /**
   * Called by the browser engine when an attribute changes. Will initialize the
   * chat after username is set.
   * @param {any} name
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof ChatApp
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data-start') {
      this._didStartChat = true
      this._startChat()
    }
  }
  /**
   * Called when this custom element is added to the DOM.
   * @memberof ChatApp
   */
  connectedCallback () {
    // if username is not set, enter a username. Else start chat.
    this._customMenuOptionChangeName()
    if (window.localStorage.getItem('chat-username') === null) {
      this._newUsername()
    } else {
      this._userName = window.localStorage.getItem('chat-username')
      this.setAttribute('data-start', 'started')
    }
  }
  /**
   * Called when this element is removed from the DOM, removing eventlisteners.
   *
   * @memberof ChatApp
   */
  disconnectedCallback () {
    if (this._didEnterUsername) {
      this._startButton.removeEventListener('click', this._onClickStartButton)
    }
    if (this._didStartChat) {
      this._sendMessageBtn.removeEventListener('click', this._onSendMessageBtn)
      this._socket.removeEventListener('message', this._recieveMessage)
      this._reloadBtn.removeEventListener('click', this._onReload)
    }
    this._changeNameOption.removeEventListener('click', this._onClickOption)
  }
  /**
   * Let the user set his username and store it in local storage.
   *
   * @memberof ChatApp
   */
  _newUsername () {
    this.shadowRoot.appendChild(chatStartTemplate.content.cloneNode(true))
    this.shadowRoot.querySelector('#playername').focus()
    this._onClickStartButton = e => {
      e.preventDefault()
      if (this.shadowRoot.querySelector('#playername').value === '') {
        let pInvalid = this.shadowRoot.querySelector('#invaliduser')
        pInvalid.innerText = ''
        pInvalid.innerText = '*Enter a username'
        return
      }
      this._userName = this.shadowRoot.querySelector('#playername').value
      window.localStorage.setItem('chat-username', this._userName)
      let form = this.shadowRoot.querySelector('form')
      this.shadowRoot.removeChild(form)
      this.setAttribute('data-start', 'started')
    }
    this._startButton = this.shadowRoot.querySelector('#start')
    this._startButton.addEventListener('click', this._onClickStartButton)
  }
  /**
   * Initialize the chat.
   *
   * @memberof ChatApp
   */
  _startChat () {
    this.shadowRoot.appendChild(chatTemplate.content.cloneNode(true))
    this._messageDiv = this.shadowRoot.querySelector('#messages')
    this._textarea = this.shadowRoot.querySelector('#text')
    this._sendMessageBtn = this.shadowRoot.querySelector('#send')
    this._reloadBtn = this.shadowRoot.querySelector('#reload')

    this._onReload = e => {
      this._reloadHistory()
    }
    this._onSendMessageBtn = e => {
      this._postMessage(e)
    }
    this._recieveMessage = e => {
      this._getMessage(e)
    }

    this._reloadBtn.addEventListener('click', this._onReload)
    this._sendMessageBtn.addEventListener('click', this._onSendMessageBtn)
    this._socket.addEventListener('message', this._recieveMessage)
  }
  /**
   * Post message to server.
   * @param {any} event
   * @memberof ChatApp
   */
  _postMessage (event) {
    let data = {
      type: 'message',
      data: this._textarea.value,
      username: this._userName,
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this._socket.send(JSON.stringify(data))

    this._textarea.value = ''
  }
  /**
   * Get message from server and present in chat box.
   * @param {any} event
   * @memberof ChatApp
   */
  _getMessage (event) {
    let data = JSON.parse(event.data)

    let chatHistory = JSON.parse(window.localStorage.getItem('chat-history')) || []
    chatHistory.unshift(data)
    window.localStorage.setItem('chat-history', JSON.stringify(chatHistory))

    let recieveNode = this.shadowRoot.querySelector('#template-recieve')
    let recieveMsg = document.importNode(recieveNode.content, true)
    let msg = recieveMsg.querySelector('#msg')
    let user = recieveMsg.querySelector('#user')

    msg.innerText = data.data
    user.innerText = data.username

    if (data.username === this._userName) {
      let msgDiv = recieveMsg.querySelector('#msgdiv')
      msgDiv.classList.add('send-msg')
      msgDiv.classList.remove('recieve-msg')
      this._messageDiv.appendChild(recieveMsg)
    } else {
      this._messageDiv.appendChild(recieveMsg)
    }
    this._messageCount = this._messageDiv.childElementCount
  }
  /**
   * Relaod the chat history
   * @memberof ChatApp
   */
  _reloadHistory () {
    let chatHistory = JSON.parse(window.localStorage.getItem('chat-history')) || []
    if (chatHistory.length === this._messageCount) return
    let reloadLength = 5 + this._messageCount
    if (chatHistory.length - this._messageCount < 5) {
      reloadLength = chatHistory.length
    }
    for (let i = this._messageCount; i < reloadLength; i++) {
      let recieveNode = this.shadowRoot.querySelector('#template-recieve')
      let recieveMsg = document.importNode(recieveNode.content, true)
      let msg = recieveMsg.querySelector('#msg')
      let user = recieveMsg.querySelector('#user')
      msg.innerText = chatHistory[i].data
      user.innerText = chatHistory[i].username

      if (chatHistory[i].username === this._userName) {
        let msgDiv = recieveMsg.querySelector('#msgdiv')
        msgDiv.classList.add('send-msg')
        msgDiv.classList.remove('recieve-msg')
        this._messageDiv.insertBefore(recieveMsg, this._messageDiv.firstElementChild)
      } else {
        this._messageDiv.insertBefore(recieveMsg, this._messageDiv.firstElementChild)
      }
    }
    this._messageCount = this._messageDiv.childElementCount
  }
  /**
   * Add option in main menu to rename chat user.
   * @param {any} event
   * @memberof ChatApp
   */
  _customMenuOptionChangeName (e) {
    if (!this.parentElement.tagName === 'DRAGGABLE-WINDOW') return
    let menu = this.parentElement.querySelector('.mainmenu')
    this._changeNameOption = document.createElement('a')
    this._changeNameOption.setAttribute('id', 'changename')
    this._changeNameOption.innerText = 'change name'
    if (menu.firstElementChild.getAttribute('id') === this._changeNameOption.getAttribute('id')) {
      menu.removeChild(menu.firstElementChild)
    }
    menu.insertBefore(this._changeNameOption, menu.firstElementChild)
    this._onClickOption = (e) => {
      e.preventDefault()
      window.localStorage.removeItem('chat-username')
      let appType = this.tagName
      let newApp = document.createElement(appType)
      this.parentElement.appendChild(newApp)
      this.parentElement.removeChild(this)
    }
    this._changeNameOption.addEventListener('click', this._onClickOption)
  }
}

window.customElements.define('chat-app', ChatApp)

module.exports = ChatApp
