const express = require('express');
const session = require('express-session');


const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const PORT = 8080;

const logInRouter = require('./src/routes/logInRouter');

const {validatePass} = require('./src/utils/passValidator');
const {createHash} = require('./src/utils/hashGenerator')
const { EXPIRATION_TIME } = require('./src/config/global')
const {productsDAO, chatsDAO} = require("./src/DAOS/defaultDaos");
const usersDB =  require('./src/models/Users');

const {generateRandomProducts} = require('./src/mocks/productMocker');
const ValidateLogin = require('./src/middlewares/securityMiddleware');

const path = require('path')
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let moment = require('moment'); 

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


app.use(session({
    secret: 'Peron',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: parseInt(EXPIRATION_TIME)
    },
    rolling: true,
    resave: true,
    saveUninitialized: true
}))

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize())
app.use(passport.session())

// app.use(session({
//     store: MongoStore.create({
//         mongoUrl:'mongodb+srv://UserAdmin:admin.blanco@fake-ecommerce.mrdeon7.mongodb.net/sessions?retryWrites=true&w=majority',
//         mongoOptions:advancedOptions
//     }),
//     resave:false,
//     saveUninitialized:false,
//     secret:'Peron',
//     cookie: {
//         expires:60000
//     }
// }))



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
 

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});


passport.use('login', new LocalStrategy(
    (username, password, callback) => {
        usersDB.findOne({ username: username }, (err, user) => {
            if (err) {
                return callback(err)
            }

            if (!user) {
                console.log('No se encontro usuario');
                return callback(null, false)
            }

            if(!validatePass(user, password)) {
                console.log('Invalid Password');
                return callback(null, false)
            }

            return callback(null, user)
        })
    }
))



passport.use('signup', new LocalStrategy(
    {passReqToCallback: true}, (req, username, password, callback) => {
        usersDB.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log('Hay un error al registrarse');
                return callback(err)
            }

            if (user) {
                console.log('El usuario ya existe');
                return callback(null, false)
            }

            console.log(req.body);

            const newUser = {
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                username: username,
                password: createHash(password)
            }

            console.log(newUser);


            usersDB.create(newUser, (err, userWithId) => {
                if (err) {
                    console.log('Hay un error al registrarse');
                    return callback(err)
                }

                console.log(userWithId);
                console.log('Registro de usuario satisfactoria');

                return callback(null, userWithId)
            })
        })
    }
))

passport.serializeUser((user, callback) => {
    callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
    usersDB.findById(id, callback)
})



//  LOGIN
app.get('/login', async (req, res) => {
    res.render('pages/login');

})
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), logInRouter.postLogin);

app.get('/faillogin', (req, res) => {

    res.send('intento de inicio de sesion no valido')
});

//  SIGNUP
app.get('/signup', logInRouter.getSignup);
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), logInRouter.postSignup);
app.get('/failsignup', (req, res) => {

    res.send('no pudimos crear su usuario')
});


app.get('/', ValidateLogin, (req,res) =>{
 
    res.render('pages/index', {UserLogged: req.user.firstName});  

})

app.get('/logout',ValidateLogin, logInRouter.getLogout);


io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    let allProds = generateRandomProducts(5);

    let allMessages = await chatsDAO.getAll();
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
        
        await chatsDAO.save(data);
        
       
        let allMessages = await chatsDAO.getAll();
        io.sockets.emit('chatMessages', {chat:allMessages});
    })
})





