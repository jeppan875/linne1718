/**
 * Starting point of application
 * @author Jesper Hägglund
 * @version 1.11
 */

'use strict'

const Players = require('./src/Players')
const cardDeck = require('./src/cardDeck')
const Board = require('./src/Board')
try {
  let players = new Players()
  players.createPlayers('olle', 'niklas', 'johan', 'nils', 'petter', 'john', 'p', 's', 'o', 'p', 's', 'o', 'p', 's', 'o', 'p', 's', 'o', 'p', 's', 'o', 'p', 's', 'o', 'p')

  let board = new Board(players.getPlayers(), cardDeck.createCardDeck().getCardDeck())
  console.log(board.deal())
} catch (e) {
  console.error(e)
}
