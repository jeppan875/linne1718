require('./main-bar')
/**
 * A web element that work as a window that can be dragged by changing its absolute position.
 *
 * @class DraggableWindow
 * @extends {window.HTMLElement}
 */
class DraggableWindow extends window.HTMLElement {
  constructor () {
    super()
   /**
    * Position of elements left corners x-axis.
    * @type {int}
    */
    this.x = 0
   /**
    * Position of elements left corners y-axis.
    * @type {int}
    */
    this.y = 0
  }
  /**
   * Called when this custom element is added to the DOM.
   * @memberof DraggableWindow
   */
  connectedCallback () {
    let mainBar = document.createElement('main-bar')
    this.appendChild(mainBar)
    this.setAttribute('draggable', 'true')

    this._onDrag = event => {
      this._drag()
    }
    this._onDragStart = event => {
      this._dragStart(event)
    }
    this._onDragEnd = event => {
      this._dragEnd(event)
    }

    this.addEventListener('drag', this._onDrag)
    this.addEventListener('dragstart', this._onDragStart)
    this.addEventListener('dragend', this._onDragEnd)
  }
  /**
   * Called when this element is removed from the DOM, removing eventlisteners.
   *
   * @memberof DraggableWindow
   */
  disconnectedCallback () {
    this.removeEventListener('drag', this._onDrag)
    this.removeEventListener('dragstart', this._onDragStart)
    this.removeEventListener('dragend', this._onDragEnd)
  }
  /**
   * Style of old position of element while its being dragged.
   *
   * @memberof DraggableWindow
   */
  _drag () {
    this.style.opacity = 0
  }
  /**
   * Style of element while its being dragged.
   *
   * @memberof DraggableWindow
   */
  _dragStart (event) {
    this.x = event.clientX - this.offsetLeft
    this.y = event.clientY - this.offsetTop
    this.style.opacity = 0.5
  }
 /**
   * Position of element when drag is finished.
   *
   * @memberof DraggableWindow
   */
  _dragEnd (event) {
    this.style.opacity = 1
    let top = event.clientY - this.y
    let left = event.clientX - this.x
    if (top > window.innerHeight - this.offsetTop) {
      top = window.innerHeight - this.offsetTop
    } else if (top < -100) {
      top = 0 - this.offsetTop
    }
    this.style.top = top + 'px'
    if (left > window.innerWidth - this.offsetLeft || left < -100) { return }
    this.style.left = left + 'px'
  }
}
window.customElements.define('draggable-window', DraggableWindow)

module.exports = DraggableWindow
