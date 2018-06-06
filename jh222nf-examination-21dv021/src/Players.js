/**
 * @module src/Players
 * Module that helps create a list of players.
 * @author Jesper Hägglund
 * @version 1.11
 */

'use strict'

 /**
 * Represents list of players.
 * @constructor
 */
function Players () {
    /**
    * a list of players that gets defined as an array of names from a function.
    *
    * @type {undefined}
    */
  this.players = undefined
}

/**
 * Creates and returns an array of player names
 *
 * @param {string} arguments that represent name of players.
 * @throws {TypeError} The argument list must contain only strings or left empty.
 * @returns {string[]} list of player names.
 */
Players.prototype.createPlayers = function () {
  for (let i = 0; i < arguments.length; i++) {
    if (typeof (arguments[i]) !== 'string') {
      throw new TypeError('The passed arguments must be a string or left empty.')
    }
  }
  this.players = []
  if (arguments.length === 0) {
    this.players.push('player')
  } else {
    for (let i = 0; i < arguments.length; i++) {
      this.players.push(arguments[i])
    }
  }
  return this.players
}
/**
 * returns an array of player names
 *
 * @returns {string[]} list of player names.
 */
Players.prototype.getPlayers = function () {
  return this.players
}

// Exports.
module.exports = Players
