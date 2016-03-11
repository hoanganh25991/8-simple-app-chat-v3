var io = require('socket.io')();
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
module.exports = io;
