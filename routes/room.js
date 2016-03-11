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
router.get("/:toUserB", function (req, res) {
    res.render("message", {title: "abc"});
});
module.exports = router;
