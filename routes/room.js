var express = require('express');
//var app = require("../app.js");
var router = express.Router();
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
router.get("/:emitTo", function (req, res) {
    /**
     * SETUP CONNECTION for A chat to B
     * server receive msg from A, store it, then emit to B
     */
    var io = req.io;
    var userB_ID = req.params.emitTo;
    //console.log("userB_ID: ",userB_ID);
    var namespaceIo = io.of(userB_ID);
    //get Message to store msg from client
    var Message = require("../models/message.js");
    namespaceIo.on("connection", function(socket){
        //server listen to msg send from A to B, on userB_ID, where A want to send msg
        socket.on(userB_ID, function(msgAtoB){
            //get json object from msgAtoB
            var msgAtoBObject = JSON.parse(msgAtoB);
            //store into database
            Message.collection.insert(msgAtoBObject, function (err, docs) {
                if (err) {
                    // TODO: handle error
                } else {
                    console.info('%d message were successfully stored.', docs.length);
                }
            });

            //send msgAtoB, from A to B
            socket.broadcast.emit(userB_ID, msgAtoB);
        });
    });
    /**
     * SERVER LOAD MSG between A and B
     */
    //load msg from A to B
    var userA_ID = req.user.oauthID;
    var listMsg = [];
    Message.find({from: userA_ID}, {to: userB_ID}, function(err, listMsgAtoB){
        listMsg = listMsg.concat(listMsgAtoB);
    });
    Message.find({from: userB_ID}, {to: userA_ID}, function(err, listMsgBtoA){
        listMsg = listMsg.concat(listMsgBtoA);
    });
    listMsg.sort(function(msgFirst, msgSecond){
        return new Date(msgSecond.createAt) - new Date(msgFirst.createAt);
    });
    /**
     * ACTIVE USERS: add this user to listActiveUsers
     */
    var listActiveUsers = req.listActiveUsers;
    io.on("connection", function(socket){
        //store this user into listActiveUsers
        if(!listActiveUsers.hasOwnProperty(req.user.oauthID)){
            //store key-value pair, easy for compare by hasOwnProperty(key)
            listActiveUsers[req.user.oauthID] = req.user;
            console.log("req.user: ", req.user);console.log("listActiveUsers: ", listActiveUsers);
            //notify any people in active-users room (inclue this-user)
            socket.emit("active-users", JSON.stringify(req.user));
            //attach this listActiveUsers to request
            req.listActiveUsers = listActiveUsers;
        }
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



module.exports = router;
