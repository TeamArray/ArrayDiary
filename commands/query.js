const moment = require('moment')
const { MessageEmbed } = require('discord.js')
const fetchPoint = require('../utils/fetchPoint')

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
async function fn (client, msg) {
  const author = msg.query.args[0] || msg.author.id

  const now = moment()
  const diaries = await client.db.select('*').where('author', author).orderBy('createdAt').from('diaries')
  const thisweek = await diaries.filter((diary) => now.day(0) > diary.createdAt || diary.createdAt > now.day(-6))

  const notbad = thisweek.length >= client.settings.needweek
  const subtract =
    thisweek.length === client.settings.needweek
      ? ' 충족' : thisweek.length < client.settings.needweek
        ? '까지 ' + (client.settings.needweek - thisweek.length) + '장 더 작성해야 합니다'
        : '보다 ' + (thisweek.length - client.settings.needweek) + '장 더 많습니다'

  const embed = new MessageEmbed({
    color: notbad ? 0x60caff : 0xff0000,
    title: (msg.guild.members.resolve(author) || { nickname: 'Unknown' }).nickname + '님의 일기 정산',
    fields: [
      { name: '일주일 간 작성한 일기 수', value: thisweek.length + '장 (__목표량' + subtract + '__)' },
      { name: '일주일 간 작성한 글자 수', value: thisweek.reduce((acc, cur) => acc + cur.length, 0) + '자' },
      { name: '총 작성한 일기 수', value: diaries.length + '장', inline: true },
      { name: '총 작성한 글자 수', value: diaries.reduce((acc, cur) => acc + cur.length, 0) + '자', inline: true },
      { name: '총 받은 스타 수', value: diaries.reduce((acc, cur) => acc + cur.stars, 0) + ' <a:__diary_star:762703472293314561>', inline: true },
      { name: '다이어리 포인트', value: '**' + await fetchPoint(client, author) + 'p**' }
    ]
  })

  msg.channel.send(embed)
}

module.exports = fn
module.exports.aliases = ['쿼리', '정산', 'query', 'total', '다이어리', 'diaries']
