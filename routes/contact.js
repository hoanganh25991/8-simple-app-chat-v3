var express = require('express');
var router = express.Router();
var User = require("../models/user.js");
var isRoomContactConnect = false;
/* GET home page. */
router.get('/', function(req, res) {
    ////var list_active_users = require("../list-active-users.js");
    ////console.log(list_active_users.get);
    ////store this user into list-active-users
    ////var list = require("../list-active-users.js");
    ////list.add(req.user);
    ////console.log(list);
    ////var list_user = {};
    //var list_rooms = [];
    //var this_user_id = req.user.appID;
    //User.find({}, function(err, user){
    //    var list_user = user;
    //    var roomInfo = {};
    //    //console.log(list_user);
    //    for(var i = 0; i < list_user.length; i++){
    //        if(this_user_id != list_user[i].appID){
    //            roomInfo.roomName = list_user[i].username;
    //            roomInfo.roomID = generateRoomID(this_user_id, list_user[i].appID)
    //            list_rooms.push(roomInfo);
    //        }
    //    }
    //    console.log(list_rooms);
    //});
    //where notify active_users
    if(!isRoomContactConnect){
        var roomID = "/contact";
        console.log("roomID: %s", roomID);
        var io = req.io;
        var namespace_io = io.of(roomID);
        //handle socket connection
        //noinspection JSUnresolvedFunction
        namespace_io.on("connection", function(socket){
            //when user connected, increate num_userbn
            //server listen on roomID, save msg from client
            socket.on(roomID, function(current_user_appID){
                User.findOne({appID: current_user_appID}, function(err, user){
                    socket.broadcast.emit(roomID, JSON.stringify(user));
                })
            });
        });
        isRoomContactConnect = true;
    }
    res.render('contact', { title: 'Contact', userAppID: req.user.appID});
});
module.exports = router;
