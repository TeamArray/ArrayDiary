const moment = require('moment')
const { MessageEmbed } = require('discord.js')

function checkComplete (client, channel = client.channels.resolve(client.settings.report)) {
  return async () => {
    const now = moment()
    const diaries = await client.db.select('*').orderBy('createdAt').where('createdAt', '<', now.day(0).toString()).andWhere('createdAt', '>', now.day(-6).toString()).from('diaries')

    const authors = [...new Set(diaries.map((diary) => diary.author))]
    const goodAuthors = []
    const badAuthors = []

    for (const author of authors) {
      const authorDiaries = diaries.filter((diary) => diary.author === author)

      const notbad = authorDiaries.length >= client.settings.needweek
      const subtract =
          authorDiaries.length === client.settings.needweek
            ? '=0' : authorDiaries.length < client.settings.needweek
              ? '-' + (client.settings.needweek - authorDiaries.length)
              : '+ ' + (authorDiaries.length - client.settings.needweek)

      if (notbad) goodAuthors.push('<@' + author + '> (**' + subtract + '**)')
      else badAuthors.push('<@' + author + '> (**' + subtract + '**)')
    }

    channel
      .send(new MessageEmbed({
        title: now.format('MM월') + ' ' + Math.ceil(now.date() / 7) + '째 주 정산',
        fields: [
          { name: '목표량 충족', value: goodAuthors.join('\n') || '없음' },
          { name: '목표량 불충족', value: badAuthors.join('\n') || '없음' }
        ]
      }))
  }
}

module.exports = checkComplete
