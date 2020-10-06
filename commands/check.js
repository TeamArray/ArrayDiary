const checkComplete = require('../utils/checkComplete')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
async function fn (client, msg) {
  checkComplete(client, msg.channel)()
}

module.exports = fn
module.exports.aliases = ['check', '체크', '전체정산']
