/* Here we create an html template to attach to the shadow dom. :Host will refer
to the bartboard, in the <p> tag at the bottom we could add a default text */
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    background:#002418;
    font-size: 1.2em;
    color:white;
    width:500px;
    height:200px;
    padding:10px;
    border:6px solid #9b3b00;
    border-bottom:12px solid #9b3b00;
    overflow:hidden;
    margin:10px;
    float:left;
    border-radius: 3px;
 }

 p {
   margin: 0;
   padding: 0;  
 }
</style>

<p id ='text'></p>
`
// We extend the html, dont need to write window before, only in standard.js
class BartBoard extends window.HTMLElement {
  constructor () {
    // calls the html constructor
    super()
    /* tells the browser we attach a shadow dom to the object.
    when using shadowdom attributes will not be added to the element
    that are not visible in the html code but are visible when inspecting
    in the browser, this can be confusing. Add <video><video/> and inspect for example.
    It has a shadowdom. */
    this.attachShadow({mode: 'open'})
    //  append our html template to our shadow dom, use true for a deep copy to get all elements and their content
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    // This._p refers to p in shadowdom
    this._p = this.shadowRoot.querySelector('#text')
    this._intervalID = null
    this._letter = 0
    // set some default values if no attribute is set
    this._text = 'Låt stå!'
    this._speed = 50
  }
  // tells the browser to observe changes in these attributes
  static get observedAttributes () {
    return ['text', 'speed']
  }
  // if any changes happens in observedAttributes then this method is called
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'text') {
      this._text = newValue
    } else if (name === 'speed') {
      this._speed = newValue
    }
  }
  // Connectedcallback is always called when a new element is added to the dom.
  // not good using dom-api in constructor so better use them here
  connectedCallback () {
    this.addEventListener('mousedown', this._onWrite)
    this.addEventListener('mouseup', this.stopWriting)
    this.addEventListener('mouseleave', this.stopWriting)
  }
  // removes our eventlisteners so they dont use up memory, most browser now days do it automatically
  disconnectedCallback () {
    this.removeEventListener('mousedown', this._onWrite)
    this.removeEventListener('mouseup', this.stopWriting)
    this.removeEventListener('mouseleave', this.stopWriting)
    this.stopWriting()
    // return
  }
  // the browser adds an event to this function when its called
  _onWrite (event) {
    this._intervalID = setInterval(() => {
      // stop writing when the p element in the shadow dom overflows the blackboard, see html template style for height values
      if (this._p.offsetHeight >= this.offsetHeight) {
        // we create a custom event that is dispatched, this event is called filled, see in app.js how it is used
        this.dispatchEvent(new window.CustomEvent('filled'))
        this.stopWriting()
        return
      }
      /* adds one letter at a time. We will use textContent instead of innerText on this._p otherwise the spaces dissapear,
       innertext is much more resource heavy since it requires the dom to rerender. Make letter return to zero when text.length
        is reached. Add space at the end. */
      this._p.textContent += this._text.charAt(this._letter++)
      if (this._letter >= this._text.length) {
        this._p.textContent += ' '
        this._letter = 0
      }
    }, this._speed)
  }
  // if we dont call this in our connectivecallback it wont stop write after we let go of mouse button or if the cursor leaves the bart board
  stopWriting () {
    clearTimeout(this._intervalID)
  }

  wipeBoard () {
    this._p.textContent = ''
    this._letter = 0
  }
}

/* need to define a new element to extend the browser. Name it bart-board( name convention need to be xxx-xxx)
 and comnect with our class BartBoard. The file should be named bart-board.js aswell. Now you can create
  bart-board with js usin createElement or put directly in html code <bart-board></bart-board> */
window.customElements.define('bart-board', BartBoard)

module.exports = BartBoard
