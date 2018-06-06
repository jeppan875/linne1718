let color = ['red', 'red', 'red', 'blue', 'blue', 'blue', 'yellow', 'yellow', 'yellow']
let colorToClickDiv = document.querySelector('#colorToClick')
// set the random color the player have to click
let spanColor = document.createElement('span')
spanColor.innerText = color[Math.floor((Math.random() * color.length) + 0)]
colorToClickDiv.appendChild(spanColor)
let correctClick = 0

let timer = document.querySelector('#time')
timer.innerText = 11
let time = parseInt(timer.innerText)
setInterval(() => {
  if (time < 1) return
  if (correctClick === 3) return
  time--
  timer.innerText = time
}, 1000)

let bricks = document.querySelectorAll('#board *')
bricks.forEach(function (element) {
  let rnd = Math.floor((Math.random() * color.length) + 0)
  element.classList.add(color[rnd])
  element.addEventListener('click', event => {
    if (element.classList[3] === spanColor.innerText) {
      element.classList.remove(spanColor.innerText)
      correctClick++
    }
  })
  color.splice(rnd, 1)
})
