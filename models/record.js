const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    ip: String,
    fireAlert: Boolean,
    temperature: Number,
    humidity: Number,
    pressure: Number,
    latitude: Number,
    longitude: Number,
    date: Date
});

const record = mongoose.model('record', schema);

module.exports = record;