const db = require('../connectdb')
const express = require('express')

const router = express.Router()

const posByNum = {
  1: 'n.',
  2: 'p.',
  3: 'v.',
  4: 'a.',
  5: 'adv.',
  6: 'prep.',
  7: 'conj.',
  8: 'interj.',
}

router.get('/:part', async (req, res) => {
  const pos = posByNum[Number(req.params.part)]
  const params = {
    TableName: 'dictionary',
    IndexName: 'Pos-Word-index',
    KeyConditionExpression: '#pos = :pos',
    ExpressionAttributeNames: {
      '#pos': 'Pos',
    },
    ExpressionAttributeValues: {
      ':pos': pos,
    },
    Limit: 10,
  }
  // if request is sent with query letter, search by letter
  if (
    (Object.keys(req.query).length === 0 && req.query.constructor === Object) ||
    req.query.letter === undefined
  ) {
    db.query(params, (err, data) => {
      if (err) {
        console.log('error', err)
        res.send('error')
      } else {
        console.log('success')
        const entries = data.Items
        const randomEntry = getRandomWord(entries)
        return res.send(randomEntry)
      }
    })
  } else {
    req.query.letter = req.query.letter.toUpperCase()

    const Bparams = {
      TableName: 'dictionary',
      IndexName: 'Pos-Word-index',
      KeyConditionExpression: '#pos = :pos and begins_with(#word, :letter)',
      ExpressionAttributeNames: {
        '#pos': 'Pos',
        '#word': 'Word',
      },
      ExpressionAttributeValues: {
        ':pos': pos,
        ':letter': req.query.letter,
      },
      Limit: 10,
    }
    db.query(Bparams, (err, data) => {
      if (err) {
        res.send('shit')
        console.log(err)
      } else {
        const randomEntry = getRandomWord(data.Items)
        res.send(randomEntry)
      }
    })
  }
})

function getRandomWord(arr) {
  const index = getRandomInt(0, arr.length - 1)
  const randomEntry = arr[index]
  return randomEntry
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
module.exports = router
