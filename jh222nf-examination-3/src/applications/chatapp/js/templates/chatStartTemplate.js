const chatStartTemplate = document.createElement('template')
chatStartTemplate.innerHTML = `
<form>
<div>
    <p>Enter player name</p>
    <input id="playername">
    <p id="invaliduser"></p>
</div>
<div id="btn">
    <button type="submit" id="start">Start</button>
</div>
</form>
`

module.exports = chatStartTemplate
