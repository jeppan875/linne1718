/**
 * @module src/Dealer
 * Module that represent action a dealer do at a card game.
 * @author Jesper Hägglund
 * @version 1.11
 */

'use strict'
/**
 * Shuffles an array to simulate a card deck that gets shuffled
 *
 * @param {array} array The array whose values will be shuffled.
 * @throws {TypeError} The argument must be an array.
 * @returns {array} Array that have been shuffled.
 */
function shuffle (array) {
  if (!Array.isArray(array)) {
    throw new TypeError('The passed argument is not an array.')
  }
  let m = array.length
  let t
  let i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
/**
 * Reshuffles a card deck with the dead cards when card deck has one more card
 *
 * @param {object[]} cardDeck array of cards that will be refilled and reshuffled.
 * @param {object[]} deadCards array of cards that will populate the deck that gets shuffled.
 * @throws {TypeError} The argument must be an array.
 * @returns {string} Add to what actions took place at the table
 */
function reShuffle (cardDeck, deadCards) {
  if (!Array.isArray(cardDeck)) {
    throw new TypeError('The passed argument is not an array.')
  }
  if (!Array.isArray(deadCards)) {
    throw new TypeError('The passed argument is not an array.')
  }
  if (cardDeck.length === 1) {
    while (deadCards.length > 0) {
      cardDeck.push(deadCards.shift())
    }
    shuffle(cardDeck)
    return '--- DEALER SHUFFLES ---\n\n'
  } else {
    return ''
  }
}
/**
 * Gives the total value of a hand and channge ace values if neccessary
 *
 * @param {string[]} hand array of string representation of cards.
 * @throws {TypeError} The argument must be an array containing only numbers.
 */
function handValue (hand) {
  for (let i = 0; i < hand.length; i++) {
    if (typeof (hand[i]) !== 'number') {
      throw new TypeError('The passed array contains not just numbers.')
    }
  }
  let sumOfCards = hand.reduce((prev, curr) => prev + curr)
  if (sumOfCards > 21) {
    let convert = hand.indexOf(14)
    if (convert !== -1) {
      hand[convert] = 1
    }
  }
  sumOfCards = hand.reduce((prev, curr) => prev + curr)
  return sumOfCards
}

// Exports.
exports.shuffle = shuffle
exports.reShuffle = reShuffle
exports.handValue = handValue
