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
    var io = req.io;
    var userB = req.params.toUserB;
    var userA = req.user.oauthID;
    io.on("connection", function(socket){
        console.log("socket.id: ", socket.id);//info socket id
        /**
         * A SEND MSG TO B
         * 1. server receive msg from A to B (in client-side of this page, A send msg to server)
         * 2. server send this msg to B
         */
        //1. server receive msg to B (from someone to B)
        socket.on(userB, function(msgFromX){
            var msgFromXObject = JSON.parse(msgFromX);//parse object
            //console.log("msg: %s\nfrom: userID-%s\nto: userID-%s\n", msgFromXObject.msg, msgFromXObject.from, msgFromXObject.to);//info
            console.log("msgFromXOjebct: \n", msgFromXObject);
            //if this msg from A, send it to B, DONE
            if(msgFromXObject.from === userA){
                console.log("emit msg from userID-%s to userID-%s", userA, userB);
                //2. server send this msg to B, DONE
                socket.emit(userB, msgFromX);
            }
        });
        /**
         * LISTEN MSG FROM B
         * 1. server receive msg from B
         * 2. server notify this msg to A
         */
        //1. server receive msg to A (from someone to A)
        socket.on(userA, function(msgFromX){
            var msgFromXObject = JSON.parse(msgFromX);
            //console.log("msg: %s\nfrom: userID-%s\nto: userID-%s\n", msgFromXObject.msg, msgFromXObject.from, msgFromXObject.to);//info
            console.log("msgFromXOjebct: \n", msgFromXObject);
            //if this msg from B, send it to A, DONE
            if(msgFromXObject.from === userB){
                console.log("emit msg from userID-%s to userID-%s", userB, userA);
                //2. server notify this msg to A, DONE
                socket.emit(userA, msgFromX);
            }
        });
    });
    //var Message = require("../models/personal-message.js");
    //Message.collection.insert(msgAtoBObject, function (err, docs) {});
    ///**
    // * SERVER LOAD MSG between A and B
    // */
    //Message.find({from: userA_ID}, {to: userB_ID}, function(err, listMsgAtoB){
    //    listMsg = listMsg.concat(listMsgAtoB);
    //});
    //Message.find({from: userB_ID}, {to: userA_ID}, function(err, listMsgBtoA){
    //    listMsg = listMsg.concat(listMsgBtoA);
    //});
    //listMsg.sort(function(msgFirst, msgSecond){
    //    return new Date(msgSecond.createAt) - new Date(msgFirst.createAt);
    //});
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
