/**
 * Module for obtaining descriptive information about a set of data.
 *
 * @author TODO: Write your name here.
 * @version 1.1.0
 */

'use strict'
/**
 * Function that throws TypeError for arguments that are not an array an
 * array that dont contains numbers only. Error if array is empty.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 */
function acceptOnlyNumberedArray (numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('The passed argument is not an array.')
  }
  if (numbers.length < 1) {
    throw new Error('The passed array contains no elements.')
  }
  for (let i = 0; i < numbers.length; i++) {
    if (typeof (numbers[i]) !== 'number') {
      throw new TypeError('The passed array contains not just numbers.')
    }
  }
}

/**
 * Returns the descriptive information (maximum, mean, median, minimum,
 * mode, range and standard deviation) from a set of numbers.
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {{maximum: number, mean: number, median: number, minimum: number, mode: number[], range: number, standardDeviation: number}}
 */
function descriptiveStatistics (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  let descriptiveStatistics = {maximum: maximum(numbersCopy), minimum: minimum(numbersCopy), range: range(numbersCopy), mean: mean(numbersCopy), median: median(numbersCopy), standardDeviation: standardDeviation(numbersCopy), mode: mode(numbersCopy)}
  return descriptiveStatistics
}

/**
 * Returns the highest value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number}
 */
function maximum (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  numbersCopy.sort(function (a, b) {
    return a - b
  })
  return numbersCopy[numbersCopy.length - 1]
}

/**
 * Returns the lowest value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number}
 */
function minimum (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  numbersCopy.sort(function (a, b) {
    return a - b
  })
  return numbersCopy[0]
}

/**
 * Returns the range between lowest and highest value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number}
 */
function range (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  return maximum(numbersCopy) - minimum(numbersCopy)
}

/**
 * Returns the average value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number}
 */
function mean (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  let size = numbersCopy.length
  return (numbersCopy.reduce(function (sum, value) {
    return sum + value
  }, 0)) / size
}

/**
 * Returns the median value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number}
 */
function median (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  numbersCopy.sort(function (a, b) {
    return a - b
  })
  let size = numbersCopy.length
  let midIndex = size / 2 - 1
  if (size % 2 === 0) {
    return (numbersCopy[midIndex] + numbersCopy[midIndex + 1]) / 2
  } else {
    return numbersCopy[Math.ceil(midIndex)]
  }
}

/**
 * Returns the standard deviation value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number}
 */
function standardDeviation (numbers) {
  acceptOnlyNumberedArray(numbers)
  let numbersCopy = numbers.slice()
  let size = numbersCopy.length
  let squareArray = []
  for (let i = 0; i < size; i++) {
    squareArray.push((numbersCopy[i] - mean(numbersCopy)) * (numbersCopy[i] - mean(numbersCopy)))
  }

  let sumSquareArray = squareArray.reduce(function (sum, value) {
    return sum + value
  }, 0)

  return Math.sqrt(sumSquareArray / size)
}

/**
 * Returns the most common value in an array containing only numbers
 *
 * @param {number[]} numbers The set of data to be analyzed.
 * @throws {TypeError} The argument must be an array.
 * @throws {Error} The argument can not be an empty array.
 * @throws {TypeError} The argument must be an array containing just numbers.
 * @returns {number[]}
 */
function mode (numbers) {
  acceptOnlyNumberedArray(numbers)
  let frequencyNumbers = {}
  let highestFrequency = 0

  // Creates an object with numbers at properties and those numbers frequency in the array numbers as values.
  for (let number of numbers) {
    if (frequencyNumbers[number]) {
      frequencyNumbers[number]++
    } else {
      frequencyNumbers[number] = 1
    }
    if (frequencyNumbers[number] > highestFrequency) {
      highestFrequency = frequencyNumbers[number]
    }
  }
  // creates an array from frequencyNumbers that has the highest count/frequency and sorts it.
  let mostFrequentNumbers = Object.keys(frequencyNumbers).filter(nr => frequencyNumbers[nr] === highestFrequency).sort((a, b) => a - b)
  let mostFrequentParsedNumbers = mostFrequentNumbers.map(parseFloat)

  return mostFrequentParsedNumbers
}

// Exports
exports.descriptiveStatistics = descriptiveStatistics
exports.maximum = maximum
exports.mean = mean
exports.median = median
exports.minimum = minimum
exports.mode = mode
exports.range = range
exports.standardDeviation = standardDeviation
