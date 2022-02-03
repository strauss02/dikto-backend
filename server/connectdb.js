const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWSDYNAMOACCESS,
  secretAccessKey: process.env.AWSDYNAMOSECRET,
})
const db = new AWS.DynamoDB.DocumentClient()

module.exports = db
