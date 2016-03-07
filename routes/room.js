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
router.get("/:emitTo", ensureAuthenticated, function (req, res) {
    /**
     * SETUP CONNECTION for A chat to B
     * server receive msg from A, store it, then emit to B
     */
    var io = req.io;
    var userB_ID = req.params.emitTo;
    var namespaceIo = io.of(userB_ID);
    //get Message to store msg from client
    var Message = require("../models/message.js");
    namespaceIo.on("connection", function(socket){
        //server listen to msg send from A to B, on userB_ID, where A want to send msg
        socket.on(userB_ID, function(msgAtoB){
            //get json object from msgAtoB
            var msgAtoBObject = JSON.parse(msgAtoB);
            //store into database
            Message.collection.insert(msgAtoBObject, onInsert);
            function onInsert(err, docs) {
                if (err) {
                    // TODO: handle error
                } else {
                    console.info('%d message were successfully stored.', docs.length);
                }
            }
            //send msgAtoB, from A to B
            socket.broadcast.emit(userB_ID, msgAtoB);
        });
    });
    /**
     * SERVER LOAD MSG between A and B
     */
    //load msg from A to B
    var userA_ID = req.user.id;
    var listMsg = [];
    Message.find({on: userA_ID}, {emit: userB_ID}, function(err, listMsgAtoB){
        listMsg = listMsg.concat(listMsgAtoB);
    });
    Message.find({on: userB_ID}, {emit: userA_ID}, function(err, listMsgBtoA){
        listMsg = listMsg.concat(listMsgBtoA);
    });
    listMsg.sort(function(msgFirst, msgSecond){
        return new Date(msgSecond.createAt) - new Date(msgFirst.createAt);
    });
    /**
     * RESPONE: userA_ID, userB_ID, listMsg
     * userA_ID, who send msg,
     * userB_ID, who receive
     * listMsg, chat between A and B
     */
    res.render("message", {userA_ID: userA_ID, userB_ID: userB_ID, listMsg: listMsg});
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
