const {FileContainer} = require ('../containers/FileContainer');

class ChatDAOFile extends FileContainer {
    constructor() {
        super('./src/data/chat.json');
        
    }

   
}

module.exports = {ChatDAOFile} 