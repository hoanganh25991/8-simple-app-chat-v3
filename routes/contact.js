var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    var userA = req.user;
    //var listActiveUsers;
    var ListActiveUsers = require("../models/activeUser.js");
    ListActiveUsers.find({}).where("userOauthID").ne(req.user.oauthID).exec(function(err, list){
        //listActiveUsers = list;
        //console.log("listActiveUsers: ", listActiveUsers);
        //res.render('contact', {userA_ID: userA.oauthID, listActiveUsers: listActiveUsers});
        console.log("listActiveUsers: ", list);
        var User = require("../models/user.js");
        var listActiveUsers = [];
        var listLength = list.length;
        //if active-user is this-user, obmit
        for(var i = 0; i < listLength; i++){
            User.findOne({oauthID: list[i].userOauthID}, function(err, user){
                //console.log("user: ", user);
                //user here is a collection [], not a single object {} >>> loop in listActiveUsers WRONG
                listActiveUsers.push(user);
                console.log("listActiveUsers.length: ", listActiveUsers.length);
                if(listActiveUsers.length == listLength){
                    console.log("go into res.render");
                    console.log("listActiveUsers: ", listActiveUsers);
                    res.render('contact', {userA_ID: userA.oauthID, listActiveUsers: listActiveUsers});
                }
            });
        }
        //res.render('contact', {userA_ID: userA.oauthID, listActiveUsers: listActiveUsers});//listActiveUsers empty bcs asynchorous task from User.find, res.render execute while listActiveUsers not complete add
        //while(listActiveUsers.length < list.length){
        //    //if listActiveUsers still not push enough record
        //    //do nothing, wait for him
        //}
        //res.render('contact', {userA_ID: userA.oauthID, listActiveUsers: listActiveUsers})
    });

});
module.exports = router;
