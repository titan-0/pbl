const express=require('express');
const router = express.Router();
const {body} = require('express-validator');
const usercontroller = require('../controlers/user.controller');
const authmiddleware = require('../middleware/auth.middleware');
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be atleast 3 characters long'),
    body('password').isLength({min: 6}).withMessage('password must be of length 6 or greater than 6')
],
usercontroller.registeruser
)
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('password must be of length 6 or greater than 6')
],
usercontroller.loginuser
)
router.get('/profile',authmiddleware.authuser,usercontroller.getuserprofile)
router.get('/logout',authmiddleware.authuser,usercontroller.logoutuser)

router.post('/PlaceOrder',[
    body('storeemail').isEmail().withMessage('Invalid Store Email'),
    body('medicineName').isLength({min: 3}).withMessage('Medicine name must be atleast 3 characters long'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('address').isLength({min: 10}).withMessage('Address must be atleast 10 characters long'),
    body('number').isMobilePhone().withMessage('Invalid phone number')
],usercontroller.placeorder);

module.exports = router;