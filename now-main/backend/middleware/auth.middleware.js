const usermodel = require('../models/user.model');
const captainmodel = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklisttokenmodel = require('../models/blacklist.model');
const logger = require('../utils/logger');

module.exports.authuser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'authorization denied' });
    }
    const isblacklisted = await blacklisttokenmodel.findOne({ token });
    if (isblacklisted) {
        return res.status(401).json({ msg: 'unauthorised access' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded._id);

        req.user = user;

        return next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports.authcaptain = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header missing or invalid format' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainmodel.findById(decoded._id);

        if (!captain) {
            return res.status(401).json({ error: 'Captain not found' });
        }

        req.captain = captain;
        next();
    } catch (err) {
        logger.warn('captain_auth_failed', { error: err });
        return res.status(401).json({ error: `Invalid token: ${err.message}` });
    }
};
