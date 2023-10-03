const {selectArticleById} = require('../models/articles-model')

function getArticleById(req, res, next){

    const articleId = req.params.article_id

    selectArticleById(articleId)
    .then((data) => {
       
        
        if (data.rows.length !== 0) {
            
            const article = data.rows[0]
            res.status(200).send({article})

        } else {
            res.status(404).send({message: 'Article does not exist'})
        }

    })
    .catch((err) => {
        next(err)
    })
}


module.exports = {getArticleById}