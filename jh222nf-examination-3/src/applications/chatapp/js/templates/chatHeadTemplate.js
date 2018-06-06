const chatHeadTemplate = document.createElement('template')
chatHeadTemplate.innerHTML = `
<head>
    <link rel="stylesheet" href="./applications/chatapp/css/chat.css"/>
    <template id="template-recieve">
    <div id="msgdiv" class="recieve-msg">
        <p id="msg"></p>
        <p id="user"></p>
    </div>    
    </template>
</head>
`
module.exports = chatHeadTemplate
