// ------------------------------------------------------------------------------
//  ROUTING
// ------------------------------------------------------------------------------
const parseArgs = require('minimist');
const numCPUs = require("os").cpus().length;
const log4js = require('log4js');
const { Router } = require("express");
const { passport } = require('../config/passport-config'); 
const {ValidateLogin} = require('../middlewares/securityMiddleware')
const loginRouter = Router();



infoCompression =  (req, res) => {
    const logger = log4js.getLogger("warn");
    logger.warn('prueba de un warn dentro de un warn ')
    
    logger.info("prueba log info");

    logger.error("prueba log info dentro del warn");

    let args = parseArgs(process.argv);
    
    const info = {
                    plataform: process.platform,
                    nodeVersion: process.version,
                    memoryUsage: `${process.memoryUsage()['rss'] /1000000} MB`,
                    cwd: process.cwd(),
                    pID: process.pid,
                    folder:args._[1],
                    args: process.argv.slice(2),
                    procesadores: `cantidad procesadores: ${numCPUs}`

    }
   
    res.render('pages/information', {info:info});
    
}

info = (req, res) => {
    const logger = log4js.getLogger("error");
    logger.warn('prueba de un warn dentro del error')
    logger.info('prueba del info dentro del warn')
    logger.error("prueba del error dentro del error");
    
    let args = parseArgs(process.argv);
    
    const info = {
                    plataform: process.platform,
                    nodeVersion: process.version,
                    memoryUsage: `${process.memoryUsage()['rss'] /1000000} MB`,
                    cwd: process.cwd(),
                    pID: process.pid,
                    folder:args._[1],
                    args: process.argv.slice(2),
                    procesadores: `cantidad procesadores: ${numCPUs}`

    }
   
    res.render('pages/information', {info:info});
    
}

function getRoot(req, res) {
    res.render('pages/login');
}

function getLogin(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('profile')
    } else {
        res.render('login');
    }
}

function getSignup(req, res) {
    console.log('entre al signup')
    res.render('pages/Signup');
}

function postLogin (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.redirect('login')
    }
}

function postSignup (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.redirect('login')
    }
}

function getProfile (req, res) {
    if (req.isAuthenticated()) {
        let user = req.user;
        res.render('profileUser', { user: user, isUser:true })
    } else {
        res.redirect('login')
    }
}

function getFaillogin (req, res) {
    console.log('error en login');
    res.render('login-error', {});
}

function getFailsignup (req, res) {
    console.log('error en signup');
    res.render('signup-error', {});
}

function getLogout (req, res) {
    req.logout( (err) => {
        if (!err) {
            res.redirect('/login');
        } 
    });
}

function failRoute(req, res){
    res.status(404).render('routing-error', {});
}

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        console.log('no logueado');
        res.redirect('/login');
    }
}


//  LOGIN
loginRouter.get('/login', async (req, res) => {
    res.render('pages/login');

})
loginRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin);

loginRouter.get('/faillogin', (req, res) => {

    res.send('intento de inicio de sesion no valido')
});

//  SIGNUP
loginRouter.get('/signup', getSignup);
loginRouter.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), postSignup);
loginRouter.get('/failsignup', (req, res) => {

    res.send('no pudimos crear su usuario')
});

loginRouter.get('/info', info);

loginRouter.get('/infoCompression',  infoCompression);

loginRouter.get('/', checkAuthentication, (req,res) =>{
 
    res.render('pages/index', {UserLogged: req.user.firstName});  

})

loginRouter.get('/logout',checkAuthentication, getLogout);


module.exports = {loginRouter, checkAuthentication}
