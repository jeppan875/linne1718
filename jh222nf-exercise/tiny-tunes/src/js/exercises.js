function ex01 () {
  let myText = document.createTextNode('Hello world!')
  let pTag = document.querySelector('#step01_hello')
  pTag.appendChild(myText)
}

function ex02 () {
  let tag = document.querySelector('#step02')
  let h2 = document.createElement('h2')
  h2.innerText = 'This is a sub headline'
  tag.appendChild(h2)
    /* let h2 = document.createElement('h2')
  let myText = document.createTextNode('This is a sub headline')
  h2.appendChild(myText)
  document.querySelector('#step02').appendChild(h2) */
}

function ex03 () {
  let h2 = document.querySelectorAll('h2')[4]
  let newH2 = document.createElement('h2')
  newH2.appendChild(document.createTextNode('This is a sub headline'))
  h2.parentElement.insertBefore(newH2, h2.nextElementSibling)
  /* let h2 = document.createElement('h2')
  let myText = document.createTextNode('This is a sub headline')
  h2.appendChild(myText)
  let parent = document.querySelector('#step03')
  parent.insertBefore(h2, parent.childNodes[2]) */
}
function ex04 () {
  let h2 = document.querySelectorAll('#step04 h2')[0]
  h2.classList.add('red')
  /* let parent = document.querySelector('#step04')
  let h2 = parent.children[0]
  h2.classList.add('red') */
}
function ex05 () {
  let greyBoxA = document.querySelector('#step05 .greybox a')
  greyBoxA.addEventListener('click', event => {
    event.preventDefault() // Default event is prevented, in this case we get sent to top of page
    let p = document.createElement('p')
    p.innerText = 'You clicked!'
    // When using arrow function you can't use this as reference to greyBoxA you  need to use function (event) {}
    // this in this case will refer to something higher up
    greyBoxA.parentElement.parentElement.appendChild(p)
  })
}
function ex06 () {
  let frag = document.createDocumentFragment()

  for (let i = 0; i < 10; i++) {
    let li = document.createElement('li')
    li.innerText = `List element number ${i + 1}`
    frag.appendChild(li)
  }
  document.querySelector('#list06').appendChild(frag)
}
function ex07 () {
  const templateNode = document.querySelector('#step07-template')
  let liTemplate
  let list07 = document.querySelector('#list07')

  for (let i = 0; i < 5; i++) {
    liTemplate = document.importNode(templateNode.content, true)
    let a = liTemplate.querySelector('a')
    a.setAttribute('href', 'http://sunet.se')
    a.innerText = `This is the link number ${i + 1}`

    list07.appendChild(liTemplate)
  }
}
function ex08 () {
  let button = document.querySelector('#todolistform button')
  button.addEventListener('click', event => {
    let value = button.previousElementSibling.value
    if (value.length === 0) return

    let li = document.createElement('li')
    li.innerText = value
    document.querySelector('#todolist ul').appendChild(li)
  })
}
function ex09 () {
  let username = document.querySelectorAll('#textboxes09 input')[0]
  let confirm = document.querySelectorAll('#textboxes09 input')[1]
  let validation = document.querySelector('#step09 .validation')

  document.querySelector('#textboxes09').addEventListener('blur', event => {
    if (username.value.length > 0 && confirm.value.length > 0) {
      if (username.value === confirm.value) {
        validation.innerText = 'The username is ok!'
      } else {
        validation.innerText = 'The username does not match!'
      }
    } else {
      validation.innerText = ''
    }
  }, true)
}
module.exports = {
  ex01,
  ex02,
  ex03,
  ex04,
  ex05,
  ex06,
  ex07,
  ex08,
  ex09
}
