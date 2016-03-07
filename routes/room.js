var express = require('express');
//var app = require("../app.js");
var router = express.Router();
//var server = app.server;
//var socket_io = require("socket.io");
//var io = socket_io(server, {});
//GET /room
var exist_room = [];
router.get('/', function (req, res) {
    res.render('room', {title: 'redocChat'});
});
//test io when exports, the attach to app
router.get("/minion", function(req, res){
    //get io from req
    var io = req.io;
    var namespace_io = io.of("/room/minion");
    //setup connection
    namespace_io.on("connection", function(socket){
        //send msg to client
        socket.emit("/room/minion", "server get you");
        //listen from client
        socket.on("/room/minion", function(msg){
            socket.emit("/room/minion", "server get msg: " + msg);
        });
    });
    res.render("minion");
});
router.get("/:roomID", ensureAuthenticated, function (req, res) {

});
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //login fail, back to "/", login again
    res.redirect('/')
}


module.exports = router;
