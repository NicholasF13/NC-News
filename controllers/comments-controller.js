const {deleteComment} = require('../models/comments-model')

function deleteCommentById(req, res, next){
    const {comment_id} = req.params
    deleteComment(comment_id)
    .then(() => {
        res.status(204).end()
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {deleteCommentById}