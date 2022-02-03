const db = require('../connectdb')
const express = require('express')

const router = express.Router()

router.get('/:word', (req, res) => {
  const params = {
    TableName: 'dictionary',
    KeyConditionExpression: '#word = :word',
    ExpressionAttributeNames: {
      '#word': 'Word',
    },
    ExpressionAttributeValues: {
      ':word': req.params.word.toUpperCase(),
    },
  }

  db.query(params, (err, data) => {
    if (err) {
      console.log('error', err)
      res.send('error')
    } else {
      console.log('success', data)
      res.send(data.Items)
    }
  })
})

router.get('/:word/:pos', (req, res) => {
  const params = {
    TableName: 'dictionary',
    Key: {
      Word: req.params.word.toUpperCase(),
      Pos: req.params.pos,
    },
  }
  db.get(params, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})

module.exports = router
