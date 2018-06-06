const mainbarTemplate = document.createElement('template')
mainbarTemplate.innerHTML = `
    <div class="mainbar">
        <a><img class="faviIcon"></a>
        <span><a class="quit">X</a></span>
        <span><a class="minimize">_</a></span>
    </div>
    <div class="mainmenu">
    <a class="restart">restart</a>
    <a class="exit">exit</a>
    </div> 
`
/**
 * A web element main bar that can be attached to a web element.
 *
 * @class MainBar
 * @extends {window.HTMLElement}
 */
class MainBar extends window.HTMLElement {
  constructor () {
    super()
   /**
    * Web element button that will close "window".
    * @type {webelement}
    */
    this._quit = ''
   /**
    * Web element button that will minimize "window".
    * @type {webelement}
    */
    this._minimize = ''
   /**
    * Web element image that acts as a favi icon.
    * @type {webelement}
    */
    this._faviIcon = ''
   /**
    * Web element that represent a menu drop down.
    * @type {webelement}
    */
    this._mainmenu = ''
   /**
    * Web element that represent a menu drop down option exit app.
    * @type {webelement}
    */
    this._exit = ''
   /**
    * Web element that represent a menu drop down restart app.
    * @type {webelement}
    */
    this._restart = ''
  }
  /**
   * Called when this custom element is added to the DOM.
   * @memberof MainBar
   */
  connectedCallback () {
    this.appendChild(mainbarTemplate.content.cloneNode(true))

    this._addAppIcon()
    this._quit = this.querySelector('.quit')
    this._minimize = this.querySelector('.minimize')

    this._faviIcon = this.querySelector('.faviIcon')
    this._mainmenu = this.querySelector('.mainmenu')
    this._mainmenu.classList.add('hidden')
    this._exit = this.querySelector('.exit')
    this._restart = this.querySelector('.restart')

    this._onQuit = e => {
      this._closeWindow()
    }
    this._onRestart = () => {
      this._restartApp()
    }
    this._onMinimize = e => {
      this._minimizeWindow()
    }
    this._onOpenMainMenu = event => {
      this._openMainMenu(event)
    }
    this._onCloseMainMenu = event => {
      this._closeMainMenu()
    }

    this._restart.addEventListener('click', this._onRestart)
    this.parentElement.addEventListener('click', this._onCloseMainMenu)
    this._faviIcon.addEventListener('click', this._onOpenMainMenu)
    this._quit.addEventListener('click', this._onQuit)
    this._exit.addEventListener('click', this._onQuit)
    this._minimize.addEventListener('click', this._onMinimize)
  }
  /**
   * Called when this element is removed from the DOM, removing eventlisteners.
   *
   * @memberof MainBar
   */
  disconnectedCallback () {
    this._restart.removeEventListener('click', this._onRestart)
    this.parentElement.removeEventListener('click', this._onCloseMainMenu)
    this._faviIcon.removeEventListener('click', this._onOpenMainMenu)
    this._exit.removeEventListener('click', this._onQuit)
    this._quit.removeEventListener('click', this._onQuit)
    this._minimize.removeEventListener('click', this._onMinimize)
  }
  /**
   * Close "app" window.
   *
   * @memberof MainBar
   */
  _closeWindow () {
    this.parentElement.parentElement.removeChild(this.parentElement)
  }
  /**
   * Reveal hidden mainmenu dropdown.
   *
   * @memberof MainBar
   */
  _openMainMenu (e) {
    e.stopPropagation()
    this._mainmenu.classList.remove('hidden')
  }
  /**
   * Restart "app".
   *
   * @memberof MainBar
   */
  _restartApp () {
    let appType = this.nextElementSibling.tagName
    let newApp = document.createElement(appType)
    this.parentElement.removeChild(this.nextElementSibling)
    this.parentElement.appendChild(newApp)
  }
  /**
   * Hide mainmenu dropdown.
   *
   * @memberof MainBar
   */
  _closeMainMenu () {
    if (!this._mainmenu.classList.contains('hidden')) {
      this._mainmenu.classList.add('hidden')
    }
  }
  /**
   * Add favi icon to mainbar.
   *
   * @memberof MainBar
   */
  _addAppIcon () {
    setTimeout(() => {
      if (this.nextElementSibling === undefined) return
      this._faviIcon = this.querySelector('.faviIcon')
      this._faviIcon.setAttribute('src', `./image/appImage/${this.nextElementSibling.tagName.toLowerCase()}.png`)
    }, 0)
  }
  /**
   * minimize the window mainbar is part of.
   *
   * @memberof MainBar
   */
  _minimizeWindow () {
    let appId = this.parentElement.getAttribute('id')
    let appType = this.nextElementSibling.tagName.toLowerCase()
    let header = document.querySelector('header')

    let tab = document.createElement('a')
    let img = document.createElement('img')
    tab.appendChild(img)

    tab.setAttribute('id', `${appId}h`)

    let tabImg = tab.querySelector('img')
    tabImg.setAttribute('src', `./image/appImage/${appType}.png`)
    header.appendChild(tab)

    this.parentElement.classList.add('hidden')
    tab.addEventListener('click', () => {
      this.parentElement.classList.remove('hidden')
      header.removeChild(document.querySelector(`#${appId}h`))
    })
  }
}
window.customElements.define('main-bar', MainBar)

module.exports = MainBar
