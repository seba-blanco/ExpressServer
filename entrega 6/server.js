const express = require('express');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const PORT = 8080;
const Contenedor = require("./contenedorAsync");
const ChatController =require("./chatController");
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
 
const archivo = new Contenedor('./products.json');
const chat = new ChatController();

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});


// app.get('/productos',async  (req,res) =>{
    
//     let prods =await archivo.getAll();
    
//     console.log(prods);
//     res.render('pages/viewProducts', { productos: prods, listExists: true });  

// })

app.get('/',async  (req,res) =>{
    
    res.render('pages/index');  

})



io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    let allProds = await archivo.getAll();
    let allMessages = await chat.getMessages();
    socket.emit('welcome', {products:allProds, chat: allMessages});
   

    socket.on('newProduct', async (data) => {
        
        await archivo.save(data);
        let allProds = await archivo.getAll();
        io.sockets.emit('products', allProds);
    });

    socket.on('newMessage', async (data) => {
       
        data['datetime'] = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        await chat.addMessage(data);
        
       
        let allMessages = await chat.getMessages();
        console.log("al messages");
        console.log(allMessages);
        
        io.sockets.emit('chatMessages', {chat:allMessages});
    })
})





