const {selectEndPoints} = require('../models/endpoints-model')
 

function getEndpoints(req, res, next){
 selectEndPoints().then((endpoints) => {
    res.status(200).send(endpoints)
 })
}


module.exports = {getEndpoints}