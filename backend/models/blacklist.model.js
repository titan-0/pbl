const mongoose = require('mongoose');

const blacklisttokenSchema = new mongoose.Schema({
    token: { type: String, required: true,unique:true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // 86400 seconds = 24 hours
});

const Blacklist = mongoose.model('Blacklist', blacklisttokenSchema);

module.exports = Blacklist;