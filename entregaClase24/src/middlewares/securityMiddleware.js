function ValidateLogin(req,res,next) {
    
    if (req.session?.logged) {
        next();
    }
    else {
        console.log('no logueado');
        res.redirect('/login');
    }

};



module.exports = ValidateLogin;