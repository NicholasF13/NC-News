const db = require('../db/connection')

function selectArticleById(articleId){

    return db.query(`
    SELECT
    articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM 
    articles
    LEFT JOIN
    comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY 
    articles.article_id
    ;`, [articleId])
    .then((data) => {
        if (data.rows.length !== 0) {
            return data.rows[0]
        } else {
            return Promise.reject({ status: 404, message: 'Article does not exist' })
        }
    })
}

function selectArticles(topic, sortby = 'created_at', order){


    const validSortbys = ['created_at', 'comment_count', 'votes']

    const validOrders = ['asc', 'desc']


    if (sortby && !validSortbys.includes(sortby)) {
        return Promise.reject({ status: 400, message: 'Invalid query' })
    }
    
    if (order && !validOrders.includes(order)) {
        return Promise.reject({ status: 400, message: 'Invalid query' })
    }

    let queryStr =`
    SELECT
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
    comments ON articles.article_id = comments.article_id`
  

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`
    }

    queryStr += `
    GROUP BY
    articles.article_id`

    if (sortby && order){
        queryStr += ` ORDER BY ${sortby} ${order}`
    } else {
        queryStr += ` ORDER BY articles.created_at DESC`
    }

  let queryValues;

    if (topic) {
    queryValues = [topic]
    }  else {
    queryValues = []
    }

    return db.query(queryStr, queryValues)
    .then(({rows}) => {
        return rows
    })

}

function selectCommentsById (articleId){
    return db.query(`
    SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY
    comments.created_at DESC;`, [articleId])
    .then(({rows}) => {
        if(rows.length !== 0){
            return rows
        }else {
            return Promise.reject({ status: 404, message: 'Article does not exist' })
        }
    })
}

function insertComment (newComment, articleId) {

    return selectArticleById(articleId) //returns promise.reject if non-existant id
    .then(() => {

    if(Object.keys(newComment).length > 2)return Promise.reject({status:400, message: "Invalid keys in the request body"})

    const { username, body } = newComment;

    const currentDate = new Date().toISOString()
    
  
    const queryStr = `
      INSERT INTO comments
      (author, body, created_at, article_id)
      VALUES
      ($1, $2, $3, $4)
      RETURNING *;
    `;
  
    const queryValues = [username, body, currentDate, articleId];
  
    return db.query(queryStr, queryValues)
    .then(({rows}) => {
    
        return rows
    })
})
}

function updateArticleVotes (articleId, incVotes){
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, message: 'Article does not exist'})
        }

        const currentVotes = rows[0].votes

        let incVotesCheck
        
        if(incVotes){
            incVotesCheck = incVotes
        }else {
            incVotesCheck = 0
        }

        const updatedVotes = currentVotes + incVotesCheck

        return db.query(`UPDATE articles
                         SET votes = $1 
                         WHERE article_id = $2
                         RETURNING *;`,
                         [updatedVotes, articleId])
                         .then(({rows}) => {
                            return rows[0]
                         })
    })
}



module.exports = {selectArticleById, selectArticles, selectCommentsById, insertComment, updateArticleVotes}