var socket_io = require('socket.io');
const devicesService = require('./devicesService');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    socketApi.sendDevices(devicesService.devices);
});

socketApi.sendNewRecord = function(record) {
    io.sockets.emit('newRecord', record);
}

socketApi.sendDevices = function(devices) {
    io.sockets.emit('allDevices', devices);
}

module.exports = socketApi;