const usermodel = require('../models/user.model');
const userservies = require('../services/user.services');
const { validationResult } = require('express-validator');
const blacklisttokenmodel = require('../models/blacklist.model');
const medi = require('../services/medicine.services');
const { findNearestMedicinesByName } = require('../services/medicine.services');

module.exports.registeruser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const isuseralreadyexist = await usermodel.findOne({ email });
    if (isuseralreadyexist) {
        return res.status(400).json({ msg: 'User already exist' });
    }

    const hashpassword = await usermodel.hashpassword(password);

    const user = await userservies.createuser({
        firstname: fullname.firstname, lastname: fullname.lastname, email, password: hashpassword
    });
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
}

module.exports.loginuser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await usermodel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ msg: 'Invalid Email or Password' });
    }

    const isMatch = await user.comparepassword(password);
    if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid Email or Password' });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
}

module.exports.getuserprofile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutuser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklisttokenmodel.create({ token });

    res.status(200).json({ msg: 'Logged out successfully' });
}

module.exports.search = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }

    const { shop_name, medicine_name } = req.body;

    try {
        const search_result = await medi.findMedicineByName(shop_name, medicine_name);
        return res.status(200).json({ search_result });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

module.exports.searchNearestMedicine = async (req, res) => {
    try {
        // Validation check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Auth check
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Please log in'
            });
        }

        const { medicine_name, latitude, longitude } = req.body;

        // Input validation
        if (!medicine_name || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        const searchResult = await findNearestMedicinesByName(
            { latitude, longitude },
            medicine_name
        );

        return res.status(200).json(searchResult);

    } catch (error) {
        console.error('Search error:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports.placeorder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const { user,storeemail, medicineName, quantity, address, number } = req.body;

    try {
        const order = await userservies.placeOrder({
            email:user,
            storeemail:storeemail,
            medicineName,
            quantity,
            address,
            number
        });

        res.status(201).json({ order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order. Please try again later.' });
    }
}






