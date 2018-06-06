/**
 * @module src/applications/memory/js/Highscore
 * Module that stores highscore in localstorage object.
 * @author Jesper Hägglund
 * @version 1.11
 */

 /**
 * Represents highscore item to be stored in window.localstorage.
 * @constructor
 */
function HighScore (item, player, score) {
  /**
  * key to the item in the localstorage where the highscores will be stored.
  *
  * @type {string}
  */
  this.item = item
  /**
  * player name.
  *
  * @type {string}
  */
  this.player = player
  /**
  * score of the player.
  *
  * @type {string}
  */
  this.score = score
}

/**
 * Adds a new score to localstorage
 */
HighScore.prototype.addToStorage = function () {
  let highscores = JSON.parse(window.localStorage.getItem(this.item)) || []

  let newScore = {player: this.player, score: this.score}

  highscores.push(newScore)

  window.localStorage.setItem(this.item, JSON.stringify(highscores))
}

/**
 * Sort the scores with the highest score first.
 */
HighScore.prototype.sortByScore = function () {
  let highscores = JSON.parse(window.localStorage.getItem(this.item))

  highscores = highscores.sort((a, b) => {
    return a.score - b.score
  })

  highscores.reverse()

  window.localStorage.setItem(this.item, JSON.stringify(highscores))
}

module.exports = HighScore
