const { MessageEmbed } = require('discord.js')
const fetchPoint = require('../utils/fetchPoint')
const { getNumberWithOrdinal } = require('../utils/numbering')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
async function fn (client, msg) {
  const authors = [...new Set((await client.db.select('*').orderBy('createdAt').from('diaries')).map((diary) => diary.author))]
  let leaderboard = []

  for (const author of authors) {
    leaderboard.push({ id: (msg.guild.members.resolve(author) || { nickname: 'Unknown' }).nickname, point: await fetchPoint(client, author) })
  }

  leaderboard = leaderboard.sort((a, b) => a.point - b.point).reverse().slice(0, 10)
  const embed = new MessageEmbed({ color: 0x60caff, title: 'ArrayDiary 리더보드' })
  for (const leaderIndex in leaderboard) {
    embed.addField((Number(leaderIndex) + 1) + getNumberWithOrdinal(Number(leaderIndex) + 1) + '. ' + leaderboard[leaderIndex].id, leaderboard[leaderIndex].point + 'p')
  }

  msg.channel.send(embed)
}

module.exports = fn
module.exports.aliases = ['leaderboard', '리더보드', '순위', 'score', 'leader', '리더']
