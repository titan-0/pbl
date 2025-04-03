const axios = require('axios');
const captainmodel = require('../models/captain.model');

module.exports.getaddresscoordinate = async (address) => {
    const apiKey  = process.env.GRAPHHOPPER_KEY;
    const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.hits && response.data.hits.length > 0) {
            const { lat, lng } = response.data.hits[0].point;
            return { latitude: lat, longitude: lng };
        } else {
            throw new Error('No coordinates found for the given address');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

module.exports.getdistancetime = async (origin, destination) => {
    try {
        console.log(`Fetching distance and time between ${origin} and ${destination}`);
        const apiKey = process.env.GRAPHHOPPER_KEY;
        const url = `https://graphhopper.com/api/1/route?point=${origin}&point=${destination}&profile=car&locale=en&calc_points=false&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.paths && response.data.paths.length > 0) {
            // console.log('GraphHopper API Response:', response.data);
            const distance = response.data.paths[0].distance; // Distance in meters
            const time = response.data.paths[0].time;         // Time in milliseconds

            // console.log(`Distance: ${distance} meters, Time: ${time} milliseconds`);

            return {
                distance: (distance / 1000).toFixed(2), // Convert meters to kilometers
                time: Math.round(time / 60000)         // Convert milliseconds to minutes
            };
        } else {
            throw new Error('No route found for the given origin and destination');
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw error;
    }
};

module.exports.getDistanceByNames = async (originName, destinationName) => {
    try {
        const originCoordinates = await module.exports.getaddresscoordinate(originName);
        const destinationCoordinates = await module.exports.getaddresscoordinate(destinationName);

        const apiKey = process.env.GRAPHHOPPER_KEY;
        const url = `https://graphhopper.com/api/1/route?point=${originCoordinates.latitude},${originCoordinates.longitude}&point=${destinationCoordinates.latitude},${destinationCoordinates.longitude}&profile=car&locale=en&calc_points=false&key=${apiKey}`;

        const response = await axios.get(url);
        if (response.data.paths && response.data.paths.length > 0) {
            const distance = response.data.paths[0].distance / 1000;  // Convert meters to km
            let duration = response.data.paths[0].time / 60000; // Convert ms to minutes

            // Convert duration to hours if it is greater than 60 minutes
           
                return { distance, duration };
            
        } else {
            throw new Error('No route found for the given origin and destination');
        }
    } catch (error) {
        console.error('Error fetching distance by names:', error);
        throw error;
    }
};

module.exports.getsuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }
    const apiKey = process.env.GRAPHHOPPER_KEY;
    const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.hits && response.data.hits.length > 0) {
            return response.data.hits.map(hit => ({
                name: hit.name,
                latitude: hit.point.lat,
                longitude: hit.point.lng,
                country: hit.country,
                state: hit.state,
                city: hit.city,
                street: hit.street,
                housenumber: hit.housenumber,
                postcode: hit.postcode
            }));
        } else {
            throw new Error('No suggestions found for the given input');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
};

module.exports.getCaptainsInTheRadius = async (latitude, longitude, radius) => {
    return await captainmodel.find({
        'vehicle.location': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude] // MongoDB expects [longitude, latitude]
                },
                $maxDistance: radius * 1000 // Convert to meters
            }
        }
    });
};