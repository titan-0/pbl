const captainService = require('../services/captain.services');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklist.model');
const medicineservice = require('../services/medicine.services');

module.exports.registercaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { shopname, fullname, email, password, shop } = req.body;

    try {
        // Check if the captain is already registered
        const isCaptainExist = await captainService.findCaptainByEmail(email);
        if (isCaptainExist) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // Create new captain entry using the service
        const newCaptain = await captainService.createcaptain({
            shopname,
            fullname,
            email,
            password,
            shop
        });

        // Generate authentication token
        const token = newCaptain.generateAuthToken();
        res.cookie('token', token, { httpOnly: true });

        return res.status(201).json({ token, captain: newCaptain });
    } catch (error) {
        return next(error);
    }
};

module.exports.logincaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const captain = await captainService.findCaptainByEmail(email, true);
        if (!captain) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password match
        const isMatch = await captain.comparepassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate authentication token
        const token = captain.generateAuthToken();
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({ token, captain });
    } catch (error) {
        return next(error);
    }
};

module.exports.getcaptainprofile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
};

module.exports.logoutcaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: 'No token found' });
        }

        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Captain logged out successfully' });
    } catch (error) {
        return next(error);
    }
};

module.exports.addmedicine = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.captain) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }

    const { medicine_name, category, price, quantity } = req.body;

    try {
        // Check if the medicine is already registered
        const isMedicineExist = await medicineservice.findMedicineByName(medicine_name);
        if (isMedicineExist) {
            return res.status(400).json({ message: 'Medicine already exists' });
        }

        // Create new medicine entry using the service
        const newmedicine = await medicineservice.addmedicine({
            medicine_name,
            category,
            price,
            quantity
        });

        return res.status(201).json({ medicine: newmedicine });
    } catch (error) {
        return next(error);
    }
};

