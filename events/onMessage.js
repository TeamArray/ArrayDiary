const Query = require('../classes/Query')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
async function onMessage (client, msg) {
  const { prefix } = client.settings
  const { author, content } = msg

  if (author.bot) return

  if (msg.channel.parentID === client.settings.target) {
    if (msg.content.length < client.settings.minchar) {
      const m = await msg.channel.send('40자 미만의 메세지는 일기로 카운트 되지 않습니다')
      m.delete({ timeout: 1000 })
    } else {
      await client.db.insert({ id: msg.id, author: msg.author.id, length: msg.content.length }).into('diaries')
      msg.react(client.emojis.cache.get('762703472293314561'))
    }
  }

  if (!content.startsWith(prefix)) return

  const query = new Query(prefix, content)
  const target = client.commands.find(
    (command = { aliases: [] }) =>
      typeof command === 'function' &&
      command.aliases.includes(query.cmd)
  )

  if (!target) return
  target(client, msg)
}

module.exports = onMessage
