const highscoreTemplate = document.createElement('template')
highscoreTemplate.innerHTML = `
<div id="highscore">
    <p id="yourscore"></p>
    <p id="highscorehead">HIGHSCORES<P>
        <table id=hsBoard>

        </table>
</div>
`
module.exports = highscoreTemplate
