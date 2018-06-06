/**
 * Harshad module.
 *
 * @module src/harshad
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'
/**
* Returns true when the given number is a valid Harshad number.
*
* @param {number} number The given number.
* @returns {boolean}
*/
function isValid (number) {
  let isHarshadNumber = false
  let strNumber = number.toString()
  let strArray = strNumber.split('')
  let numberArray = []
  for (let i = 0; i < strArray.length; i++) {
    numberArray.push(Number(strArray[i]))
  }
  let sum = numberArray.reduce(function (sum, value) {
    return sum + value
  }, 0)
  if (number % sum === 0) {
    isHarshadNumber = true
  }
  return isHarshadNumber
}

/**
* Gets the next Harshad number after the given number.
*
* @param {number} number The given number.
* @returns {number}
*/
function getNext (number) {
  let isHarshadNumber = false
  let next = number
  while (isHarshadNumber === false) {
    next++
    isHarshadNumber = isValid(next)
  }
  return next
}

/**
* Returns a sequence of Harshad numbers, starting after a given number.
*
* @param {number} count The number of consecutive Harshad numbers to return.
* @param {number} [start = 0] The number after which the sequence should start; defaults to 0.
* @returns {number[]}
*/
function getSequence (count, start = 0) {
  let harshadArray = []
  for (let i = 0; i < count; i++) {
    start = getNext(start)
    harshadArray.push(start)
  }
  return harshadArray
}

// Exports
exports.isValid = isValid
exports.getNext = getNext
exports.getSequence = getSequence
