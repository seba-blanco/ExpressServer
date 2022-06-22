const express = require('express');
const session = require('express-session');

const util = require('util')

const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const PORT = 8080;

const {ProductsDAOFile} =  require('./src/DAOS/ProductsDAOFile');
const {ChatDAOFile} =  require('./src/DAOS/ChatDAOFile');
const {normalizeChat} = require('./src/utils/chatNormalizr')
const {generateRandomProducts} = require('./src/mocks/productMocker');

const ValidateLogin = require('./src/middlewares/securityMiddleware');

const path = require('path')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let moment = require('moment'); 
const MongoStore = require('connect-mongo');
const advancedOptions = {useNewUrlParser:true, useUnifiedTopology:true}

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://UserAdmin:admin.blanco@fake-ecommerce.mrdeon7.mongodb.net/sessions?retryWrites=true&w=majority',
        mongoOptions:advancedOptions
    }),
    resave:false,
    saveUninitialized:false,
    secret:'Peron',
    cookie: {
        expires:60000
    }
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
 
const productsDAO = new ProductsDAOFile();
const chatDAO = new ChatDAOFile();

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});


app.get('/',ValidateLogin, async  (req,res) =>{
    console.log(req.session.user);
    res.render('pages/index', {UserLogged: req.session.user});  

})
app.get('/login', async (req, res) => {
    res.render('pages/login');

})

app.post('/login', async (req, res) => {
    req.session.user = req.body.username;
    req.session.logged = true;

    res.redirect('/');
})

app.get('/logout',ValidateLogin, (req, res) => {
    req.session.destroy( error => {
        if (error) {
            res.send({status: 'Logout Error', body: error})
        }
    })

    res.send('Usted ha cerrado sesion')
})



io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    let allProds = generateRandomProducts(5);

    let allMessages = await chatDAO.getAll();
    const dataContainer = {id:1, posts:[]};
    dataContainer.posts = allMessages;

    socket.emit('welcome', {products:allProds, chat: allMessages});
   

    socket.on('newProduct', async (data) => {
        
        await productsDAO.save(data);
        let allProds = generateRandomProducts(5);
        io.sockets.emit('products', allProds);
    });

    socket.on('newMessage', async (data) => {
       
        data.message['datetime'] = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        
        await chatDAO.save(data);
        
       
        let allMessages = await chatDAO.getAll();
        io.sockets.emit('chatMessages', {chat:allMessages});
    })
})





