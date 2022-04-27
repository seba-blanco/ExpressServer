const fs = require('fs');
const path = require('path');

class ChatController {
    constructor() {
        this.fileName = 'chat.json';
        this.fileContent = [];

    }
        
    readFile = async () => {
     const content =  await fs.promises.readFile(this.fileName,'utf-8')
        .then (contenido => { 
            
           return JSON.parse(contenido);
           
        })
        
        .catch(error => {
        })
        
        return content;
    }


    writeFile =async (message) => {
        
        await fs.promises.writeFile(this.fileName, JSON.stringify(message, null, 4))
        .then(res => {console.log("actualizado")})
        .catch(err => {console.log('no se puedo actualizar', err)})

    }
    

    getMessages = async () => {
       let datos = await this.readFile().then (chats=> { return chats});
        
        return datos;
    }
    
    
    addMessage =async (object) => {
        let datos = await this.readFile().then (prods=> {return prods});
        console.log(datos)
        let maxId = Math.max(...datos.map(prod => prod.id), 0);
        object["id"] = maxId + 1;
        datos.push(object);
       
        this.writeFile(datos);

        return object;


    }
}

module.exports = ChatController;