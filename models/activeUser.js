var mongoose = require('mongoose');
// define the schema for our user
var userSchema = mongoose.Schema({
    userOauthID: String,
    socketID: String
});
// create the model for users and expose it to our app
module.exports = mongoose.model('ListActiveUsers', userSchema);