const express = require('express');
const util = require('util')

const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const PORT = 8080;

const {ProductsDAOFile} =  require('./src/DAOS/ProductsDAOFile');
const {ChatDAOFile} =  require('./src/DAOS/ChatDAOFile');
const {normalizeChat} = require('./src/utils/chatNormalizr')
const {generateRandomProducts} = require('./src/mocks/productMocker');

const path = require('path')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let moment = require('moment'); 

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
 
const productsDAO = new ProductsDAOFile();
const chatDAO = new ChatDAOFile();

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});


app.get('/',async  (req,res) =>{
    
    res.render('pages/index');  

})



io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    let allProds = generateRandomProducts(5);

    let allMessages = await chatDAO.getAll();
    const dataContainer = {id:1, posts:[]};
    dataContainer.posts = allMessages;

    console.log(util.inspect(normalizeChat(dataContainer),true, 10, true) );
    
    socket.emit('welcome', {products:allProds, chat: allMessages});
   

    socket.on('newProduct', async (data) => {
        
        await productsDAO.save(data);
        let allProds = generateRandomProducts(5);
        io.sockets.emit('products', allProds);
    });

    socket.on('newMessage', async (data) => {
       
        data.message['datetime'] = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        console.log("nuevo mensaje");
        console.log(data);
        await chatDAO.save(data);
        
       
        let allMessages = await chatDAO.getAll();
        console.log("al messages");
        console.log(allMessages);
        
        io.sockets.emit('chatMessages', {chat:allMessages});
    })
})





