const {selectArticles, selectArticleById, selectCommentsById, insertComment} = require('../models/articles-model')

function getArticleById(req, res, next){

    const articleId = req.params.article_id

    selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

function getArticles(req, res, next){
    
    selectArticles()
    .then((articleData) => {
        res.status(200).send({articles: articleData})
    })
    .catch((err) => {
        next(err)
    })
}

function getCommentsById (req, res, next){

    const articleId = req.params.article_id

    selectCommentsById(articleId)
    .then((commentData) => {
        res.status(200).send({comments: commentData})
    })
    .catch((err) => {
        next(err)
    })
}

function postComment (req, res, next){
   const newComment = req.body
   const articleId = req.params.article_id
   insertComment(newComment, articleId)
   .then((commentData) => {
        res.status(201).send({comment: commentData})
   })
   .catch((err) => {
    next(err)
   })
}

module.exports = {getArticleById, getArticles, getCommentsById, postComment}