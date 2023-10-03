const {selectArticles, selectArticleById} = require('../models/articles-model')

function getArticleById(req, res, next){

    const articleId = req.params.article_id

    selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

function getArticles(req, res, next){

}

module.exports = {getArticleById, getArticles}