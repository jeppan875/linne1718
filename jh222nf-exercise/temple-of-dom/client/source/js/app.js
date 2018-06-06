// const templateNode = document.querySelector('#resultTemplate')

console.log(document.childNodes)
console.log(document.firstChild.childNodes[0])

function allNodes (node) {
  let allNodes = []
  function recurse (node) {
    for (let i = 0; i < node.childNodes.length; i++) {
      allNodes.push(node.childNodes[i])
      recurse(node.childNodes[i])
    }
  }
  return allNodes
}

let nodes = allNodes(document.html)
console.log(nodes.length)

let all = document.querySelectorAll('*')
console.log(all.length)

/* if (node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      console.log(node.childNodes[i])
      arr.push(node.childNodes[i])
      return nodes(node.childNodes[i])
    }
  }

let numberOfElements = document.querySelectorAll('*')
console.log(numberOfElements.length)

let numbersOfComments = function () {
  let count = 0
  for (let i = 0; i < numberOfElements.length; i++) {
    if (numberOfElements[i].nodeType === 1) count++
  }
  return count
}

let numberOfAttributes = function () {
  let count = 0
  for (let i = 0; i < numberOfElements.length; i++) {
    count += numberOfElements[i].attributes.length
  }
  return count
}
console.log(numberOfAttributes())
console.log(numbersOfComments()) */
