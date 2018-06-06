const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    background:#000000;
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
<p id="question"></p>
<input id="answer" type="text" placeholder="Answer here"></input>
<br>
<button id="submit">Send answer</button>
`
class QuestionBox extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._p = this.shadowRoot.querySelector('#question')
    this.input = this.shadowRoot.querySelector('#answer')
    this.button = this.shadowRoot.querySelector('#submit')
    this._question = 'question'
    // this._answer = ''
  }
  static get observedAttributes () {
    return ['question'] // , 'answer'
  }
  // if any changes happens in observedAttributes then this method is called
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'question') {
      this._question = newValue
    } /* else if (name === 'answer') {
      this._answer = newValue
    } */
  }
  connectedCallback () {
    this._p.innerText = this._question
    // this.input = this._answer
  }
}

window.customElements.define('question-box', QuestionBox)

module.exports = QuestionBox
