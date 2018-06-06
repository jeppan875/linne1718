const template = document.createElement('template')
template.innerHTML = `
<div class="input-field col s6">
  <input id="teamselector" type="text" list="teams">
  <label class="active" for="teamselector">Search for a team:</label>
  <datalist id="teams"></datalist>
</div>  
`

/**
 *  A autocomplete component
 *
 * @class TeamSelector
 * @extends {window.HTMLElemeny}
 */
class TeamSelector extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._input = this.shadowRoot.querySelector('#teamselector')
    this._url = 'http://localhost/api'
    this._minlength = 2
    this.teams = []
  }

  static get observedAttributes () {
    return ['src', 'minlength']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'src') {
      this._url = newValue
    } else if (name === 'minlength') {
      this._minlength = parseInt(newValue)
    }
  }

  connectedCallback () {
    this._input.addEventListener('input', async e => {
      if (this._input.value.length < this._minlength) {
        return
      }
      this.teams = await this.search(this._input.value)

      this._updateRendering()

      this.dispatchEvent(new window.CustomEvent('searchChanged', {detail: this.teams}))

      let hit = this.teams.filter(team => team.name === this._input.value).shift()
      if (hit) {
        this.dispatchEvent(new window.CustomEvent('teamselected', {detail: hit}))
        this._input.blur()
        this._input.focus()
      }
    })
  }

  async search (str) {
    let searchResult = await window.fetch(`${this._url}/teams?=${str}`)
    searchResult = await searchResult.json()
    return searchResult.teams
  }

  _updateRendering () {
    const datalist = this.shadowRoot.querySelector('#teams')
    datalist.innerHTML = ''

    for (let team of this.teams) {
      let option = document.createElement('option')
      option.setAttribute('value', team.name)
      datalist.appendChild(option)
    }
  }
}

// Registers the custom element
window.customElements.define('team-selector', TeamSelector)
