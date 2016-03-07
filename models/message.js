var mongoose = require('mongoose');
// define the schema for our user
var userSchema = mongoose.Schema({
    message: String,
    create_at: String,
    userID: Array
});
// create the model for users and expose it to our app
module.exports = mongoose.model('Message', userSchema);