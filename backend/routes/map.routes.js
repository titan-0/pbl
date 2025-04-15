const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/auth.middleware');
const mapcontroller = require('../controlers/map.controller');
const { query } = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authmiddleware.authuser,
    mapcontroller.getaddresscoordinate
);

router.get('/get-distance-by-names',
    query('originName').isString().isLength({ min: 3 }),
    query('destinationName').isString().isLength({ min: 3 }),
    authmiddleware.authuser,
    mapcontroller.getDistanceByNames
);

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authmiddleware.authuser,
    mapcontroller.getsuggestions
);

module.exports = router;