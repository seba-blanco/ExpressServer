const { knexMysql } = require('../options/mariaDB');
const { knexSqLite } = require('../options/sqlite3');

const insertProducts = (knex) => {
    knex('products').insert([{
        "name": "calculadora",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 234.56,
        "photo": "https://via.placeholder.com/15",
        "stock": 5
    },
    {
        "name": "Globo terraqueo",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 345.67,
        "photo": "https://via.placeholder.com/15",
        "stock": 5
    },
    {
        "name": "lapicera",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 200,
        "photo": "https://via.placeholder.com/15",
        "stock": 5
    },
    {
        "name": "boligoma",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 200,
        "photo": "https://via.placeholder.com/15",
        "stock": 5
    },
    {
        "name": "papel glase",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 200,
        "photo": "https://via.placeholder.com/15",
        "stock": 5
    },
    {
        "name": "estatua de Peron",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 200,
        "photo": "https://via.placeholder.com/15",
        "stock": 5
    },
    {
        "name": "boligoma",
        "description": "mira que lindo producto",
        "timestamp": "1651621481714",
        "price": 200,
        "photo": "https://via.placeholder.com/15",
        "stock": 10
    }
])
    .then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });
}

insertProducts(knexMysql);


const insertChats = (knex) => {
    knex('chats').insert([{
        "userName": "test",
        "message": "3",
        "datetime": "27/04/2022 18:20:05"
    },
    {
        "userName": "user 2",
        "message": "mensaje 2",
        "datetime": "27/04/2022 18:40:39"
    },
    {
        "userName": "user 3",
        "message": "mensaje 3",
        "datetime": "27/04/2022 18:44:07"
        
    }
])
    .then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });
}
insertChats(knexSqLite);
