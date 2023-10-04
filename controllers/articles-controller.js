const {selectArticles, selectArticleById} = require('../models/articles-model')

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

}

module.exports = {getArticleById, getArticles, getCommentsById}