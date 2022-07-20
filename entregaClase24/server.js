const express = require('express');
const session = require('express-session')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const parseArgs = require('minimist');
const options = {default:{PORT:'8080', SERVER_MODE:'FORK'}};

const args = parseArgs(process.argv.slice(2), options);//parseArgs[, options];


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
const { Console } = require('console');
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


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
 
const SERVER_MODE = args['SERVER_MODE'];
Console.log(`server mode: ${SERVER_MODE}`);

if (SERVER_MODE =='FORK') {
    httpServer.listen(args['PORT'], () => {
        console.log('SERVER ON en http://localhost:' + args['PORT']);
    
    });
    httpServer.on("Error", (error) => console.log(`error en servidor ${error}`));
}
else {
    console.log("entering cluster_mode");
    if (cluster.isMaster) {
        
        for (let i=0; i<numCPUs; i++){
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    }
}


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

app.get('/info', logInRouter.info);

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





