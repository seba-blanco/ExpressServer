const knexMysql = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'cursocoder'
    },
    pool: {min: 0, max: 10}
})

module.exports = { knexMysql };