const Client = require('./classes/Client')
const client = new Client()

const onReady = require('./events/onReady')
const onMessage = require('./events/onMessage')
const onMessageReactionAdd = require('./events/onMessageReactionAdd')

client.start()
client.regist('ready', onReady)
client.regist('message', onMessage)
client.regist('messageReactionAdd', onMessageReactionAdd)
