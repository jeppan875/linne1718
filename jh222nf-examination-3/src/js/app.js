require('../applications/memory/js/memory-game')
require('../applications/chatapp/js/chat-app')
require('../applications/fruitslots/js/fruit-slots')
require('../applications/weatherapp/js/weather-app')
const WebDesktop = require('./WebDesktop')

let wd = new WebDesktop()

let main = document.querySelector('main')
let footer = document.querySelector('footer')

footer.addEventListener('click', e => {
  e.preventDefault()
  wd.openApp(main, e)
})

main.addEventListener('mousedown', e => {
  wd.focusWindow(e)
})
