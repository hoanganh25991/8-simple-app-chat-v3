//module dependencies
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoose = require("mongoose");
//get application-context
var app = express();
//setup middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
//setup views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
//setup passport
var passport = require("./passport.js");
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
//setup socket-io
var io = require("./io.js");
app.use(function(req, res, next){
    req.io = io;//attach to req for global use in routes
    next();
});
//setup routes
var welcome = require("./routes/index.js");
var login = require("./routes/login.js");
var room = require("./routes/room.js");
var contact = require("./routes/contact.js");
app.use("/", welcome);
app.use("/", login);
app.use("/room", room);
app.use("/contact", contact);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = Error("Not Found");
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});
//setup socket-io
//var io = require("./io.js");
//export this file app.js to module.exports, variable "app"
//app.
module.exports = app;

