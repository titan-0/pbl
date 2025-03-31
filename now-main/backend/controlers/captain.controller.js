const captainService = require('../services/captain.services');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklist.model');
const medicineservice = require('../services/medicine.services');
const ShopModel = require('../models/medicaldata');
const captainmodel = require('../models/captain.model');
 // Add this line at the top

 const jwt = require('jsonwebtoken');
 const Captain = require('../models/captain.model');
 
 module.exports.getCaptain = async (req, res) => {
   try {
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ message: 'Authorization header missing or invalid' });
     }
 
     const token = authHeader.split(' ')[1];
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
     const captain = await Captain.findById(decoded._id);
     if (!captain) {
       return res.status(404).json({ message: 'Captain not found' });
     }
 
     res.json({ captain });
   } catch (error) {
     console.error('Error fetching captain data:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 };

module.exports.registercaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shopname, fullname, email, password, phoneNumber, shop } = req.body;

        // Validate coordinates
        const [longitude, latitude] = shop.location.coordinates;
        if (typeof longitude !== 'number' || typeof latitude !== 'number') {
            return res.status(400).json({ message: 'Coordinates must be numbers' });
        }

        // Check if captain exists
        const existingCaptain = await captainmodel.findOne({ email });
        if (existingCaptain) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await captainmodel.hashpassword(password);

        // Create new captain
        const newCaptain = new captainmodel({
            shopname,
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            shop: {
                shop_address: shop.shop_address,
                gstNumber: shop.gstNumber,
                licenseNumber: shop.licenseNumber,
                services: shop.services,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            }
        });
        await newCaptain.save();
        const newShop = new ShopModel({
            email,
            medicines: [] // Initialize with an empty array of medicines
        })
        await newShop.save();
       

        // Generate token
        const token = newCaptain.generateAuthToken();
        console.log('Captain registered successfully:', newCaptain)
        return res.status(201).json({
            success: true,
            token,
            captain: newCaptain
           
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports.logincaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        console.log('Login attempt for:', email); // Debug log

        // Find captain and include password
        const captain = await captainmodel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isMatch = await captain.comparepassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = captain.generateAuthToken();
        captain.password = undefined; // Remove password from response

        return res.status(200).json({
            success: true,
            token,
            captain
        });
    } catch (error) {
        console.error('Login error:', error); // Debug log
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
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
        res.status(200).json({ message: 'logged out successfully' });
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

    const { email } = req.captain; 
    const { medicine_name, category, price, quantity } = req.body;

    try {
        // Find the shop by shop_name (use req.captain.shopname)
        const shop = await ShopModel.findOne({ email: email });
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // Check if the medicine already exists in this shop's medicines array
        const isMedicineExist = shop.medicines.some(med => med.medicine_name === medicine_name);
        if (isMedicineExist) {
            return res.status(400).json({ message: 'Medicine already exists in this shop' });
        }

        // Add the new medicine to the shop's medicines array
        shop.medicines.push({ medicine_name, category, price, quantity });
        
        // Save the updated shop
        await shop.save();

        return res.status(201).json({ message: 'Medicine added successfully', shop });
    } catch (error) {
        return next(error);
    }
};
