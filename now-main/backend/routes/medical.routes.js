const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const authmiddleware = require('../middleware/auth.middleware');
const usercontroller = require('../controlers/user.controller');
const captainController = require('../controlers/captain.controller');

router.post('/addmedicine', authmiddleware.authcaptain, [
    body('medicine_name').isLength({ min: 3 }).withMessage('Medicine name must be at least 3 characters long'),
    body('category').isLength({ min: 3 }).withMessage('Category must be at least 3 characters long'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
], captainController.addmedicine);

router.post('/searchmedicine', authmiddleware.authuser, [
    body('shop_name').isLength({ min: 3 }).withMessage('Shop name must be at least 3 characters long'),
    body('medicine_name').isLength({ min: 3 }).withMessage('Medicine name must be at least 3 characters long'),
], usercontroller.search);

router.post('/search-nearest', authmiddleware.authuser, [
    body('medicine_name').isLength({ min: 3 })
        .withMessage('Medicine name must be at least 3 characters long'),
    body('latitude').isFloat({ min: -90, max: 90 })
        .withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 })
        .withMessage('Invalid longitude')
], usercontroller.searchNearestMedicine);

module.exports = router;
