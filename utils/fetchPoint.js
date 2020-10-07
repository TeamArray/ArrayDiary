/**
 * @param {import('../classes/Client')} client
 * @param {string} author
 * @returns {number}
 */
async function fetchPoint (client, author) {
  const diaries = await client.db.select('*').where('author', author).from('diaries')
  let point = 0
  for (const diary of diaries) {
    point += 30 +
      diary.length * 2 +
      diary.stars * 100
  }

  return point
}

module.exports = fetchPoint
