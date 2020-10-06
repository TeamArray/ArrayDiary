const moment = require('moment')
const { MessageEmbed } = require('discord.js')

function checkComplete (client, channel = client.channels.resolve(client.settings.report)) {
  return async () => {
    const now = moment()
    const diaries = await client.db.select('*').orderBy('createdAt').from('diaries')
    const thisweek = await diaries.filter((diary) => now.clone().day(0) > diary.createdAt || diary.createdAt > now.clone().day(-6))

    const authors = [...new Set(thisweek.map((diary) => diary.author))]
    const goodAuthors = []
    const badAuthors = []

    for (const author of authors) {
      const authorDiaries = diaries.filter((diary) => diary.author === author)

      const notbad = authorDiaries.length >= client.settings.needweek
      const subtract =
          authorDiaries.length === client.settings.needweek
            ? '=0' : authorDiaries.length < client.settings.needweek
              ? '-' + (client.settings.needweek - authorDiaries.length)
              : '+' + (authorDiaries.length - client.settings.needweek)

      if (notbad) goodAuthors.push('<@' + author + '> (**' + subtract + '**)')
      else badAuthors.push('<@' + author + '> (**' + subtract + '**)')
    }

    channel
      .send(new MessageEmbed({
        title: (now.month() + 1) + ' ' + Math.ceil(now.date() / 7) + '째 주 정산',
        fields: [
          { name: '목표량 충족 (' + goodAuthors.length + '명)', value: goodAuthors.join('\n') || '없음' },
          { name: '목표량 불충족 (' + badAuthors.length + '명)', value: badAuthors.join('\n') || '없음' }
        ]
      }))
  }
}

module.exports = checkComplete
