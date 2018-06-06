const chatTemplate = document.createElement('template')
chatTemplate.innerHTML = `
<div id="messages"></div>
<div id="textarea">
<textarea id="text" rows="4" cols="40"></textarea>
</div>
<button id="send">Send</button>
<button id="reload">reload history</button>
`

module.exports = chatTemplate
