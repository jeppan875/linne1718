const startMenuTemplate = document.createElement('template')
startMenuTemplate.innerHTML = `
<form>
    <div id="player">
        <p>Enter player name</p>
        <input id="playername">
    </div>
    <div id="difficulty">
        <div>
            <input type="radio" id="easy" name="difficulty" value="2">
            <label for="easy">easy</label>
        </div>
        <div>
            <input type="radio" id="medium" name="difficulty" value="4">
            <label for="medium">medium</label>
        </div>
        <div>
            <input type="radio" id="hard" name="difficulty" value="8">
            <label for="hard">hard</label>
        </div>
    </div>
    <div id="btn">
        <button type="submit" id="start">Start</button>
    </div>
</form>
`
module.exports = startMenuTemplate
