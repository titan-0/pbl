const usermodel = require('../models/user.model');
const captainmodel = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklisttokenmodel = require('../models/blacklist.model');

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
        console.log('Auth Headers:', req.headers); // Debug log
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader); // Debug log

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header missing or invalid format' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token); // Debug log

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log

        const captain = await captainmodel.findById(decoded._id);
        console.log('Captain found:', captain ? 'Yes' : 'No'); // Debug log

        if (!captain) {
            return res.status(401).json({ error: 'Captain not found' });
        }

        req.captain = captain;
        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({ error: `Invalid token: ${err.message}` });
    }
};