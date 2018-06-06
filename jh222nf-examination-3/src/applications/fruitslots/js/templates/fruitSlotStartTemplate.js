const fruitSlotStartTemplate = document.createElement('template')
fruitSlotStartTemplate.innerHTML = `
<form id="start">
    <p></p>
    <div id="amount">
        <p>Enter amount</p>
        <input id="funds">
    </div>
    <div id="transfer">
        <button type="submit" id="insert">Insert</button>
        <button type="submit" id="withdraw">Withdraw</button>
    </div>
    <div id="bet">
        <div>
            <input type="radio" checked="checked" id="five" name="bet" value="5">
            <label for="five">5</label>
        </div>
        <div>
            <input type="radio" id="ten" name="bet" value="10">
            <label for="ten">10</label>
        </div>
        <div>
            <input type="radio" id="twenty" name="bet" value="20">
            <label for="twenty">20</label>
        </div>
    </div>
    <div id="btn">
        <button type="submit" id="startbtn">Start</button>
    </div>
    <p id="insufficient"></p>
</form>
`
module.exports = fruitSlotStartTemplate
