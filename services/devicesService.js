let logger = require('../helpers/logger')('Device Service');
const socketService = require('./socketService');

class DevicesService {
    constructor() {
        this.devices = [];
        this.poolInterval = setInterval(this.clearPool.bind(this), 1000);
    }
    hearthBeat(ip, longitude, latitude) {
        logger.info(`Hearthbeat from ${ip}`)
        let device = this.devices.find(device => device.ip == ip);
        if(device) {
            device.lastActive = Date.now();
            if(longitude != null) device.longitude = longitude;
            if(latitude != null) device.latitude = latitude;
        } else {
            this.devices.push({
                ip,
                longitude,
                latitude,
                lastActive: Date.now()
            })
        }
        socketService.sendDevices(this.devices);
    }
    clearPool() {
        for (let i = 0; i < this.devices.length; i++) {
            let device = this.devices[i];
            if(Date.now() - device.lastActive > 2 * 60 * 1000) {
                this.devices.splice(this.devices.findIndex(d => d.ip == device.ip));
                i--;
            }
        }
        socketService.sendDevices(this.devices);
    }
}

module.exports = new DevicesService();