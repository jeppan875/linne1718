/**
 * @module src/Board
 * Module that simulates the dealing of the card game 'tjugoett'.
 * @author Jesper Hägglund
 * @version 1.11
 */
'use strict'

const dealer = require('./dealer')
/**
 * Represents the board of a card game.
 *
 * @class Board
 */
class Board {
   /**
   * Creates a board instance that represents a card game.
   * @param {object} players - an object that contains an array of player names
   * @param {object} cardDeck - an object that contains an array of objects that represents cards.
   * @constructor
   */
  constructor (players, cardDeck) {
    /**
    * Array of player names.
    *
    * @type {string[]}
    */
    this.players = players
    /**
    * Array of cardobjects.
    *
    * @type {object}
    */
    this.cardDeck = cardDeck
  }
  /**
  * Returns a string that represents the dealing history of the card game 'tjugoett'.
  *
  * @returns {string} - A string that represents dealing history on a board.
  */
  deal () {
    dealer.shuffle(this.cardDeck)
    let table = ''
    let deadCards = []
    let cardsOnTable = []
    // Dealing round starts
    for (let i = 0; i < this.players.length; i++) {
      // Player get dealt first card
      let sumP = 0
      let valuesP = []
      valuesP.push(this.cardDeck[0].value)
      let handP = []
      handP.push(this.cardDeck[0].card)
      cardsOnTable.push(this.cardDeck.shift())
      // Does the card deck need to be reshuffled?
      table += dealer.reShuffle(this.cardDeck, deadCards)
      /* Player get dealt second card and then additional cards until
      the sum is equal to or more than 14 */
      do {
        valuesP.push(this.cardDeck[0].value)
        handP.push(this.cardDeck[0].card)
        cardsOnTable.push(this.cardDeck.shift())
        // Does the card deck need to be reshuffled?
        table += dealer.reShuffle(this.cardDeck, deadCards)
        // The total value of the hand
        sumP = dealer.handValue(valuesP)

        if (sumP > 21) {
          table += `${this.players[i]}:${handP.join('')} (${sumP}) BUSTED!\nDealer:----  Wins!\n\n`
          break
        }
        if (sumP === 21) {
          table += `${this.players[i]}:${handP.join('')} (${sumP}) Wins!\nDealer:----\n\n`
          break
        }
      }
      while (sumP < 15)

      // The dealer takes his cards
      let sumD = 0
      let valuesD = []
      let handD = []
      if (sumP < 21) {
        while (sumD < sumP) {
          handD.push(this.cardDeck[0].card)
          valuesD.push(this.cardDeck[0].value)
          cardsOnTable.push(this.cardDeck.shift())
          // Does the card deck need to be reshuffled?
          table += dealer.reShuffle(this.cardDeck, deadCards)
          // The total value of the hand
          sumD = dealer.handValue(valuesD)

          if (sumD > 21) {
            table += `${this.players[i]}:${handP.join('')} (${sumP}) Wins!\nDealer:${handD.join('')} (${sumD}) BUSTED!\n\n`
            break
          }
          if (sumD >= sumP) {
            table += `${this.players[i]}:${handP.join('')} (${sumP})\nDealer:${handD.join('')} (${sumD}) Wins!\n\n`
            break
          }
        }
      }
      // Putting the cards on the table in the dead cards
      while (cardsOnTable.length > 0) {
        deadCards.push(cardsOnTable.shift())
      }
    }
    return table
  }
}

// Exports.
module.exports = Board
