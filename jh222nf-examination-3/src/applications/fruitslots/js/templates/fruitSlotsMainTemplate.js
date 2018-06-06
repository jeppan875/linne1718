const fruitSlotsMainTemplate = document.createElement('template')
fruitSlotsMainTemplate.innerHTML = `
<div id="slotmachine">
    <table>
        <tr>
            <th>Funds</td>
            <th>Jackpot</td> 
        </tr>
        <tr>
            <td id="funds"></td>
            <td id="jackpot"></td> 
        </tr>    
    </table>
    <div id="slots">
        <div class="float"><img><img><img></div>
        <div class="float"><img><img><img></div>
        <div class="float"><img><img><img></div>
        <div class="float"><img><img><img></div>
        <div class="float"><img><img><img></div>
    </div>
    <p id="amountwon"></p>
    <div id="spin">
        <button type="submit" id="spinbtn">spin</button>
    </div>
    <p id="insufficient"></p>
</div>
`
module.exports = fruitSlotsMainTemplate
