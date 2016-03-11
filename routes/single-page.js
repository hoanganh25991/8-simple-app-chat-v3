var express = require('express');
//var app = require("../app.js");
var router = express.Router();
router.get('/', function (req, res) {
    var title = "server (^^)";
    var userID = req.user.oauthID;
    res.render("single-page", {title: title, userA_sender: userID});
});
router.get("/:toUserB", function (req, res) {
    res.render("message", {title: "abc"});
});
module.exports = router;
