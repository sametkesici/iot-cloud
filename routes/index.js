const express = require('express');
const router = express.Router();
const records = require('../models/record');
const logger = require('../helpers/logger');
const devicesService = require('../services/devicesService');
const moment = require('moment');
const socket = require('../services/socketService');

const log = logger('IncomingRequests')
/* GET home page. */
router.get('/', async (req, res, next) => {
  let allRecords = await records.find().lean().sort({ _id: -1 }).limit(30)
  for (const record of allRecords) {
    record.date = new Date(record.date).toLocaleString("tr-TR")
  }
  res.render('index', { title: 'IOT', devices: devicesService.devices, records: allRecords });
});

router.post('/data', async (req, res, next) => {
  console.log('req.body :>> ', req.body);
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  log.info(`New request from ${ip}`);
  let newRequest = {
    ip,
    fireAlert: req.body.fireAlert == 0,
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    pressure: req.body.pressure,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    date: new Date()
  }
  devicesService.hearthBeat(ip, newRequest.longitude, newRequest.latitude);
  console.log('devicesService.devices :>> ', devicesService.devices);
  console.log('newRequest :>> ', newRequest);
  let savedRecord = await records.create(newRequest).catch(err => {
    log.error(err);
    return res.json({success: 0});
  })
  log.info(`Request from ${ip} saved successfully`);
  socket.sendNewRecord(newRequest);
  return res.json({success: 1});
})

module.exports = router;
