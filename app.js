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
  
app.all('/*', (req, res, next) => {
    console.log('hello')
    res.status(404).send({ error: 'Invlaid endpoint'})
}) 

module.exports = app