const express = require('express')
const app = express()
const dotenv = require('dotenv')
const wordRouter = require('./routers/wordRouter')
const posRouter = require('./routers/posRouter')
dotenv.config()

app.use('/word', wordRouter)
app.use('/pos', posRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, console.log(`Server listening on port ${PORT}`))

module.exports = app
