var log4j_2 = require("./log4j-2.js");
//User table from mongodb database
//find user from userID
var User = require("./models/user.js");
//store active users
var list_active_users = {};
var socket_server_side = function(socket){
    //notify new socket connected
    //1. get userID from socket handshake request
    //get cookie
    var cookie = socket.handshake.headers.cookie; log4j_2.info("socket.id", socket.id); log4j_2.info(cookie);
    var key = "userID";
    //get userID from cookie string
    //noinspection JSCheckFunctionSignatures
    var keyValueArray = cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    var userID = keyValueArray? keyValueArray[2]:null; log4j_2.info(userID);
    //2. find this userID in User table
    User.findOne({oauthID: userID}, function(err, user){
        //if find success, !err, user !== null (findOne, return user object|null)
        if(!err && user !== null){
            //add this socket to room, name: userID
            log4j_2.info("find user: %s", user.displayName);
            socket.join(userID); log4j_2.info("socket join room");
            //if this socket come from NEW-ACTIVE-USER
            if(list_active_users[userID]){
                //do nothing, user added
                log4j_2.info("user added: %s", userID);
            }else{
                //add to list-active-users, then notify to others
                list_active_users[userID] = user; log4j_2.info("add new user: %s", userID);
                socket.broadcast.emit("new-active-user", user); log4j_2.info("emit to all sockets a new-active-user: ", user.displayName);
            }
        }
    });
    //3. when user need list-active-users to choose someone chat with
    socket.on("list-active-users", function(msg){
        //client ask for list-active-users
        //notify him, directly
        log4j_2.info(msg);
        //socket.to(socket.id).emit("list-active-users", list_active_users);
        socket.emit("list-active-users", list_active_users);
    });
    //4. listen msg from user, send it to who he want to chat with
    socket.on("clientChatMsg", function(msgObject){
        var receiver = msgObject.to;
        socket.to(receiver).emit("clientChatMsg", msgObject);
        //if get userID >>> send msg to userA
        //why?
        //userA can open many tabs >>> chat a one tab need append on others
        //userA is unique by userID, not by socket
        var sender = msgObject.from; log4j_2(msgObject.from);
        socket.broadcast.to(sender).emit("clientChatMsg", msgObject); log4j_2.info("send to sender %s", userID);
    });
};
module.exports = socket_server_side;
