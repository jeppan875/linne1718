/**
 * My-array module.
 *
 * @module src/my-array
 * @author John Häggerud
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

/**
 * Returns a numerically sorted copy of an array.
 *
 * @param {Number[]} source The array to create a sorted copy of.
 * @throws {TypeError} The source parameter must be an Array.
 * @returns {Number[]} A sorted copy of the source array.
 */
function immutableSort (source) {
  if (!Array.isArray(source)) {
    throw new TypeError('The first argument passed must be an Array.')
  }

  let copy
  copy = source.slice(0)
  copy = copy.sort(function (a, b) {
    return a - b
  })

  return copy
}

/**
 * Returns a numerically sorted copy (descending order) of an array.
 *
 * @param {Number[]} source The array to create a sorted copy of.
 * @throws {TypeError} The source parameter must be an Array.
 * @returns {Number[]} A sorted copy (descending order) of the source array.
 */
function immutableSortDescending (source) {
  if (!Array.isArray(source)) {
    throw new TypeError('The first argument passed must be an Array.')
  }

  let copy
  copy = source.slice(0)
  copy = copy.sort(function (a, b) {
    return b - a
  })

  return copy
}

exports.immutableSort = immutableSort
exports.immutableSortDescending = immutableSortDescending
