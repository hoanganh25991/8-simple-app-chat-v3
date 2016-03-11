var ioServer = require('socket.io')();
var redis = require('socket.io-redis');
ioServer.adapter(redis({ host: 'localhost', port: 6379 }));
module.exports = ioServer;
