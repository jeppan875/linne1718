/**
 * my-array module.
 *
 * @module src/my-array
 * @author John Häggerud
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

/**
 * Returns the name of the students whose points is greater than,
 * or equal to, the average of the points.

 * @param {object[]} students
 * @returns {string[]}
 */
function filterBetterThanAverage (students) {
  if (!Array.isArray(students)) {
    throw new TypeError('The argument must be an array.')
  }
  let totalPoints = 0
  students.forEach(function (element) {
    totalPoints += element.points
  })

  let average = totalPoints / students.length
  let betterThanAverage = []
  students.forEach(function (element) {
    if (element.points >= average) {
      betterThanAverage.push(element.name)
    }
  })

  return betterThanAverage
}

exports.filterBetterThanAverage = filterBetterThanAverage
