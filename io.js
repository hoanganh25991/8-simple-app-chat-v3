//setup socket-io
//var setup_socket_io = function(server, roomID){
//    //roomID = "/room/minion";
//    var namespace_io = io.of(roomID);
////handle socket connection
//    var num_user = 0;
////noinspection JSUnresolvedFunction
//    namespace_io.socket.on("connection", function(socket){
//        //when user connected, increate num_user
//        num_user++;
//        console.log(num_user + " connected");
//        //store this user into list-active-users
//        //var list = require("./list-active-users.js");
//        //list.add(req.user);
//        //console.log(list);
//        //server listen on roomID, save msg from client
//        socket.on(roomID, function(client_msg){
//            console.log("msg: " + client_msg);
//            //noinspection JSUnresolvedVariable
//            socket.broadcast.emit(roomID, client_msg);
//        });
//        //server listen on user-disconnect
//        socket.on("disconnect", function(){
//            //user disconnected from room, decrease num_user
//            num_user--;
//            console.log(num_user + " connected");
//        });
//    });
////    var roomID = "/room/minion";
////    var namespace_io = io.of(roomID);
//////handle socket connection
////    var num_user = 0;
//////var list_active_users = require("../list-active-users.js");
//////noinspection JSUnresolvedFunction
////    namespace_io.on("connection", function(socket){
////        //when user connected, increate num_user
////        num_user++;
////        console.log(num_user + " connected");
////        //store this user into list-active-users
////        var list = require("../list-active-users.js");
////        list.add(req.user);
////        console.log(list);
////        //server listen on roomID, save msg from client
////        socket.on(roomID, function(client_msg){
////            console.log("msg: " + client_msg);
////            //noinspection JSUnresolvedVariable
////            socket.broadcast.emit(roomID, client_msg);
////        });
////        //server listen on user-disconnect
////        socket.on("disconnect", function(){
////            //user disconnected from room, decrease num_user
////            num_user--;
////            console.log(num_user + " connected");
////        });
////    });
//    return io;
//};
var io = require('socket.io')();
io.setup_personal = function(io, roomID){
    //roomID = "/room/minion";
    console.log("roomID: %s", roomID);
    var namespace_io = io.of(roomID);
//handle socket connection
    var num_user = 0;
//noinspection JSUnresolvedFunction
    namespace_io.on("connection", function(socket){
        //when user connected, increate num_user
        num_user++;
        console.log(num_user + " connected");
        //server listen on roomID, save msg from client
        socket.on(roomID, function(client_msg){
            console.log("msg: " + client_msg);
            //store to database
            //noinspection JSUnresolvedVariable
            socket.broadcast.emit(roomID, client_msg);
        });
    });
    return io;
};
module.exports = io;
