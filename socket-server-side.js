var logger = require("tracer").colorConsole();
//User table from mongodb database
//find user from userID
var User = require("./models/user.js");
//store active users
var list_active_users = {};
var socket_server_side = function(socket){
    //notify new socket connected
    logger.info(socket.id);
    //1. get userID from socket handshake request
    //get cookie
    var cookie = socket.handshake.headers.cookie;
    logger.info(cookie);
    var key = "userID";
    //get userID from cookie string
    //noinspection JSCheckFunctionSignatures
    var keyValueArray = cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    var userID = keyValueArray? keyValueArray[2]:null;
    logger.info(userID);
    //2. find this userID in User table
    User.findOne({oauthID: userID}, function(err, user){
        //if find success, !err, user !== null (findOne, return user object|null)
        if(!err && user !== null){
            //add this socket to room, name: userID
            logger.info(user);
            socket.join(userID);
            //if this socket come from NEW-ACTIVE-USER
            if(list_active_users[userID]){
                //do nothing, this user added
                logger.info("user added: %s", userID);
            }else{
                //add to list-active-users, then notify to others
                logger.info("add new user: %s", userID);
                list_active_users[userID] = user;
                logger.info("emit to all sockets new-active-user", user);
                socket.broadcast.emit("new-active-user", user);
            }
        }
    });
    //3. when user need list-active-users to choose someone chat with
    socket.on("list-active-users", function(){
        //client ask for list-active-users
        //notify him, directly
        socket.to(socket.id).emit("list-active-users", list_active_users);
    });
    //4. listen msg from user, send it to who he want to chat with
    socket.on("clientChatMsg", function(msgObject){
        var receiver = msgObject.to;
        socket.to(receiver).emit("clientChatMsg", msgObject);
    });
};
module.exports = socket_server_side;
