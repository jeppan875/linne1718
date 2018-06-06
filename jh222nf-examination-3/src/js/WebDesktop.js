require('./draggable-window')

function WebDesktop () {
  /**
  * give an id number to a web element.
  *
  * @type {int}
  */
  this.currentId = 0
  /**
  * current z-index. Defines what next z-index a new element will have.
  *
  * @type {int}
  */
  this.zIndex = 0
  /**
  * the px where a new window will appear.
  *
  * @type {int}
  */
  this.currentPX = 0
  /**
  * the px the next window will get after it "bounces the floor".
  *
  * @type {int}
  */
  this.extraLeftPX = 0
}
/**
 * Opens a new app inside a draggable window
 * @param {any} webElement that a new window will be created in.
 * @param {any} event
 */
WebDesktop.prototype.openApp = function (webElement, event) {
  if (event.target.getAttribute('id') === null) return
  let draggableWindow = document.createElement('draggable-window')
  draggableWindow.classList.add('draggable-window')
  webElement.appendChild(draggableWindow)
  let appId = event.target.getAttribute('id')
  let app = document.createElement(appId)
  draggableWindow.setAttribute('id', appId + this.currentId)

  this._positionXYNewWindow(draggableWindow)

  this.zIndex++
  draggableWindow.style.zIndex = this.zIndex
  draggableWindow.appendChild(app)
  this.currentId++
  this.currentPX++
}
/**
 * Positions a newly created window
 * @param {any} webElement which will be positioned.
 */
WebDesktop.prototype._positionXYNewWindow = function (webElement) {
  let nextWindowTop = 15 * this.currentPX
  if (nextWindowTop > window.innerHeight - webElement.offsetHeight) {
    this.currentPX = 0
    this.extraLeftPX += 200
    nextWindowTop = 15 * this.currentPX
  }

  let nextWindowLeft = 15 * this.currentPX + 1 * this.extraLeftPX
  if (nextWindowLeft > window.innerWidth - webElement.offsetWidth) {
    this.currentPX = 0
    this.extraLeftPX = 0
    nextWindowLeft = 15 * this.currentPX
  }

  webElement.style.top = nextWindowTop + 50 + 'px'
  webElement.style.left = nextWindowLeft + 'px'
}
/**
 * Puts new window on top of other windows
 * @param {any} event
 */
WebDesktop.prototype.focusWindow = function (event) {
  this.zIndex++
  let id = event.target.parentNode.getAttribute('id')
  if (id === null) return
  document.querySelector('#' + id).style.zIndex = this.zIndex
}

module.exports = WebDesktop
