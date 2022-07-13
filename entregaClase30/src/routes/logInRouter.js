// ------------------------------------------------------------------------------
//  ROUTING
// ------------------------------------------------------------------------------
const parseArgs = require('minimist');
const numCPUs = require("os").cpus().length;

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
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/login");
    }
}

info = (req, res) => {
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

module.exports = {
    getRoot,
    getLogin,
    postLogin,
    getFaillogin,
    getLogout,
    failRoute,
    getSignup,
    postSignup,
    getFailsignup,
    checkAuthentication,
    getProfile,
    info
}
  