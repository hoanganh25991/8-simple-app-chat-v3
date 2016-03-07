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
router.get("/:roomID", ensureAuthenticated, function (req, res) {
    var roomID = "/room" + "/" + req.params.roomID;
    //var server = req.socket.server;
    if (!exist_room.hasOwnProperty(roomID)) {
        var settup_personal = require("../io.js").setup_personal;
        settup_personal(req.io, roomID);
        exist_room[roomID] = "ok";
        console.log("exist_room: %s", exist_room);
    }
    res.render("message", {title: roomID, roomID: roomID});
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
