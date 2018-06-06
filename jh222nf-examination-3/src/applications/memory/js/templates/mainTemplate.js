const mainTemplate = document.createElement('template')
mainTemplate.innerHTML = `
<template id="brick-template">
    <a tabindex="-1" href="#"><img tabindex="0"></a>
</template>
<div id="memorydiv">
    <p id="timer"></p>
</div>
`
module.exports = mainTemplate
