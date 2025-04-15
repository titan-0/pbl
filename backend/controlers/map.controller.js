const mapservice = require('../services/map.services');
const { validationResult } = require('express-validator');

module.exports.getaddresscoordinate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;

    try {
        const coordinates = await mapservice.getaddresscoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
};

module.exports.getdistancetime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;

    try {
        const distanceTime = await mapservice.getdistancetime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        res.status(404).json({ message: 'Route not found' });
    }
};

module.exports.getDistanceByNames = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { originName, destinationName } = req.query;

    try {
        const distanceData = await mapservice.getDistanceByNames(originName, destinationName);
        res.status(200).json(distanceData);
    } catch (error) {
        res.status(404).json({ message: 'Route not found' });
    }
};

module.exports.getsuggestions = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { input } = req.query;

    try {
        const suggestions = await mapservice.getsuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};