const express = require('express')
const {getTopics} = require('./controllers/topics-controller')
const {getEndpoints} = require('./controllers/endpoints-controller')
const {getArticleById, getArticles, getCommentsById} = require('./controllers/articles-controller')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("api/articles/:article_id/comments", getCommentsById)

app.use((err, req, res, next) => {
    console.error(err)

    if (err.code === '42703'){
      res.status(400).send({message: 'Bad request'})

    } else if (err.status){
      res.status(err.status).send({message: err.message})
      
    } else {
    res.status(500).send({ message: 'Internal Server Error' })
    }
  })
  
app.all('/*', (req, res) => {
    res.status(404).send({ message: 'Invalid endpoint'})
}) 

module.exports = app