require('./question-box')
const responses = require('./responses')

let body = document.querySelector('body')
let player = ''
let totalTime = 0
// Start of application
addPlayer()
body.addEventListener('startgame', function startGame (e) {
  player = e.detail
  quiz('http://vhost3.lnu.se:20080/question/1')
  body.removeEventListener('startgame', startGame)
})
// Adds the time it takes to answer each question
body.addEventListener('timeleft', timeLeft)
function timeLeft (e) {
  totalTime += parseInt(e.detail)
}
// functon the quiz runs in
function quiz (URL) {
  responses.fetcthQuestion(URL).then(function (data) {
    qBox(data)
  })
}
// adds the player for the round
function addPlayer () {
  let playerDiv = document.createElement('div')
  let body = document.querySelector('body')
  playerDiv.classList.add('quiz-box')
  body.appendChild(playerDiv)

  playerDiv = document.querySelector('div')
  let p = document.createElement('p')
  p.innerText = 'Enter your player name:'
  playerDiv.appendChild(p)

  let input = document.createElement('input')
  playerDiv.appendChild(input)

  let button = document.createElement('button')
  button.innerText = 'start game'
  playerDiv.appendChild(button)

  button.addEventListener('click', () => {
    body.removeChild(playerDiv)
    let player = input.value
    body.dispatchEvent(new window.CustomEvent('startgame', {detail: player}))
  })
}
// displays and handles the quiz-boxes
function qBox (data) {
  let quizDiv = document.createElement('div')
  let body = document.querySelector('body')
  body.appendChild(quizDiv)
  quizDiv.classList.add('quiz-box')
  // set the countdown and handle timeout event
  let timer = document.createElement('p')
  timer.setAttribute('id', 'timer')
  quizDiv.appendChild(timer)
  timer.innerText = '20'
  let time = parseInt(timer.innerText)
  let interval = setInterval(() => {
    if (time === 0) {
      body.removeChild(quizDiv)
      let lost = document.createElement('div')
      lost.classList.add('quiz-box')
      body.appendChild(lost)
      let p = document.createElement('p')
      p.innerText = 'Times up!'
      lost.appendChild(p)
      clearInterval(interval)

      let button = document.createElement('button')
      button.innerText = 'Try again!'
      lost.appendChild(button)
      button.addEventListener('click', () => {
        window.location.reload()
      })
      body.removeEventListener('timeleft', timeLeft)
    }
    time--
    timer.innerText = time
  }, 1000)
  // Add the question to the page
  let p = document.createElement('p')
  p.innerText = data.question
  quizDiv.appendChild(p)
  let input = null
  // create radio buttons or input field depending on data
  if ('alternatives' in data) {
    Object.keys(data.alternatives).forEach(key => {
      let alternatives = document.createElement('div')
      quizDiv.appendChild(alternatives)
      let input = document.createElement('input')
      input.setAttribute('type', 'radio')
      input.setAttribute('id', key)
      input.setAttribute('name', 'quiz')
      input.setAttribute('value', key)
      alternatives.appendChild(input)

      let label = document.createElement('label')
      label.setAttribute('for', key)
      label.innerText = data.alternatives[key]
      alternatives.appendChild(label)
    })
  } else {
    input = document.createElement('input')
    quizDiv.appendChild(input)
  }

  let button = document.createElement('button')
  button.innerText = 'send answer'
  quizDiv.appendChild(button)

  button.addEventListener('click', () => {
    let answer
    // gets value needed for next url
    if ('alternatives' in data) {
      answer = {
        answer: document.querySelector('input[name="quiz"]:checked').value
      }
    } else {
      answer = {
        answer: input.value
      }
    }
    // fetches next question
    responses.fetcthAnswer(data.nextURL, answer).then(data => {
      if (data.message === 'Wrong answer! :(') {
        body.removeChild(quizDiv)
        let lost = document.createElement('div')
        lost.classList.add('quiz-box')
        body.appendChild(lost)
        let p = document.createElement('p')
        p.innerText = 'you lost!'
        lost.appendChild(p)
        clearInterval(interval)

        let button = document.createElement('button')
        button.innerText = 'Try again!'
        lost.appendChild(button)
        button.addEventListener('click', () => {
          window.location.reload()
        })
        body.removeEventListener('timeleft', timeLeft)
        return
      }

      if (data.message === 'Correct answer!' && data.nextURL === undefined) {
        let timeToAnswer = 20 - time
        body.dispatchEvent(new window.CustomEvent('timeleft', {detail: timeToAnswer}))
        body.removeChild(quizDiv)
        clearInterval(interval)
        body.dispatchEvent(new window.CustomEvent('endgame'))
        return
      }
      responses.fetcthQuestion(data.nextURL).then(data => {
        let timeToAnswer = 20 - time
        body.dispatchEvent(new window.CustomEvent('timeleft', {detail: timeToAnswer}))
        clearInterval(interval)
        body.removeChild(quizDiv)
        qBox(data)
      })
    })
  })
}
// Handle end game presentation of highscore list
body.addEventListener('endgame', function endGame () {
  let highScoreBoard = document.createElement('div')
  let body = document.querySelector('body')
  highScoreBoard.classList.add('quiz-box')
  body.appendChild(highScoreBoard)

  let p = document.createElement('p')
  p.innerText = `you win with a total time of: ${totalTime} sec`
  highScoreBoard.appendChild(p)

  let pHighScore = document.createElement('p')
  pHighScore.innerText = `HIGH SCORE`
  highScoreBoard.appendChild(pHighScore)

  window.localStorage.setItem(player, totalTime)
  window.localStorage.removeItem('loglevel:webpack-dev-server')
  let highScores = []
  Object.keys(window.localStorage).forEach(key => {
    highScores.push({name: key, time: parseInt(window.localStorage[key])})
  })
  highScores = highScores.sort((a, b) => {
    return a.time - b.time
  })
  let highScoreLength = 0
  if (highScores.length < 5) {
    highScoreLength = highScores.length
  } else {
    highScoreLength = 5
  }
  for (let i = 0; i < highScoreLength; i++) {
    let p = document.createElement('p')
    p.innerText = `${highScores[i].name}: ${highScores[i].time}`
    highScoreBoard.appendChild(p)
  }
  body.removeEventListener('endgame', endGame)
  body.removeEventListener('timeleft', timeLeft)
})
