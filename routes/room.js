var express = require('express');
//var app = require("../app.js");
var router = express.Router();
/**
 * WE INSIDE "/room/*" namespace
 * each get("/url") below means go to "/room/url"
 */
/**
 * "/room" where we list all history message chat between userA with userX
 */
router.get('/', function (req, res) {
    var title = "server (^^)";
    res.render("room", {title: title});
});
/**
 * A chat with B through page: "/room/userB_ID"
 * in this page, A SEND MSG TO B,
 * then LISTEN MSG FROM B (on other page)
 * userB is recognized by userB_ID, so when send msg to B, means send msg to userB_ID
 */
router.get("/:toUserB", function (req, res) {
    //get server io (in this app, we use only io on namespace "/" as default)
    var ioServer = require("../io.js");
    //sender
    var userA = req.user.oauthID;
    //receiver
    var userB = req.params.toUserB;
    var PersonalMessage = require("../models/personal-message.js");
    //create namespace for userB, namespaceUserB, where B receive all msg from other people
    // if io has namespaceUserB, not create
    var nspUserB = "/" + userB;
    var namespaceUserB;
    if(ioServer.nsps[nspUserB]){
        //if has one, not create
        //if has namespaceUserB, get out
        namespaceUserB = ioServer.of(userB);
    }else{
        //create a new one
        var namespaceUserB = ioServer.of(userB);
        //run server, only one time
        namespaceUserB.on("connection", function(socket){
            //listen to new connection come
            //info namespace, socke.id
            console.log("namespace: %s, socket.id: ", userB, socket.id);
        });
    }
    //add middleware on socket
    namespaceUserB.use(function(socket, next){
        /**
         * A SEND MSG TO B
         * 1. server receive msg from A to B (in client-side of this page, A send msg to server)
         * 2. server send this msg to B
         */
        //1. server receive msg to B (from someone to B)
        socket.on(userB, function(msgFromXObject){
            //log msg info
            console.log("msgFromXObject: ", msgFromXObject);
            //[2bis]. store to database
            PersonalMessage.collection.insert(msgFromXObject, function(err, list){
                //do nothing
            });
            //if this msg from A, send it to B, DONE
            if(msgFromXObject.from === userA){
                console.log("emit msg from userA-%s to userB-%s", userA, userB);
                //2. server send this msg to B, DONE
                //if B chat with A, where clientB locate? namespaceUserA
                //to send msg to B, send msg in namespaceUserA :)
                var nspUserA = "/" + userA;
                //check if namespaceUser has exist
                if(ioServer.nsps[npsUserA]){
                    //get namespaceUserA from ioServer
                    var namespaceUserA = ioServer.of(userA);
                    //use this namespace, notify to B (all memebers in this nsp)
                    namespaceUserA.emit(userA, msgFromXObject);
                }else{
                    //if this namespaceUserA not establish > B not ready chat with A
                    //no need to modify anything
                }
            }
        });
        /**
         * LISTEN MSG FROM B
         * 1. server receive msg from B
         * 2. server notify this msg to A
         */
        //1. server receive msg to A (from someone to A)
        //remeber B from A, must get namespaceUserA to send msg to A, like what we did with A above
        socket.on(userA, function(msgFromXObject){
            //log msg info
            console.log("msgFromXObjectOjebct:", msgFromXObject);
            //store it
            PersonalMessage.collection.insert(msgFromXObject, function(err, list){
                //do nothing
            });
            //if this msg from B, send it to A, DONE
            if(msgFromXObject.from === userB){
                console.log("emit msg from userID-%s to userID-%s", userB, userA);
                //2. server notify this msg to A, DONE
                //the reason why use emit not broadcast.emit, server-clientA talk directly under namespaceUserB
                socket.emit(userA, msgFromXObject);
            }
        });
    });
    /**
     * RESPONE: userA_ID, userB_ID, listMsg
     * userA_ID, who send msg,
     * userB_ID, who receive
     * listMsg, chat between A and B
     */
    var title = "chat with " + userB;
    res.render("message", {title: title, userA: userA, userB: userB});
});
module.exports = router;
