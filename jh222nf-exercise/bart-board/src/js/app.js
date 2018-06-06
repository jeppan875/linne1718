// only need to write require and the browser will include it. We should not call bart-board with new instead use the built in dom-api.
require('./bart-board')

let bb1 = document.createElement('bart-board')
// here we can set our attributes
bb1.setAttribute('text', 'I will not pollute the global scope')
bb1.setAttribute('speed', 2)
// when event filled is reached, see bart-board.js, then this evenListener will execute the function
// which calls wipeboard function in bart-board.js
bb1.addEventListener('filled', () => {
  bb1.wipeBoard()
})
document.querySelector('#board').appendChild(bb1)
