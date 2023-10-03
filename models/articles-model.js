const db = require('../db/connection')

function selectArticleById(articleId){
    return db.query(`SELECT * FROM articles WHERE article_id = ${articleId};`)
}

module.exports = {selectArticleById}