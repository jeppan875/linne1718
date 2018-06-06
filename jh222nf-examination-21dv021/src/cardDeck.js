/**
 * @module src/cardDeck
 * Module that creates a card deck.
 * @author Jesper Hägglund
 * @version 1.11
 */

'use strict'

const CardDeckBase = {
  /**
   * Returns an array of card objects
   *
   * @returns {object[]} - An array of card objects.
   */
  getCardDeck: function () {
    return this.cardDeck
  }
}
/**
* Creates a new cardDeck object
*
* @return {object}
*/
const createCardDeck = function () {
  return Object.create(CardDeckBase, {
    /**
    * An array of objects where each object represents a card in a card deck
    *
    * @type {object[]}
    */
    'cardDeck': {
      value: [{card: '2♠', value: 2}, {card: '3♠', value: 3}, {card: '4♠', value: 4}, {card: '5♠', value: 5}, {card: '6♠', value: 6}, {card: '7♠', value: 7}, {card: '8♠', value: 8}, {card: '9♠', value: 9}, {card: '10♠', value: 10}, {card: 'J♠', value: 11}, {card: 'Q♠', value: 12}, {card: 'K♠', value: 13}, {card: 'A♠', value: 14},
              {card: '2♣', value: 2}, {card: '3♣', value: 3}, {card: '4♣', value: 4}, {card: '5♣', value: 5}, {card: '6♣', value: 6}, {card: '7♣', value: 7}, {card: '8♣', value: 8}, {card: '9♣', value: 9}, {card: '10♣', value: 10}, {card: 'J♣', value: 11}, {card: 'Q♣', value: 12}, {card: 'K♣', value: 13}, {card: 'A♣', value: 14},
              {card: '2♦', value: 2}, {card: '3♦', value: 3}, {card: '4♦', value: 4}, {card: '5♦', value: 5}, {card: '6♦', value: 6}, {card: '7♦', value: 7}, {card: '8♦', value: 8}, {card: '9♦', value: 9}, {card: '10♦', value: 10}, {card: 'J♦', value: 11}, {card: 'Q♦', value: 12}, {card: 'K♦', value: 13}, {card: 'A♦', value: 14},
              {card: '2♥', value: 2}, {card: '3♥', value: 3}, {card: '4♥', value: 4}, {card: '5♥', value: 5}, {card: '6♥', value: 6}, {card: '7♥', value: 7}, {card: '8♥', value: 8}, {card: '9♥', value: 9}, {card: '10♥', value: 10}, {card: 'J♥', value: 11}, {card: 'Q♥', value: 12}, {card: 'K♥', value: 13}, {card: 'A♥', value: 14}],
      writable: true,
      enumerable: true,
      configurable: true
    }
  })
}

// Exports.
module.exports.createCardDeck = createCardDeck
