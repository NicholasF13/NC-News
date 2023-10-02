const express = require('express')
const {getTopics} = require('./controllers/topics-controller')
const {getEndpoints} = require('./controllers/endpoints-controller')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send({ error: 'Internal Server Error' })
  })
  

module.exports = app