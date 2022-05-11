const fs = require('fs');
const path = require('path');

class ChatController {
    constructor(knexConn, tableName) {
        this.knexConn =  knexConn;
        this.tableName = tableName;

    }
        
    getMessages = async () => {
        console.log('en el messages');
        console.log(this.tableName);

        const datos= await this.knexConn(this.tableName).select('id', 'userName', 'message', 'datetime')
        .then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
        });
        return datos;
        
    }
    
    
    addMessage =async (object) => {
        const content= await this.knexConn(this.tableName).insert({userName: object.userName, message: object.message, datetime: object.datetime})
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
        return object;


    }
}

module.exports = ChatController;