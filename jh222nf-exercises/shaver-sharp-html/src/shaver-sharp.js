/**
 * shaverSharp module.
 *
 * @module src/shaver-sharp
 * @author John Häggerud
 * @author Mast Loock
 * @version 1.1.0
 */

'use strict'

/**
 * Creates the specified starting tag.
 *
 * @param {string} tagName tagName is a string that specifies the type of starting tag to be created.
 * @returns {string} Returns a starting tag as a string.
 */
function createBeginTag (tagName) {
  let starTag = '<' + tagName + '>'
  return starTag
}

/**
 * Creates the specified closing tag.
 *
 * @param {string} tagName tagName is a string that specifies the type of closing tag to be created.
 * @returns {string} Returns a closing tag as a string.
 */
function createEndTag (tagName) {
  let endTag = '</' + tagName + '>'
  return endTag
}

/**
 * Creates the specified element with content. If no content is specified a self-closing element will be created.
 *
 * @param {string} tagName tagName is a string that specifies the type of element to be created.
 * @param {string=} [innerHTML = ''] innerHTML is a string that describes the element's descendants.
 * @returns {string} Returns an element as a string.
 */
function createElement (tagName, innerHTML = '') {
  let htmlElement = ''
  if (innerHTML === '') {
    htmlElement += '<' + tagName + ' />'
  } else {
    htmlElement += createBeginTag(tagName) + innerHTML + createEndTag(tagName)
  }
  return htmlElement
}

/**
 * Creates the specified elements with contents. If a tagName is not paired with a content a self-closing element
 * will be created.
 *
 * @param  {Array.<Object<string, string>>} elementData elementData is an array of objects.
 * @returns {string} Returns specified elements as a string.
 */
function createElements (elementData) {
  let result = ''
  elementData.forEach(function (current) {
    result += createElement(current.tagName, current.innerHTML)
  })
  return result
}

// Exports
exports.createBeginTag = createBeginTag
exports.createEndTag = createEndTag
exports.createElement = createElement
exports.createElements = createElements
