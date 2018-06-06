
const mainbarTemplate = document.createElement('template')
mainbarTemplate.innerHTML = `
<head>
<link rel="stylesheet" href="./applications/weatherapp/css/main.css"/>
</head>
    <div class="dropdownDiv">
    <select name="dropdown-location" class="dropdown">
      <option value="_stockholm">Stockholm</option>
      <option value="_gothenburg">Göteborg</option>
      <option value="_malmo">Malmö</option>
    </select>
    <select name="dropdown-time" class="dropdowntime">
    </select>
    </div>
      <img id="weather">
      <p id="temperature"></p>
`
/**
 * A web element that present weather reports in different cities.
 *
 * @class WeatherApp
 * @extends {window.HTMLElement}
 */
class WeatherApp extends window.HTMLElement {
  constructor () {
    super()
   /**
    * Attach shadow dom to this web element.
    * @type {function}
    */
    this.attachShadow({mode: 'open'})
   /**
    * URL to retrieve weather data from.
    * @type {string}
    */
    this._url = ''
   /**
    * Array with objects that represent different weather conditions
    * @type {array}
    */
    this._weatherConditions = [
      {condition: 'clear', values: [1, 2]},
      {condition: 'partlycloudy', values: [3, 4]},
      {condition: 'cloudy', values: [5, 6]},
      {condition: 'fog', values: [7]},
      {condition: 'rainshowers', values: [8, 9, 10]},
      {condition: 'thunder', values: [11, 21]},
      {condition: 'rain', values: [18, 19, 20]},
      {condition: 'snowrain', values: [12, 13, 14, 15, 16, 17, 22, 23, 24]},
      {condition: 'snow', values: [25, 26, 27]}
    ]
   /**
    * Latitude and longitude of a weather station
    * @type {object}
    */
    this._stockholm = {lat: 59.319364, lon: 18.021726}
   /**
    * Latitude and longitude of a weather station
    * @type {object}
    */
    this._gothenburg = {lat: 57.716778, lon: 11.979168}
   /**
    * Latitude and longitude of a weather station
    * @type {object}
    */
    this._malmo = {lat: 55.585096, lon: 12.991592}
   /**
    * How many succesful loadings of weather data
    * @type {int}
    */
    this._loadedCount = 0
   /**
    * Current location of weather being displayed
    * @type {object}
    */
    this._currentLocation = ''
   /**
    * Current time of weather information being displayed
    * @type {int}
    */
    this._currentTimeIndex = 0
   /**
    * Current weather reference from data
    * @type {int}
    */
    this._currentWeather = ''
   /**
    * Current temperature at location
    * @type {int}
    */
    this._currentTemperature = ''
    /**
    * dropdown list of location to get weather from
    * @type {webelement}
    */
    this._dropdownLocation = ''
    /**
    * dropdown list of time to get weather from
    * @type {webelement}
    */
    this._dropdownTime = ''
  }

  /**
   * Watches the custom attritbutes data-loaded.
   * @readonly
   * @static
   * @memberof WeatherApp
   */
  static get observedAttributes () {
    return ['data-loaded']
  }

