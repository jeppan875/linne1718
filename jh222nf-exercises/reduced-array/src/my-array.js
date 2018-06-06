/**
 * my-array module
 *
 * @module src/my-array
 * @author John Häggerud
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

/**
 * Takes an array of numbers and returns the sum of all numbers in the array.
 *
 * @param {number[]} data An array with numbers
 * @returns {number} The total sum of the numbers in the array.
*/
function getSum (data) {
  if (!Array.isArray(data)) {
    throw new TypeError('The argument passed must be an array.')
  }
  return data.reduce(function (sum, value) {
    return sum + value
  }, 0) // 0 is the start value for sum

  // ALTERNATIVE SOLUTION
  // Using an arrow function.
// return source.reduce((sum, value) => sum + value, 0)
}

exports.getSum = getSum
