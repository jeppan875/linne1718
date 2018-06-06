function HighScore (item, player, score) {
  this.item = item
  this.player = player
  this.score = score
}

HighScore.prototype.addToStorage = function () {
  let highscores = JSON.parse(window.localStorage.getItem(this.item)) || []

  let score = {player: this.player, score: this.score}

  highscores.push(score)

  window.localStorage.setItem(this.item, JSON.stringify(highscores))
}

HighScore.prototype.sortByScore = function () {
  let highscores = JSON.parse(window.localStorage.getItem(this.item))

  highscores.sort((a, b) => {
    return a.score - b.score
  })
  highscores.forEach(element => {
    console.log(element.score)
  })
}
module.exports = HighScore
