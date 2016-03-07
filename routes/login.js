var express = require('express');
var router = express.Router();
var passport = require("../passport.js");
// GET /login-github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
router.get('/login-github',
    //function(req, res){res.render("room", {title: "Room"})},
    passport.authenticate('github', { scope: [ 'user:email' ] }),
    function(req, res){
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    }
);
// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/github/callback',
    //login fail, back to "/", login again
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        //login success, go to "/room"
        res.redirect('/room');
    }
);
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
//app.get("/login", function(req, res){
//    res.render("login", { user: req.user });
//});

module.exports = router;
