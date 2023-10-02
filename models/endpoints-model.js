const db = require('../db/connection')
const fs = require('fs/promises')

function selectEndPoints(){
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
    .then((file) => {
        return JSON.parse(file)
    })
}

module.exports = {selectEndPoints}