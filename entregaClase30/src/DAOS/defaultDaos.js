let { DEFAULTSTORE } = require('../config/global')
const {ProductsDAOFile} =  require('../DAOS/ProductsDAOFile');


const {ChatDAOFile} =  require('../DAOS/ChatDAOFile');
const UsersDAOMongo =  require('../models/Users');

let productsDAO;
let chatsDAO;
let usersDAO;

console.log('default store');
console.log(DEFAULTSTORE);

switch (DEFAULTSTORE) {
    case 'MongoDB':
        chatsDAO = new ChatDAOFile();
        productsDAO = new ProductsDAOFile();
        usersDAO = new UsersDAOMongo();
        break;

    default:
        chatsDAO = new ChatDAOFile();
        productsDAO = new ProductsDAOFile();
        usersDAO = new UsersDAOMongo();
        break;
}

module.exports ={productsDAO, chatsDAO, usersDAO}