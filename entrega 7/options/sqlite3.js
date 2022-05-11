const dirPath = require('path');

const knexSqLite = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: dirPath.join(__dirname, '..', 'db', 'cursocoder.sqlite')
    },
    useNullAsDefault: true
})

module.exports = { knexSqLite };