  /**
   * Called by the browser engine when an attribute changes. Data-loaded are set
   * when all weather data been loaded
   * @param {any} name
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof WeatherApp
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data-loaded') {
      let img = this.shadowRoot.querySelector('#weather')
      let pTemperature = this.shadowRoot.querySelector('#temperature')
      this._currentLocation = this._stockholm.data
      this._createTimeDroplist(this._currentLocation)
      this._dropdownLocation = this.shadowRoot.querySelector('.dropdown')
      this._dropdownTime = this.shadowRoot.querySelector('.dropdowntime')

      this._displayWeather = function () {
        this._getWeather(this._currentLocation, this._currentTimeIndex)
        this._currentTemperature = this._getTemperature(this._currentLocation, this._currentTimeIndex)
        pTemperature.innerText = ''
        pTemperature.innerText = `${this._currentTemperature} C`
        img.setAttribute('src', `./applications/weatherapp/images/${this._currentWeather}.jpg`)
        img.setAttribute('alt', `${this._currentWeather}`)
      }

      this._currentLocation = this[this._dropdownLocation.options[this._dropdownLocation.selectedIndex].value].data
      this._displayWeather()

      this._onChangeLocation = () => {
        this._currentLocation = this[this._dropdownLocation.options[this._dropdownLocation.selectedIndex].value].data
        this._displayWeather()
      }
      this._onChangeTime = () => {
        this._currentTimeIndex = this._dropdownTime.options[this._dropdownTime.selectedIndex].value
        this._displayWeather()
      }

      this._dropdownLocation.addEventListener('change', this._onChangeLocation)
      this._dropdownTime.addEventListener('change', this._onChangeTime)
    }
  }
  /**
   * Called when this custom element is added to the DOM.
   * Will start loading weather data.
   * @memberof WeatherApp
   */
  connectedCallback () {
    this.shadowRoot.appendChild(mainbarTemplate.content.cloneNode(true))
    this._retrieveData()
  }
  /**
   * Called when this element is removed from the DOM, removing eventlisteners.
   *
   * @memberof WeatherApp
   */
  disconnectedCallback () {
    this._dropdownLocation.removeEventListener('change', this._onChangeLocation)
    this._dropdownTime.removeEventListener('change', this._onChangeTime)
    this.removeEventListener('data-loaded', this._onLoaded)
  }
  /**
   * retrieves weatherdata to be displayed
   * @memberof WeatherApp
   */
  _retrieveData () {
    let dataLoaded = new window.CustomEvent('data-loaded')
    this._getWeatherData(this._stockholm.lon, this._stockholm.lat).then(data => {
      this._stockholm.data = data
      this.dispatchEvent(dataLoaded)
    })
    this._getWeatherData(this._gothenburg.lon, this._gothenburg.lat).then(data => {
      this._gothenburg.data = data
      this.dispatchEvent(dataLoaded)
    })
    this._getWeatherData(this._malmo.lon, this._malmo.lat).then(data => {
      this._malmo.data = data
      this.dispatchEvent(dataLoaded)
    })
    this._onLoaded = () => {
      this._loadedCount++
      if (this._loadedCount === 3) {
        this.setAttribute('data-loaded', 'loaded')
      }
    }
    this.addEventListener('data-loaded', this._onLoaded)
  }
 /**
   * Get weather data.
   * @param longitude longitude of weather station
   * @param latitude latitude of weather station
   * @return function that returns weather data
   * @memberof WeatherApp
   */
  async _getWeatherData (longitude, latitude) {
    let url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`
    return this._getResponse(url)
  }
  /**
   * Creates dropdown with times to look for weather conditions.
   *
   * @param data of times for weather reports
   * @memberof WeatherApp
   */
  _createTimeDroplist (data) {
    let dropdownTime = this.shadowRoot.querySelector('.dropdowntime')
    let i = 0
    data.timeSeries.forEach(time => {
      let option = document.createElement('option')
      option.setAttribute('value', i)
      i++
      let timeText = time.validTime
      timeText = timeText.replace('T', ' ')
      timeText = timeText.substring(0, 16)
      option.innerText = timeText
      dropdownTime.appendChild(option)
    })
  }
  /**
   * Set current weather condition
   * @param data location data
   * @param timeIndex integer that reference a time
   * @memberof WeatherApp
   */
  _getWeather (data, timeIndex) {
    let weather = data.timeSeries[timeIndex].parameters[18].values[0]
    this._weatherConditions.forEach(condition => {
      condition.values.forEach(value => {
        if (value === weather) {
          this._currentWeather = condition.condition
        }
      })
    })
  }
  /**
   * Set current weather condition
   * @param data location data
   * @param timeIndex integer that reference a time
   * @memberof WeatherApp
   */
  _getTemperature (data, timeIndex) {
    return data.timeSeries[timeIndex].parameters[11].values[0]
  }
  /**
   * Set current weather condition
   * @param URL retrieve data from
   * @return weather data
   * @memberof WeatherApp
   */
  async _getResponse (URL) {
    const response = await window.fetch(URL)
    const data = await response.json()
    return data
  }
}
window.customElements.define('weather-app', WeatherApp)

module.exports = WeatherApp
