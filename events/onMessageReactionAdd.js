/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').MessageReaction} react
 */
async function onMessageReactionAdd (client, react, user) {
  if (user.bot) return
  if (react.emoji.id !== '762703472293314561') return
  await client.db.update({ stars: react.users.cache.array().filter((user) => !user.bot).length }).where('id', react.message.id).from('diaries')
}

module.exports = onMessageReactionAdd
