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

function selectArticles(){
    return db.query(`SELECT
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM
    articles
    LEFT JOIN
    comments ON articles.article_id = comments.article_id
    GROUP BY
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url
    ORDER BY
    articles.created_at DESC;`)
    .then(({rows}) => {
        return rows
    })
}

function selectCommentsById (articleId){
    return db.query(`
    SELECT
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id
    FROM 
    comments
    JOIN
    articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = ${articleId}
    GROUP BY
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id
    ORDER BY
    comments.created_at DESC;`)
    .then(({rows}) => {
        if(rows.length !== 0){
            return rows
        }else {
            return Promise.reject({ status: 404, message: 'Article does not exist' })
        }
    })
}

module.exports = {selectArticleById, selectArticles, selectCommentsById}