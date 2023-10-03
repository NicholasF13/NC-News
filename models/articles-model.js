const db = require('../db/connection')

function selectArticleById(articleId){

    return db.query(`SELECT * FROM articles WHERE article_id = ${articleId};`)
    .then((data) => {
        if (data.rows.length !== 0) {
            return data.rows[0]
        } else {
            return Promise.reject({ status: 404, message: 'Article does not exist' })
        }
    })
}

module.exports = {selectArticleById}