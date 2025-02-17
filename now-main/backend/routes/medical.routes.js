const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const captainController = require('../controlers/captain.controller');
const authmiddleware = require('../middleware/auth.middleware');
const usercontroller = require('../controlers/user.controller');

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

module.exports = router;
