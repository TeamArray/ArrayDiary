/**
 * @param {import('../classes/Client')} client
 */
async function onReady (client) {
  console.log(
    client.user.username + ' is now online!\n' +
    'prefix: ' + client.settings.prefix
  )

  const { children } = client.channels.resolve(client.settings.target)
  const channels = children.array().filter((chn) => chn.type === 'text')
  for (const channel of channels) {
    const channelmsgs = await channel.messages.fetch()
    for (const [, msg] of channelmsgs) {
      if (msg.content.length < client.settings.minchar) continue
      const [exist] = await client.db.select('id').where('id', msg.id).from('diaries')
      if (!exist) await client.db.insert({ id: msg.id, author: msg.author.id, length: msg.content.length, createdAt: msg.createdAt }).into('diaries')
    }
  }
}

module.exports = onReady
