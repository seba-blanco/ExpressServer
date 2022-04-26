const express = require('express');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const PORT = 8080;
const Contenedor = require("./contenedorAsync");
const path = require('path')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static('./public'));

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
 
const archivo = new Contenedor('./products.json');

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

// io.on('connection', (socket)=>{
//     console.log("a user connected via socket!")
//     socket.on('disconnect', ()=>{
//         console.log("a user disconnected!")
//     })
//     socket.on('chat message', (msg)=>{
//         console.log("Message: "+msg)
//         io.emit('chat message', msg)
//     })
// })

io.on('connection', (socket) => {
    console.log('Cliente conectado');
//    let allProds = archivo.getAll();
//    io.sockets.emit('products', allProds);
   

    socket.on('newProduct',  (data) => {
        console.log('new product');
//        let newProduct =  archivo.save(data);
//        let prods = archivo.getAll();
//        io.sockets.emit('products', prods);
       
    })
})
// //add product to products.json
// app.post("/", async (req, res) => {
//     let newProduct = await archivo.save(req.body);
    
//      res.redirect('/productos');
// })




