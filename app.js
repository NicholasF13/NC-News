const express = require('express')
const {getTopics} = require('./controllers/topics-controller')
const {getEndpoints} = require('./controllers/endpoints-controller')
const {getArticleById, getArticles, getCommentsById, postComment, updateArticle} = require('./controllers/articles-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsById)

app.post("/api/articles/:article_id/comments", postComment)

app.patch('/api/articles/:article_id', updateArticle)

app.use((err, req, res, next) => {
    console.error(err)

    if (err.code === '42703'|| err.code === '22P02'){
      res.status(400).send({message: 'Bad request'})
      
    } else if (err.code === '23502') {
      res.status(400).send({message: 'Missing body or username'})
    }
    
    else if (err.status){
      res.status(err.status).send({message: err.message})
      
    } else {
    res.status(500).send({ message: 'Internal Server Error' })
    }
  })
  
app.all('/*', (req, res) => {
    res.status(404).send({ message: 'Invalid endpoint'})
}) 

module.exports = app