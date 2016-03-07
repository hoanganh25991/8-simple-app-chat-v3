var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    var userA = req.user;
    /**
     * ACTIVE USERS: add this user to listActiveUsers
     */
    var listActiveUsers = req.listActiveUsers;
    var io = require("../io.js");
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
    res.render('contact', {userA_ID: userA.oauthID, listActiveUsers: listActiveUsers});
});
module.exports = router;
