const express = require('express');
const session = require('express-session')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const log4js = require("log4js");

const parseArgs = require('minimist');
const options = {default:{PORT:8080, SERVER_MODE:'FORK'}};

const args = parseArgs(process.argv.slice(2), options);//parseArgs[, options];

const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');

const {loginRouter} = require('./src/routes/logInRouter');
const {passport} = require('./src/config/passport-config');

const randomRouter = require('./src/routes/RandomRouter');

const { EXPIRATION_TIME } = require('./src/config/global')
const {productsDAO, chatsDAO} = require("./src/DAOS/defaultDaos");

const path = require('path')
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let moment = require('moment'); 


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

//seteo el logger.
log4js.configure({
    appenders: {
      miLoggerConsole2: { type: "console" },
      errorConsole: { type: "console" },
      warnFile: {type:'file', filename: 'warn.log'},
      errorFile: {type:'file', filename: 'error.log'},
    },
    categories: {
      default: { appenders: ['miLoggerConsole2'], level: "info" },
      warn: { appenders: ['miLoggerConsole2','warnFile'], level: "warn" },
      error: { appenders: ['errorConsole','errorFile'], level: "error" },
    },
  });

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize())
app.use(passport.session())

app.use("/", loginRouter);
app.use("/api/", randomRouter);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
 
const PORT = parseInt(process.argv[2]);
const SERVER_MODE = args['SERVER_MODE'];

if (SERVER_MODE =='FORK') {
    httpServer.listen(PORT, () => {
        console.log('SERVER ON en http://localhost:' + PORT);
    
    });
    httpServer.on("Error", (error) => console.log(`error en servidor ${error}`));
}
else {
    if (cluster.isMaster) {
        
        for (let i=0; i<numCPUs; i++){
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    }
}

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





