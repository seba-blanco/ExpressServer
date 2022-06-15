const { knexMysql } = require('../options/mariaDB');
const { knexSqLite } = require('../options/sqlite3');

const createTableProds = async knex => {
    await knex.schema.createTable('products', table => {
        table.increments('id').primary();
        table.string('name');
        table.string('description');
        table.datetime('timestamp');
        table.decimal('price',8,2);
        table.string('photo');
        table.integer('stock')
      });
   }

   const createTableChat = async knex => {
    await knex.schema.createTable('chats', table => {
        table.increments('id').primary();
        table.string('userName');
        table.string('message');
        table.datetime('datetime')
      });
   }

   createTableProds(knexMysql);
   createTableChat(knexSqLite);
